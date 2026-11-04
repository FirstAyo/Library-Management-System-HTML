import { config } from './config.js';

export class ApiError extends Error {
  constructor(message, status = 0, fields = {}) { super(message); this.status = status; this.fields = fields; }
}
export async function request(path, { method = 'GET', body, signal } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.requestTimeout);
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  try {
    const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
    const response = await fetch(config.apiBaseUrl.replace(/\/$/, '') + path, {
      method, credentials: 'include', signal: controller.signal,
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}), ...(csrf && method !== 'GET' ? { 'X-CSRF-Token': csrf } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    let payload = null;
    if (response.status !== 204) {
      try { payload = await response.json(); }
      catch { throw new ApiError('The server returned an invalid response. Please try again.', response.status); }
    }
    if (!response.ok) throw new ApiError(payload?.error?.message || 'The request could not be completed. Please try again.', response.status, payload?.error?.fields);
    return payload && Object.hasOwn(payload, 'data') ? payload.data : payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.name === 'AbortError' ? 'The request timed out. Please try again.' : 'Unable to connect. Check your connection and try again.');
  } finally { clearTimeout(timeout); signal?.removeEventListener('abort', abort); }
}
