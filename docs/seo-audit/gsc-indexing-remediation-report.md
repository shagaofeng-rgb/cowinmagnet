# Google Search Console Indexing Remediation

Generated: 2026-08-22 (Asia/Shanghai)

## Baseline observed in Search Console

The supplied Page indexing screenshot reported 644 indexed URLs and 292 not indexed URLs:

- `Excluded by 'noindex' tag`: 73
- `Not found (404)`: 52
- `Page with redirect`: 7
- `Crawled - currently not indexed`: 15
- `Alternative page with proper canonical tag`: 24
- `Discovered - currently not indexed`: 118
- `Duplicate, Google chose different canonical than user`: 3

These are coverage-report buckets, not a list of current sitemap errors. The exact affected URL exports were not available in the screenshot and must be exported from Search Console before URL-specific redirects or canonical changes are made.

## Verified findings

- The live canonical sitemap audit found 158 URLs, all returning HTTP 200.
- `https://cowinmagnet.com/en` performs a one-hop 308 redirect to `https://www.cowinmagnet.com/en`, preserving the query string.
- Non-English routes intentionally emit `X-Robots-Tag: noindex, follow` while localized main content remains incomplete. This is retained deliberately and should not be submitted for index validation.
- Legacy Blog records with public editorial-control text, malformed legacy slugs, or explicit noindex status were still eligible for discovery in some code paths. These records are now protected from the Blog listing and sitemap and receive `noindex,follow` while their URLs and publication records remain intact.
- Sitemap output is persisted as a snapshot. A newly introduced content-eligibility rule could previously leave a valid-but-stale sitemap snapshot visible until a scheduled maintenance run. This release adds a sitemap policy version so public sitemap rendering refreshes when eligibility rules change.

## Changes in this release

1. Added `lib/blogContentPolicy.js` as the single eligibility and public-content policy for legacy Blog records.
2. Filtered Blog listings and sitemap post entries through that policy; protected URLs stay online but are not presented as current indexable content.
3. Added `noindex,follow` metadata for excluded legacy Blog detail pages, while preserving canonical URLs and dates.
4. Removed legacy editorial sections from public Blog rendering, including CMS/SEO checklist headings and generated CTA remnants; related internal links are suppressed on excluded records.
5. Added a sitemap policy version to force a snapshot refresh when URL eligibility logic changes.
6. Allowed a privileged, explicit sitemap-maintenance run to resubmit the sitemap after a policy change. This is sitemap discovery only; it is not a bulk URL-indexing request.

## Deliberately not changed

- No historic 404 URL received a speculative redirect.
- No intentional noindex localization was changed to indexable.
- No News automation workflow, article generation rule, or scheduled News publication logic was changed.
- No existing URL, publication timestamp, content record, or media file was deleted.

## Verification completed locally

- Blog-content policy tests: passed.
- Full Node test suite: 69 passed.
- Type check: passed.
- ESLint: completed with 0 errors and 8 pre-existing warnings.
- Production build: passed; 870 static routes generated.
- Local HTTP smoke test: excluded legacy Blog detail returned 200 with one `noindex, follow` directive and no public CMS/SEO checklist text.
- Local sitemap smoke test: the excluded legacy Blog URL was not present.

## Production completion procedure

After deployment, invoke the authenticated `/api/cron/sitemap-maintenance?force=true&submit=true` route once. It regenerates the persisted sitemap from the deployed eligibility policy and calls the official Search Console Sitemap API only if the production credentials are configured. Record the returned `submission` object rather than claiming indexing.

The correct Google workflow is sitemap submission and subsequent crawl processing; the Indexing API is not used for ordinary product, Blog, or News pages. See [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) and the [Search Console Sitemaps API](https://developers.google.com/webmaster-tools/v1/sitemaps/submit).

## Follow-up requiring a Search Console export

Export the example URLs for every coverage bucket from the Pages report. The remediation can then map each historic 404, redirect, and canonical conflict to one of: valid 301, 410 after review, canonical correction, a retained noindex page, or no change when the URL is intentionally excluded.

## Rollback

- Revert the deployment commit.
- Restore the scoped pre-change files from `.backups/gsc-remediation-20260822-145500` if a file-level rollback is required.
- Run authenticated sitemap maintenance again to regenerate the snapshot from the restored code.
