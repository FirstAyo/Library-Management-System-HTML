import { config } from './config.js';
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const root = new URL('../../', import.meta.url);
export const url = path => new URL(path, root).href;
export const today = () => new Date().toISOString().slice(0, 10);
export const date = value => value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value.length === 10 ? value + 'T12:00:00' : value)) : '—';
const paths = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1zM12 5v15"/>',
  users: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M21 21v-3a6 6 0 0 0-4-5"/>',
  issue: '<path d="M3 5h11v15H3zM17 7l4 4-4 4M10 11h11"/>',
  return: '<path d="M10 5h11v15H10M7 7l-4 4 4 4M3 11h12"/>',
  bookmark: '<path d="M6 3h12v19l-6-4-6 4z"/>',
  chart: '<path d="M3 3v18h18M7 16v-5M12 16V7M17 16V4"/>',
  search: '<circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2M12 21v2M1 12h2M21 12h2M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
  moon: '<path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11z"/>',
  logout: '<path d="M9 3H3v18h6M10 12h11m-5-5 5 5-5 5"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 3 3v2M12 17h.01"/>',
  card: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M6 15h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5"/>',
  leaf: '<path d="M20 3C8 2 2 8 5 15c6 6 15-1 15-12zM3 22 16 8"/>',
};
export const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.book}</svg>`;
export const link = (path, text, cls = 'btn', name = '') => `<a class="${cls}" href="${url(path)}">${name ? icon(name) : ''}${text}</a>`;
export const badge = (text, type = '') => `<span class="badge ${type}">${esc(text)}</span>`;
export const head = (title, description, action = '') => `<div class="page-head"><div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${action}</div>`;
export const section = (title, description = '', action = '') => `<div class="section-head"><div><h2>${esc(title)}</h2>${description ? `<p>${esc(description)}</p>` : ''}</div>${action}</div>`;
export const coverClass = b => `cover-${[...String(b.id)].reduce((a,c) => a + c.charCodeAt(0), 0) % 6}`;
export const cover = b => `<div class="book-art ${coverClass(b)}" aria-hidden="true"><div class="book-cover"><b>${esc(b.title)}</b><span>${esc(b.author)}</span></div></div>`;
export const bookPath = b => config.publicBookPath ? config.publicBookPath.replace('{id}',encodeURIComponent(b.id)) : config.mode !== 'api' && /^([1-9]|[12]\d|30)$/.test(String(b.id)) ? `books/${b.id}.html` : `client/book-details.html?id=${encodeURIComponent(b.id)}`;
export const tile = b => `<article class="card book-tile">${cover(b)}<div class="category">${esc(b.category)}</div><h3><a href="${url(bookPath(b))}">${esc(b.title)}</a></h3><p>${esc(b.author)}</p><div class="flex between">${badge(b.available > 0 ? `${b.available} available` : 'On loan', b.available > 0 ? 'ok' : 'warn')}${link(bookPath(b), 'Details', 'btn small-btn')}</div></article>`;
export const titleCell = b => `<div class="title-cell"><span class="mini-cover ${coverClass(b)}" aria-hidden="true">${esc(b.title[0])}</span><div><strong>${esc(b.title)}</strong><small>${esc(b.author)}</small></div></div>`;
export const table = (headers, rows, caption) => `<div class="table-wrap" tabindex="0" role="region" aria-label="${esc(caption)}"><table class="table"><caption class="sr-only">${esc(caption)}</caption><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${headers.length}">No records match your selection.</td></tr>`}</tbody></table></div>`;
export const empty = (title, message, action = '') => `<div class="empty">${icon('book')}<h2>${esc(title)}</h2><p>${esc(message)}</p>${action}</div>`;
export const field = (name, label, { type = 'text', value = '', required = true, attrs = '', hint = '' } = {}) => `<div class="field"><label for="${name}">${label}</label><input class="input" id="${name}" name="${name}" type="${type}" value="${esc(value)}" ${required ? 'required' : ''} ${attrs} ${hint ? `aria-describedby="${name}-hint"` : ''}>${hint ? `<small id="${name}-hint">${hint}</small>` : ''}</div>`;
export const selectField = (name, label, options, value = '') => `<div class="field"><label for="${name}">${label}</label><select class="input" id="${name}" name="${name}" required><option value="">Select ${label.toLowerCase()}</option>${options.map(([id,text]) => `<option value="${esc(id)}" ${String(value) === String(id) ? 'selected' : ''}>${esc(text)}</option>`).join('')}</select></div>`;
export const formError = '<div class="form-error" role="alert" tabindex="-1"></div>';
export function toast(message, error = false) { const el = document.getElementById('toast'); el.setAttribute('role',error ? 'alert' : 'status'); el.textContent = message; clearTimeout(toast.timer); toast.timer = setTimeout(() => el.textContent = '', 8000); }
export function formHandler(id, handler) {
  document.getElementById(id).addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget; const button = form.querySelector('[type="submit"]'); const error = form.querySelector('.form-error');
    if (form.getAttribute('aria-busy') === 'true') return;
    error.textContent = ''; button.disabled = true; const text = button.textContent; button.textContent = 'Please wait…'; form.setAttribute('aria-busy', 'true');
    try { await handler(Object.fromEntries(new FormData(form)), form); }
    catch (e) { error.textContent = e.message; error.focus(); Object.entries(e.fields || {}).forEach(([name]) => form.elements.namedItem(name)?.setAttribute('aria-invalid', 'true')); if (e.status === 401) document.dispatchEvent(new Event('session-expired')); }
    finally { button.disabled = false; button.textContent = text; form.removeAttribute('aria-busy'); }
  });
  document.getElementById(id).addEventListener('input', event => event.target.removeAttribute('aria-invalid'));
}
export function confirmAction(title, message, action) {
  const dialog = document.getElementById('confirm-dialog');
  dialog.innerHTML = `<h2 id="dialog-title">${esc(title)}</h2><p>${esc(message)}</p><div class="form-actions"><button class="btn" data-close autofocus>Go back</button><button class="btn primary" data-confirm>Confirm</button></div>`;
  dialog.querySelector('[data-close]').onclick = () => dialog.close();
  dialog.querySelector('[data-confirm]').onclick = async event => {
    event.target.disabled = true;
    try { await action(); dialog.close(); if (!document.activeElement || document.activeElement === document.body) document.getElementById('main')?.focus(); } catch (e) { dialog.close(); toast(e.message, true); if (e.status === 401) document.dispatchEvent(new Event('session-expired')); }
  };
  dialog.showModal();
}
export function searchable({ items, filter, render, target, pageSize = 8 }) {
  let page = 1;
  const paint = () => {
    const list = items.filter(filter); const pages = Math.max(1, Math.ceil(list.length / pageSize)); page = Math.min(page, pages);
    target.innerHTML = render(list.slice((page - 1) * pageSize, page * pageSize));
    document.getElementById('pagination').innerHTML = `<span role="status">${list.length ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, list.length)}` : '0'} of ${list.length} results</span><div class="flex"><button class="btn small-btn" id="previous" ${page === 1 ? 'disabled' : ''}>Previous</button><span>Page ${page} of ${pages}</span><button class="btn small-btn" id="next" ${page === pages ? 'disabled' : ''}>Next</button></div>`;
    const focusPage = preferred => { const button = document.getElementById(preferred); (button.disabled ? document.querySelector('#pagination button:not(:disabled)') : button)?.focus(); };
    document.getElementById('previous').onclick = () => { page--; paint(); focusPage('previous'); };
    document.getElementById('next').onclick = () => { page++; paint(); focusPage('next'); };
  };
  document.querySelectorAll('[data-filter]').forEach(el => el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => { page = 1; paint(); })); paint();
}
