import { config } from '../config.js';
import { request } from '../api.js';
import { demo } from './demo.js';
const id = value => encodeURIComponent(value);
async function collection(path) {
  const items = [], seen = new Set(); let cursor;
  do {
    const result = await request(path + (cursor ? `?cursor=${id(cursor)}` : ''));
    if (Array.isArray(result)) return items.concat(result);
    if (!Array.isArray(result?.items)) throw new Error('The server returned an invalid collection.');
    items.push(...result.items); cursor = result.nextCursor;
    if (cursor && (seen.has(cursor) || seen.size >= 1000)) throw new Error('The server returned invalid pagination.');
    if (cursor) seen.add(cursor);
  } while (cursor);
  return items;
}
const api = {
  session: () => request('/auth/session'),
  login: input => request('/auth/login', { method: 'POST', body: input }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  register: input => request('/auth/register', { method: 'POST', body: input }),
  books: () => collection('/books'),
  saveBook: input => request(input.id ? `/books/${id(input.id)}` : '/books', { method: input.id ? 'PATCH' : 'POST', body: input }),
  members: () => collection('/members'),
  loans: () => collection('/loans'),
  issue: input => request('/loans', { method: 'POST', body: input }),
  returnLoan: value => request(`/loans/${id(value)}/return`, { method: 'POST' }),
  renew: value => request(`/loans/${id(value)}/renew`, { method: 'POST' }),
  reservations: () => collection('/reservations'),
  reserve: bookId => request('/reservations', { method: 'POST', body: { bookId } }),
  cancelReservation: value => request(`/reservations/${id(value)}`, { method: 'PATCH', body: { status: 'cancelled' } }),
  profile: input => request('/account', input ? { method: 'PATCH', body: input } : {}),
  activity: () => collection('/activity'),
};
export const services = config.mode === 'api' ? api : demo;
