# Production verification

Verified: 2026-08-11 (Asia/Shanghai)

## Deployment and data safety

- Pre-migration data backup: `.backups/news-automation-2026-08-11T05-58-28-550Z/`.
- Additive migration applied: `db/migrations/20260811_news_12h_48h_multisite.sql`.
- Production deployment before the final CMS-state consistency patch: `dpl_DMLLCMzk5hg6Kov5bwPhxh84thKS`.
- No historical News or Blog records were deleted. The legacy triage keeps records reversible while hiding non-indexable legacy News from public discovery.

## Live workflow evidence

The production ingest endpoint completed at `2026-08-11T06:17:16.340Z` with status `success` after discovering 42 feed entries, accepting 8 eligible candidates and rejecting 34. It created no public article.

The production publish endpoint completed at `2026-08-11T06:18:36.495Z` with status `published_success` and created:

- Public URL: `https://www.cowinmagnet.com/en/news/us-2bn-domestic-mining-initiatives`
- Site id: `cowinmagnet-production`
- Content origin: `news-automation`
- Source URL: `https://www.mining-technology.com/news/us-2bn-for-domestic-mining-initiatives/`

The persisted delivery check at `2026-08-11T06:18:36.479Z` recorded all required conditions as true:

| Check | Result |
| --- | --- |
| News list HTTP status | 200 |
| News detail HTTP status | 200 |
| News sitemap HTTP status | 200 |
| News list contains article | true |
| News detail visible | true |
| Canonical valid | true |
| JSON-LD valid | true |
| Source panel visible | true |
| Blog isolated | true |

## Scheduling

- Vercel runs the ingest route twice each UTC day. The route is limited to discovery, normalization, verification, deduplication, scoring and candidate persistence.
- Vercel calls the publisher on the same cadence, but the application has a site-scoped 48-hour guard. The next normal publish is therefore due only after the 48-hour interval, not on every cron call.
- Every run is persisted in `news_publication_runs`; candidate, lock and audit records are site-scoped.

## Final consistency correction

The first successful article correctly reached `published_success` in `generated_articles`, but its CMS payload retained the transitional `editorialStatus: frontend-verifying`. The final patch promotes both `status` and `editorialStatus` atomically only after delivery verification passes, and changes a failed delivery to an explicit draft state. The existing article is updated through the same data contract during final deployment verification.

## Validation

- `npm test`: 47 passed, 0 failed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with 8 existing warnings and no errors.
- A browser automation attempt timed out while loading the live page, so the browser result is not claimed as evidence. The production delivery verifier and direct database query above are the evidence for the live front-end checks.

