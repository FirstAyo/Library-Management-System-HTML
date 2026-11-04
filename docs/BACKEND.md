# Backend integration contract

## Switch the adapter

In `common/js/config.js`, set `mode: 'api'` and `apiBaseUrl: '/api/v1'` (or the actual API base URL). The mode defaults to `demo`. Browser configuration is public; never include secrets or database credentials. Configure `publicBookPath` when a backend renders public detail URLs, for example `books/{id}`. Without it API mode uses `client/book-details.html?id=…`.

All requests include `credentials: 'include'`. Implement a server session using Secure, HttpOnly cookies, appropriate SameSite settings, CSRF protection and server-side role/ownership checks. Client role guards only control navigation. Return the CSRF token in a server-rendered `<meta name="csrf-token" content="…">` before mutation requests. A cross-origin API needs an explicit trusted CORS origin with credentials, compatible cookies, and an updated `connect-src` hosting policy. Prefer a same-origin API proxy.

## JSON conventions

Success: `{ "data": VALUE }`. A session may be `{ "data": null }`. Logout may return HTTP 204. Failures use a non-2xx status with `{ "error": { "message": "Useful explanation", "fields": { "title": "Required" } } }`. Use 401 for expired/absent sessions, 403 for permission failures, 404 for missing records, 409 for inventory conflicts, and 422 for field validation. Field names match the HTML form names.

Collection endpoints accept either `{ "data": [ … ] }` or cursor pages `{ "data": { "items": [ … ], "nextCursor": "opaque-cursor-or-null" } }`. The adapter follows `?cursor=` until complete, then the interface filters/sorts/paginates locally. For a large catalog, replace this aggregation with server-side search/filter/page calls and update the affected view. The current interface does not claim to virtualize an unlimited dataset.

## Endpoints

All paths below are relative to `apiBaseUrl`.

| Method | Path | Input / result | Access |
| --- | --- | --- | --- |
| GET | /auth/session | User or null | Public |
| POST | /auth/login | `{email,password}` → User | Public |
| POST | /auth/register | `{name,email,password}` → authenticated User | Public |
| POST | /auth/logout | Empty → 204 | Session |
| GET | /books | Book collection | Public |
| POST | /books | Book fields → saved Book | Admin |
| PATCH | /books/:id | Updated Book fields → saved Book | Admin |
| GET | /members | Member collection with activeLoans | Admin |
| GET | /loans | Loan collection; members receive only their loans | Session |
| POST | /loans | `{bookId,memberEmail,issueDate,dueDate}` → Loan | Admin |
| POST | /loans/:id/return | Empty → updated Loan | Admin |
| POST | /loans/:id/renew | Empty → updated Loan | Owning member |
| GET | /reservations | Reservation collection; scoped to owner for members | Session |
| POST | /reservations | `{bookId}` → Reservation | Session |
| PATCH | /reservations/:id | `{status:"cancelled"}` → Reservation | Owner or admin |
| GET | /account | User | Session |
| PATCH | /account | `{name}` → updated User | Session |
| GET | /activity | Activity collection, newest first | Admin |

Registration is expected to establish a session before returning the User. If your backend uses verification emails or approval instead, adapt the registration view to that flow. Fines, payments, password recovery, account email changes and support messaging need their own services and product policies; the template does not pretend those exist.

## Data shapes

IDs may be strings or numbers; comparisons normalize to strings. Dates use `YYYY-MM-DD`; activity timestamps use ISO 8601 with a timezone. The backend should use a configured library timezone for due-date rules.

```json
{
  "User": {"email":"user@demo.com","name":"Alex Morgan","role":"user"},
  "Book": {"id":"b1","title":"Example","author":"Example Author","isbn":"","category":"Fiction","year":2025,"copies":3,"available":2,"description":"Catalog description"},
  "Member": {"id":"m1","name":"Alex Morgan","email":"user@demo.com","joined":"2025-01-01","status":"active","activeLoans":1},
  "Loan": {"id":"l1","bookId":"b1","memberEmail":"user@demo.com","issueDate":"2026-11-04","dueDate":"2026-11-18","returned":false,"renewals":0},
  "Reservation": {"id":"r1","bookId":"b1","memberEmail":"user@demo.com","date":"2026-11-04","status":"pending"},
  "Activity": {"id":"a1","text":"Issued a book","date":"2026-11-04T17:00:00Z"}
}
```

Roles are `admin` or `user`. Reservation states are `pending`, `fulfilled`, `cancelled`. Returned loans may include `returnDate`.

## Transactions and inventory

Use database transactions/locking when issuing a copy, recording a return and fulfilling a reservation. Reject insufficient inventory and duplicate active loans; do not trust the displayed availability. Model individual physical copies/barcodes on the server when required, then aggregate `copies` and `available` into the Book response. The current UI selects a title and does not capture a physical barcode.

An issue must update inventory, create a loan, fulfil the member's matching pending reservation and log activity together. Returns must be idempotent or explicitly reject already-returned records. Demo renewals allow one extension of 14 days, reject overdue loans and reject other members' pending reservations. Mirror or deliberately replace these policies server-side. Add idempotency keys where your production request/retry policy requires them.

## SEO integration

Changing metadata in browser JavaScript does not produce reliable social crawler previews. Render title, description, canonical, Open Graph, Twitter and Book JSON-LD in the initial response for each real book. The supplied generator prerenders demo books; for live data, export the catalog into the generation input during builds, or render public detail routes on the server. Newly added browser-local books are demo records, not published SEO pages.
