# CowinMagnet News media and citation repair report

Generated: 2026-08-21 (Asia/Shanghai)

## Changes

- Added product media resolution, source evidence extraction, external-image rights validation and controlled-media sync boundary modules.
- Added additive PostgreSQL tables for publication evidence, media records and quality checks.
- Added a stale publication-run recovery script and production environment-name inspection script.
- Added a production News media repair audit and queue report.
- Updated the publisher to require a resolved COWIN product hero image and verified source summary before it writes a published News item.
- Updated the structured renderer to show source context, source summaries, source links and the public reporting note.
- Updated News image rendering so unknown external hosts do not hotlink into public pages.
- Updated the older News media admin route so it will only use an external image after both rights validation and a controlled-storage copy are present.

## Verified observations

- Vercel runtime diagnostics identified a 120-second timeout on `/api/automation/news-publish` at 2026-08-21T01:45:04Z.
- A stale production `daily-publish` run was recovered safely: 1 run and 1 candidate released.
- Production discovery completed at 2026-08-21T00:10:00Z with 62 discovered, 2 accepted and 60 rejected candidates.
- Historical News media audit: 104 inspected, 1 repairable and 103 retained for factual review.
- A live publication verification was attempted after deployment preparation. The selected source returned HTTP 403, so the publisher returned `retry_pending` and created no CMS article. The next revision classifies this as a non-retryable candidate failure so the source is not retried indefinitely.

## Safe behavior when information is incomplete

- A News item without an exact, owned COWIN product image remains a draft/rejected item.
- A source without a readable verified summary remains a draft/rejected item.
- A source image without explicit reuse rights and a controlled-storage copy is never published or hotlinked.
- Historical records that cannot be safely repaired retain their existing URL and date and are flagged in the repair queue instead of receiving fabricated text, images or technical data.

## Required verification before production publication

Run the database migration, tests and build; deploy the verified build; set the production `NEWS_AUTO_PUBLISH` flag; then run one authenticated News publish dry run and verify the list, detail, sitemap and RSS routes. The final public verification record must show the new article in the News list and detail route before a publication run is considered successful.
