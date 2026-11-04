# Deployment and customization

The project is currently a local template; no hosting account or real backend is configured.

1. Update `common/js/config.js` with the API mode/base URL, public book route and your intended support integration. Implement and test the endpoints in `BACKEND.md` first.
2. Replace demonstration catalog/member/loan data with approved public content. Keep personal/member data on the server; `data/*.json` is publicly fetchable in demo mode.
3. Customize colors in `common/css/folio.css`, page content in `pages-*.js`, the Folio brand in the shared shell and generator, and `common/assets/social-card.png` (1200 × 630). The included PowerShell social-card generator recreates the supplied graphic on Windows.
4. Run `npm test` and `npm run check`.
5. Run `npm run build -- --site https://your-real-domain/` (a deployment under a subdirectory can use `https://your-real-domain/library/`). Upload the generated `release/` contents to the corresponding public directory.
6. Configure HTTPS and the session cookie, CSRF, authorization and cache rules on the backend. Add appropriate security headers on your host. The development server is a loopback preview, not a production server.
7. Confirm every public URL returns the expected HTML/status. Configure real missing book routes to return 404, and use redirects when moving public URLs. The static JavaScript missing-book state alone cannot set an HTTP status.

## SEO behavior

`npm run generate` writes local-preview metadata using `http://localhost:4173/`. The production build regenerates metadata, canonical URLs, Open Graph/Twitter URLs, `sitemap.xml` and `robots.txt` using your explicit `--site` URL, without changing the local source pages. The sitemap contains only the landing page, catalog and prerendered book pages.

Admin/account/auth pages use `noindex,follow` and are omitted from the sitemap. Robots exclusions reduce crawling and do not secure data. Enforce authentication on backend endpoints and never expose private records in static HTML/JSON. Configure `X-Robots-Tag: noindex` on private backend responses as appropriate. If API mode no longer serves the demo static detail routes, replace the sitemap and generated pages with the real public routes as part of deployment.

The default social graphic is shared across pages. Titles/descriptions and Book structured data are specific to each generated title. No search rankings, rich-result eligibility or crawler indexing are guaranteed.

## Distribution

The release contains current HTML pages, `common/css/folio.css`, the active JavaScript modules, favicon/social image, and demo JSON fixtures. It excludes old scripts/styles, documentation, test files, package files, tooling and source-control data. API deployments should omit private demo data entirely and replace static demo book content with their actual catalog. No network upload occurs during the build.

## Accessibility

The interface includes semantic landmarks, labels, table captions/headers, visible focus, a skip link, responsive layouts, native modal dialogs, error announcements, live feedback and reduced-motion styles. The design targets WCAG 2.2 AA. A full assistive-technology audit and certification are not included; the verification record describes what was actually checked.
