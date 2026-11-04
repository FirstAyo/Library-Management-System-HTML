# Folio Library template

A responsive, buildless HTML/CSS/JavaScript library interface with 20 application pages, 30 prerendered public book pages, light/dark themes, and connected browser-local demo workflows. All catalog titles, names, and borrowing records are demonstration fixtures.

## Run locally

Requires Node.js 20 or later. There are no npm dependencies to install.

```sh
npm start
```

Open `http://localhost:4173/`. Use HTTP rather than opening HTML files directly: ES modules and JSON loading require a server.

| Role | Email | Password |
| --- | --- | --- |
| Administrator | admin@demo.com | admin123 |
| Member | user@demo.com | user123 |

Demo sessions are scoped to a browser tab (`sessionStorage`); records are stored on that origin in `localStorage` under `folio_demo_v1`. Signing out retains the records. Use test information only. The original `books_extra` and `loans_extra` records are imported on first initialization. Existing initialized demo data is not overwritten when fixtures change.

## Code map

- `common/css/folio.css`: design tokens, components, responsive layouts, themes.
- `common/js/app.js`: shared shell, role guards, navigation, session restoration.
- `common/js/pages-{public,admin,member}.js`: screen rendering and event wiring.
- `common/js/view.js`: escaped markup, forms, tables, pagination, dialogs, feedback.
- `common/js/services/demo.js`: demo storage and business rules.
- `common/js/services/index.js`: service adapter and API endpoints.
- `common/js/api.js`: JSON requests, cookies, CSRF header, timeout/error handling.
- `common/js/config.js`: public integration and route configuration.
- `scripts/generate-pages.mjs`: static HTML, metadata, book structured data, robots and sitemap generation.

The older page-specific scripts/styles are retained for reference but are not loaded by the upgraded pages. New changes belong in the shared modules listed above. Page HTML is generated: edit the generator for persistent changes to initial HTML and metadata, and the page modules for interactive content.

## Verify

```sh
npm test
npm run check
```

Tests cover service workflows and API/redirect behavior. Source checks inspect initial HTML, metadata, structured data, asset references, and JavaScript syntax. They do not certify WCAG compliance or replace browser testing. See `docs/VERIFICATION.md` for the actual verification record.

## Production and backend setup

See `docs/BACKEND.md` for API contracts and `docs/DEPLOYMENT.md` for deployment and SEO setup. A real backend, email, billing provider, password recovery, and hosting are not included. Demo registration and payments explain their unavailable status instead of reporting a successful operation.

```sh
npm run build -- --site https://YOUR-LIBRARY-DOMAIN/
```

This creates a fresh `release/` static directory with production canonical URLs. Replace the example with your actual public URL. Nothing is uploaded or deployed by the command.
