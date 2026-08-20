# CowinMagnet product and daily News automation report

Date: 2026-08-20 (Asia/Shanghai)

## Scope and safeguards

- The existing Next.js App Router, PostgreSQL-backed CMS, locale routes, inquiry routes and product URLs were retained.
- No product, customer, inquiry, CMS record or media asset was deleted.
- Production database changes were preceded by timestamped JSON backups under `.backups/`. The News triage backups include the original `cms_items` payloads and can be restored per slug.
- The raw 300-source input is preserved verbatim in `data/news/cowinmagnet-source-list.raw.md`. It is never used as a crawler URL list until an entry has passed validation.

## Audit findings

| Area | Confirmed result |
| --- | --- |
| Product catalog | 88 real product records across 7 detected product families; 2 possible duplicate groups require a supplier/data review rather than an automatic merge. |
| Product detail safety | Existing model references remain visible. Static specification values without an approved per-model source now render as `Available on request` rather than as supplier-confirmed claims. |
| News data | 104 published CMS News records were inspected. 102 have been retained but set to `seoIndexable: false` and `editorialStatus: needs-review-auto-news`; they remain recoverable by URL and database record but are excluded from News lists, RSS and sitemaps. |
| Current bad publication | The RFID article was confirmed to have an unrelated source. It is now held for review and no longer appears in the local production News list. |
| Existing RCDD guide | Its stable URL and canonical path are retained. The reader-facing document is a technical guide, has one H1, six reader-facing H2 sections, a single FAQ and the quote CTA. |
| OpenAI configuration | The production-local environment inspected for this audit did not contain `OPENAI_API_KEY`. The system has a controlled source-bound fallback, but automatic publication must only be enabled in Vercel after the runtime secret is confirmed. |

## 300-source catalog

- Imported source entries: 300
- Canonical domains after normalization: 296
- Duplicate canonical-domain records retained in the raw catalog: 4
- Immediately eligible bootstrap sources: 6, all explicitly configured with a public RSS endpoint
- Pending validation and disabled: 294
- Discovery-only sources remain preserved but ineligible as sole evidence.

The supplied section labels state 50 food/pharma and 40 magnetics/engineering entries; the actual supplied domain counts are 40 and 50 respectively. The raw file was not altered. The normalization report records the observed counts.

## Implemented controls

1. A persistent source catalog now carries ordinal, raw entry, canonical domain, source group, discovery method, tier, validation, robots result, last check/use time and retry state.
2. Only `active + verified + robotsAllowed + RSS/API` sources can enter discovery. Unverified legacy sources are explicitly deactivated.
3. Candidate relevance now requires a concrete process/equipment signal. Generic industry wording cannot make RFID, education or general corporate news publishable.
4. A broad sector such as recycling, cement or aggregate also requires an actual processing or operating context.
5. A published citation starts a 14-day source rotation lock. Discovery alone does not consume a source slot.
6. Daily scheduling is configured for 08:10 discovery and 09:45 publish in Asia/Shanghai (`00:10` and `01:45` UTC). The current publisher has a 24-hour interval and retains the existing authenticated, idempotent, frontend-verification gate.
7. Every run keeps source, rejection and delivery logs. A CMS write is not marked successful until News list/detail/RSS/sitemap checks pass.

## Files and migration

- `data/news/cowinmagnet-source-list.raw.md`
- `data/news/source-catalog.seed.csv`
- `data/news/source-catalog.seed.json`
- `data/news/source-catalog.normalization-report.md`
- `lib/news/sourceCatalog.js`
- `lib/news/sourceValidator.js`
- `lib/news/scopeGate.js`
- `lib/newsOperations.js`
- `lib/newsAutomationStore.js`
- `data/news-automation-sites.json`
- `vercel.json`
- `db/migrations/20260820_news_daily_source_catalog.sql`
- `scripts/build-news-source-catalog.mjs`
- `scripts/sync-news-source-catalog.mjs`
- `scripts/triage-published-news.mjs`
- `scripts/generate-product-content-audit.mjs`
- `components/ProductDetailExperience.tsx`
- `components/DateBadge.tsx`

The additive database migration was applied. It adds source catalog and validation fields plus an index. It does not drop a table or column.

## Verification evidence

- TypeScript: passed.
- Automated tests: 56 passed, 0 failed.
- ESLint: 0 errors; 8 pre-existing warnings remain (legacy `<img>` usage and locale cookie assignment).
- Production build: passed, 864 static pages generated.
- Local production HTTP: `/en/news`, `/en/products/drawer-magnet`, the RCDD guide, `/news-sitemap.xml` and `/news/rss.xml` each returned HTTP 200.
- Local list text check: `chipless RFID` absent; `Eco-Cycle` absent; RCDD remains visible.

## Data still required before automatic publication

1. Confirm `OPENAI_API_KEY` and `NEWS_AUTO_PUBLISH=true` in the Vercel Production environment only after the new build is deployed.
2. Approve more RSS/API endpoints from the supplied list. The remaining 294 entries are deliberately disabled until their robots policy, public discovery endpoint and editorial suitability are verified.
3. Provide approved per-model product datasheets for any technical number intended for public display. Existing fields without that proof remain project-confirmation fields.
4. Review the 102 retained News records individually before restoring indexability. The exact status and reason for each are in `docs/audits/news-published-triage.csv`.

## Rollback

1. Restore a retained News payload from the corresponding `.backups/news-triage-*/cms-news-before.json` entry, then set `seoIndexable: true` only after review.
2. Revert the additive migration only by a reviewed migration that drops the newly added source columns/index; do not run it while the new code is active.
3. Revert the code commit and redeploy the prior Vercel deployment if a runtime regression is observed.
