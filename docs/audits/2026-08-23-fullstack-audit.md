# 2026-08-23 Full-Stack Audit

## Scope and baseline

- Baseline commit: `4ca138b` (`Center-WhatsApp-floating-action`); working tree was clean before this audit.
- Stack reviewed: Next.js 16.2.10 App Router, TypeScript, Vercel configuration, PostgreSQL-backed CMS/analytics, server route handlers, middleware, sitemap/RSS generation, and the protected admin application.
- The News publication workflow and its scheduled business logic were inspected as a shared dependency only. They were not changed in this audit.

## Confirmed checks

| Area | Evidence | Result |
| --- | --- | --- |
| Product routes | `scripts/verify-product-detail-pages.mjs --base-url=http://localhost:3112` | 88 of 88 passed, including one H1, Product and Breadcrumb JSON-LD, and inquiry context. |
| Sitemap routes | `scripts/audit-sitemap-http.mjs --url=http://localhost:3112/sitemap.xml --target-origin=http://localhost:3112 --concurrency=1` | 108 of 108 URLs returned 200. |
| Desktop/mobile visual QA | `reports/visual-qa/full-audit-patched/report.json` | 9 key page/viewport checks; no root horizontal overflow, failed resources, console errors, or broken images. |
| Type safety | `tsc --noEmit` | Passed. |
| Automated tests | `node --test tests/*.test.mjs` | 78 passed, 0 failed. |
| Production build | `next build --webpack` | Passed; 870 static pages generated. |
| Persistent layer | `scripts/audit-runtime-health.mjs` | Database configured and reachable; inquiry, analytics, and Blog webhook tables readable. |
| Production-mode health endpoint | `GET http://localhost:3113/api/analytics/health` | Returned `ok`, database status `ok`, and a recent-event count. |

## Fixed items

### Inquiry source integrity

- The public quote and inquiry forms now send the current page as `pageUrl`.
- Server-side storage accepts only COWIN's own paths and canonical URLs. External, `javascript:`, `data:`, malformed, and protocol-relative values are discarded.
- The protected inquiry list and detail view render source links only after the same validation.
- The inquiry API now rejects oversized bodies and invalid JSON shapes before validation or storage. It also avoids trusting browser-provided `x-forwarded-for` values.

### Mobile product readability

- The fixed right-side WhatsApp control could cover product hero copy on narrow viewports.
- Product hero copy now reserves space for the control below 760px without moving the control away from its requested right-side position.

### Analytics health endpoint

- The health route previously built the entire analytics dashboard, including historical visitor and attribution queries, inside a 1.5 second timeout.
- It now performs a lightweight recent-event count only, with a 3.5 second guard. Full aggregation remains available to the protected analytics dashboard.

### Audit reliability

- The sitemap HTTP audit used concurrent `HEAD` requests by default. On a local Next development server this could cause the checker itself to induce 500 responses.
- It now uses low-concurrency ranged `GET` requests by default. This produced a clean 108/108 local result.

### Frontend cleanup

- Moved locale-cookie persistence into a dedicated client helper, removing direct mutable-cookie hook warnings.
- Corrected the remaining unescaped apostrophe warning in the public News page.

## Security and data notes

- No database schema migrations, deletions, content rewrites, or News automation changes were performed.
- China mainland public-route blocking remains in `proxy.ts`; existing tests verify that admin and API allow-list behaviour is retained.
- Production public-route probes from this machine receive the intended China geo block. Sitemap, robots, RSS and admin login remain publicly reachable as configured.
- Local configuration has a database and cron secret but does not contain SMTP, admin-session, Search Console, or News auto-publish credentials. This report does not infer production secret availability from that local state.

## Remaining follow-up items

1. Five non-blocking ESLint warnings remain for deliberately controlled dynamic News image fallback branches. Moving them to `next/image` needs a separate News-media compatibility pass and was not combined with this locked workflow audit.
2. Node's standalone test runner reports module-type reparsing warnings for existing `.js` ES modules. Adding package-level module mode may affect the existing toolchain, so it was not changed without a dedicated migration.
3. The locally configured PostgreSQL driver warns that future SSL mode semantics will change. Pin the desired `sslmode` in the deployment connection string during the next database configuration review.
4. A credentialed admin workflow and a valid inquiry submission were not replayed to avoid creating a false customer lead or sending mail. Login page, auth boundaries, database readability, validation failures, and protected API behaviour were verified.

## Rollback

- No data migration is required.
- Revert this audit commit in Git, redeploy the prior Vercel deployment, then verify `/api/analytics/health`, `/api/inquiry`, `/en/products`, and `/admin/inquiries`.
