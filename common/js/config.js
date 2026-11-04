// Public configuration only. Never put API secrets in browser code.
export const config = Object.freeze({
  mode: 'demo', // 'demo' | 'api'
  apiBaseUrl: '/api/v1',
  requestTimeout: 15000,
  brand: 'Folio',
  currency: 'USD',
  renewalDays: 14,
  // Optional backend-rendered detail route, e.g. 'books/{id}'. Empty uses the static/demo routes.
  publicBookPath: '',
  supportEmail: '',
});
