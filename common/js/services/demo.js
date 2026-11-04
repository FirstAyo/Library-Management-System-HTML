const KEY = 'folio_demo_v1';
const SESSION = 'folio_session_v1';
const root = new URL('../../../', import.meta.url);
const today = () => new Date().toISOString().slice(0, 10);
export const addDays = (date, days) => { const value = new Date(date + 'T12:00:00Z'); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); };
const uid = () => globalThis.crypto?.randomUUID?.() || String(Date.now()) + Math.random().toString(36).slice(2);
let state;
let pending;
export async function load() {
  if (state) return state;
  if (pending) return pending;
  pending = (async () => {
    const stored = localStorage.getItem(KEY);
    if (stored) { try { state = JSON.parse(stored); if (state.version === 1) return state; } catch {} }
    const [books, members, loans, reservations] = await Promise.all(['books', 'members', 'loans', 'reservations'].map(async name => {
      const response = await fetch(new URL(`data/${name}.json`, root));
      if (!response.ok) throw new Error('Unable to load the library. Please try again.');
      return response.json();
    }));
    // Retain books/loans added in the original template.
    const legacy = key => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
    books.push(...legacy('books_extra').filter(b => !books.some(x => String(x.id) === String(b.id))));
    loans.push(...legacy('loans_extra').filter(l => !loans.some(x => String(x.id) === String(l.id))));
    if (!members.some(m => m.email === 'user@demo.com')) members.push({ id: uid(), name: 'Alex Morgan', email: 'user@demo.com', joined: today() });
    // Availability is derived from physical copies less active loans.
    state = { version: 1, books, members: members.map(m => ({ ...m, status: 'active' })), loans, reservations: reservations.map(r => ({ ...r, status: 'pending' })), activity: [] };
    save(); return state;
  })().catch(error => { pending = null; throw error; });
  return pending;
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
function log(text) { state.activity.unshift({ id: uid(), text, date: new Date().toISOString() }); state.activity = state.activity.slice(0, 60); save(); }
function fail(message) { throw new Error(message); }
function session() { try { return JSON.parse(sessionStorage.getItem(SESSION)); } catch { return null; } }
function member() { const user = session(); if (!user) { const error = new Error('Please sign in to continue.'); error.status = 401; throw error; } return user; }
function admin() { if (member().role !== 'admin') fail('An administrator account is required.'); }
function book(id) { return state.books.find(b => String(b.id) === String(id)) || fail('This book was not found.'); }
function available(b) { return Math.max(0, b.copies - state.loans.filter(l => String(l.bookId) === String(b.id) && !l.returned).length); }
export const demo = {
  async session() { return session(); },
  async login({ email, password }) {
    await load();
    const role = email === 'admin@demo.com' && password === 'admin123' ? 'admin' : email === 'user@demo.com' && password === 'user123' ? 'user' : null;
    if (!role) fail('Email or password is incorrect. Use one of the demo accounts below.');
    const m = state.members.find(m => m.email === email);
    const user = { email, role, name: role === 'admin' ? 'Jamie Parker' : m?.name || 'Alex Morgan' };
    sessionStorage.setItem(SESSION, JSON.stringify(user)); return user;
  },
  async logout() { sessionStorage.removeItem(SESSION); },
  async register() { fail('Account registration requires a connected backend. You can explore with the member demo account.'); },
  async books() { await load(); return state.books.map(b => ({ ...b, available: available(b) })); },
  async saveBook(input) {
    await load(); admin();
    const copies = Number(input.copies), year = Number(input.year);
    if (!input.title?.trim() || !input.author?.trim() || !input.category?.trim()) fail('Title, author, and category are required.');
    if (!Number.isInteger(copies) || copies < 1) fail('Copies must be a positive whole number.');
    if (!Number.isInteger(year) || year < 1 || year > new Date().getFullYear() + 1) fail('Enter a valid publication year.');
    const existing = input.id ? book(input.id) : null;
    if (existing && copies < state.loans.filter(l => String(l.bookId) === String(existing.id) && !l.returned).length) fail('Copies cannot be fewer than active loans.');
    const clean = { title: input.title.trim(), author: input.author.trim(), category: input.category.trim(), isbn: input.isbn?.trim() || '', description: input.description?.trim() || '', copies, year };
    if (existing) Object.assign(existing, clean); else state.books.push({ ...clean, id: uid() });
    log(`${existing ? 'Updated' : 'Added'} “${clean.title}”`); return clean;
  },
  async members() { await load(); admin(); return state.members.map(m => ({ ...m, activeLoans: state.loans.filter(l => l.memberEmail === m.email && !l.returned).length })); },
  async loans() { await load(); const user = member(); return state.loans.filter(l => user.role === 'admin' || l.memberEmail === user.email).map(l => ({ ...l })); },
  async issue(input) {
    await load(); admin(); const b = book(input.bookId);
    const m = state.members.find(m => m.email === input.memberEmail && m.status === 'active');
    if (!m) fail('Choose an active library member.');
    if (!available(b)) fail('There are no available copies of this book.');
    if (!input.issueDate || !input.dueDate || input.dueDate <= input.issueDate) fail('The due date must be after the issue date.');
    if (state.loans.some(l => String(l.bookId) === String(b.id) && l.memberEmail === m.email && !l.returned)) fail('This member already has an active loan for this book.');
    const loan = { id: uid(), bookId: b.id, memberEmail: m.email, issueDate: input.issueDate, dueDate: input.dueDate, returned: false, renewals: 0 };
    state.loans.push(loan);
    state.reservations.filter(r => String(r.bookId) === String(b.id) && r.memberEmail === m.email && r.status === 'pending').forEach(r => r.status = 'fulfilled');
    log(`Issued “${b.title}” to ${m.name}`); return loan;
  },
  async returnLoan(id) {
    await load(); admin(); const loan = state.loans.find(l => String(l.id) === String(id));
    if (!loan || loan.returned) fail('This loan is already returned or could not be found.');
    loan.returned = true; loan.returnDate = today(); log(`Returned “${book(loan.bookId).title}”`); return { ...loan };
  },
  async renew(id) {
    await load(); const user = member(); const loan = state.loans.find(l => String(l.id) === String(id) && l.memberEmail === user.email);
    if (!loan || loan.returned) fail('An active loan is required.');
    if (loan.dueDate < today()) fail('This loan is overdue. Please contact the library to renew it.');
    if (loan.renewals >= 1) fail('This loan has already been renewed once.');
    if (state.reservations.some(r => String(r.bookId) === String(loan.bookId) && r.status === 'pending' && r.memberEmail !== user.email)) fail('Another member has reserved this book. Please return it by the due date.');
    loan.dueDate = addDays(loan.dueDate, 14); loan.renewals = (loan.renewals || 0) + 1; log(`Renewed “${book(loan.bookId).title}”`); return { ...loan };
  },
  async reservations() { await load(); const user = member(); return state.reservations.filter(r => user.role === 'admin' || r.memberEmail === user.email).map(r => ({ ...r })); },
  async reserve(bookId) {
    await load(); const user = member(); const b = book(bookId);
    if (state.reservations.some(r => String(r.bookId) === String(b.id) && r.memberEmail === user.email && r.status === 'pending')) fail('You already have an active reservation for this book.');
    if (state.loans.some(l => String(l.bookId) === String(b.id) && l.memberEmail === user.email && !l.returned)) fail('You already have this book on loan.');
    const r = { id: uid(), bookId: b.id, memberEmail: user.email, date: today(), status: 'pending' };
    state.reservations.push(r); log(`Reserved “${b.title}”`); return { ...r };
  },
  async cancelReservation(id) {
    await load(); const user = member(); const r = state.reservations.find(r => String(r.id) === String(id));
    if (!r || (user.role !== 'admin' && r.memberEmail !== user.email)) fail('Reservation not found.');
    if (r.status !== 'pending') fail('Only pending reservations can be cancelled.');
    r.status = 'cancelled'; log(`Cancelled reservation for “${book(r.bookId).title}”`); return { ...r };
  },
  async profile(input) {
    await load(); const user = member();
    if (input) { if (!input.name?.trim()) fail('Enter your full name.'); user.name = input.name.trim(); sessionStorage.setItem(SESSION, JSON.stringify(user)); const m = state.members.find(m => m.email === user.email); if (m) m.name = user.name; save(); }
    return user;
  },
  async activity() { await load(); admin(); return state.activity.map(a => ({ ...a })); },
};
