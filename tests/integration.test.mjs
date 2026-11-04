import test from 'node:test';
import assert from 'node:assert/strict';
import { request, ApiError } from '../common/js/api.js';
import { destination } from '../common/js/navigation.js';
globalThis.document = { querySelector: () => ({ content: 'test-csrf-token' }) };
test('API client preserves null sessions, includes cookies/CSRF, and decodes JSON', async () => {
  let call;
  globalThis.fetch = async (path, options) => { call = { path, options }; return new Response(JSON.stringify({ data: null }), { status: 200 }); };
  assert.equal(await request('/auth/session'), null);
  assert.equal(call.options.credentials, 'include');
  globalThis.fetch = async (path, options) => { call = { path, options }; return new Response(JSON.stringify({ data: { id: 1 } }), { status: 201 }); };
  assert.deepEqual(await request('/books', { method: 'POST', body: { title: 'A book' } }), { id: 1 });
  assert.equal(call.options.headers['X-CSRF-Token'], 'test-csrf-token');
  assert.deepEqual(JSON.parse(call.options.body), { title: 'A book' });
  assert.equal(call.path, '/api/v1/books');
  globalThis.fetch = async () => new Response(null, { status: 204 });
  assert.equal(await request('/auth/logout', { method: 'POST' }), null);
});
test('API failures preserve status/validation fields and explain invalid responses', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'Title is required.', fields: { title: 'Required' } } }), { status: 422 });
  await assert.rejects(request('/books'), e => e instanceof ApiError && e.status === 422 && e.fields.title === 'Required');
  globalThis.fetch = async () => new Response('<html>Proxy failure</html>', { status: 502 });
  await assert.rejects(request('/books'), e => e.status === 502 && /invalid response/.test(e.message));
  globalThis.fetch = async () => { throw new TypeError('Network failure'); };
  await assert.rejects(request('/books'), /Unable to connect/);
  globalThis.fetch = async () => { const e = new Error(); e.name = 'AbortError'; throw e; };
  await assert.rejects(request('/books'), /timed out/);
});
test('login redirects reject external URLs, auth loops, traversal and admin routes for members', () => {
  const root = new URL('https://library.example.test/template/');
  const user = { role: 'user' }, admin = { role: 'admin' };
  const fallback = 'https://library.example.test/template/client/home.html';
  for (const next of ['https://evil.example/path', '//evil.example/path', '/outside.html', '/template/login.html', '/template/logout.html', '/template/register.html', '/template/../private.html', '/template/admin/books.html', 'javascript:alert(1)']) assert.equal(destination(next, user, root), fallback);
  assert.equal(destination('/template/books/1.html', user, root), 'https://library.example.test/template/books/1.html');
  assert.equal(destination('/template/client/book-details.html?id=31', user, root), 'https://library.example.test/template/client/book-details.html?id=31');
  assert.equal(destination('/template/admin/books.html', admin, root), 'https://library.example.test/template/admin/books.html');
});
