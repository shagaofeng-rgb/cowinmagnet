# CowinMagnet Preimplementation Audit

Generated: 2026-08-20 (Asia/Shanghai)

## Confirmed architecture

- Application: Next.js 16 App Router with TypeScript and React 19.
- Product source: `data/products.ts`, with 88 static records and a reusable product detail experience.
- CMS and persistence: PostgreSQL-backed `cms_items`; News automation has dedicated PostgreSQL tables.
- Existing News: structured `ArticleDocument` data contract, `News` and `Blog` routes, News sitemap, RSS, frontend verification, site ID isolation, locking and retry support.
- Deployment: Vercel cron routes. Current schedule is 12-hour discovery plus a daily trigger whose code enforces a 48-hour publication interval.
- Sitemap maintenance: every three days, with optional Search Console sitemap submission only when configured.

## Verified baseline

- Product audit: 88 products, 7 product families, no missing primary product images, and 2 potential duplicate name groups requiring supplier confirmation.
- Content audit: 146 News and Blog records. Three are currently clean under the existing validator; 142 require structured review or remediation. This count is a conservative safety classification, not a deletion list.
- Production check: `/en/news` is available and shows four currently indexable entries. The RCDD guide renders with the intended structured guide content and working quote CTA.
- Production defect found: the News list renders `Invalid Date` for the RCDD date badge when an ISO timestamp is passed to a component that appends a second time suffix.
- Backup: `.backups/news-automation-2026-08-20T05-03-53-608Z/` contains read-only exports of `news_sources`, `news_candidates`, `generated_articles`, `news_publication_runs`, and `cms_items` before changes.

## Latest-rule reconciliation

The current instruction supersedes previous News cadence rules where they conflict:

- Current 12-hour discovery remains useful but must be changed to a daily staged Beijing-time workflow.
- Current 48-hour publication guard must be replaced with at-most-one qualified English News attempt per Asia/Shanghai calendar day.
- Current five-source allowlist must become a 300-entry raw catalog, with records starting as pending or inactive until verified. A raw entry is never automatically an eligible publishing source.
- Existing structured rendering and frontend verification are retained. Old legacy content is migrated or marked for review; records and URLs are not deleted.

## Safe direct implementation

1. Preserve the full source list and create a normalized, auditable source catalog.
2. Add source validation, source rotation, daily idempotency and configuration compatibility without weakening existing Cron authentication.
3. Fix the ISO date badge defect at template level.
4. Extend audits and data-gap reports using existing product/CMS records.
5. Retain current News and Blog separation, URLs, form flow and Search Console sitemap-only submission behavior.

## Requires a factual source or manual confirmation

- Product-specific technical values beyond the existing approved records.
- Supplier confirmation before resolving the two suspected duplicate product pairs.
- Rights confirmation for any external industry image; unverified images will not be used.
- Search Console submission remains a truthful `not configured` state until valid production credentials are present.

## Migration safeguards

- No content rows, media or public URLs will be hard deleted.
- The prior state is backed up before schema/configuration migration.
- Newly imported source entries default to non-publishable until validation records robots and source health.
- A daily job can skip with a recorded reason when no qualified source or product fact set passes the quality gate; it must never publish invented or unverified material.
