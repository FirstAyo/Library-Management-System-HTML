# Verification record

Run date: November 4, 2026. This records observed checks, not an accessibility certification or a production-backend validation.

## Automated checks

`npm test`: **6 tests passed**, no failures.

- Admin/member permissions and rejected incorrect credentials.
- Member-specific loan visibility.
- Issue/return inventory consistency and reservation fulfilment.
- Duplicate loan/reservation prevention and invalid member/date handling.
- Renewal limit and date arithmetic across month/year boundaries.
- Profile/session updates, reservation cancellation/re-reservation, persisted records.
- API cookies, CSRF header, JSON/204/null-session handling, validation fields, malformed responses, network and abort failures.
- Safe login redirects, including rejection of external URLs, auth loops and unauthorized admin routes.

`npm run check`: **50 HTML pages checked**. JavaScript syntax, local script/style references, page metadata, one initial H1 per page, landmarks/skip links/live-feedback markup, book content and parsed Book JSON-LD passed. Social PNG dimensions verified at 1200 × 630.

`npm run build -- --site https://library.example.test/`: **passed**. Produced a static `release/` with canonical/sitemap/social URLs for that reserved test domain. This is a packaging smoke test, not a real deployment. Rebuild using your actual public domain before uploading. Local source metadata remains configured for localhost.

## Browser checks

The previous Chrome pass observed the landing and sign-in screens, but navigation was interrupted by the Computer Use URL-confidence check. A new browser pass is in progress; its confirmed results will be added here when available. No admin/member browser workflow is recorded as passed yet.

## Limits

- Demo logic is tested with in-memory browser-storage substitutes; a real backend is not present.
- Static/semantic checks do not prove visual accessibility or screen-reader behavior. A complete assistive-technology audit remains a separate validation step.
- No real payment, email, registration service, or hosting has been configured or tested.
