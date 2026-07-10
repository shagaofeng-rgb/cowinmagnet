# Sitemap Automation

## Architecture

Cowinmagnet uses a dynamic Sitemap Index at `https://www.cowinmagnet.com/sitemap.xml`. It references UTF-8 XML files under `/sitemaps/` for pages, products, categories and posts. Each file is split before 50,000 URLs or 50 MB. Search-result, admin, API, draft, archived, offline, private and noindex URLs are excluded.

Static content dates are generated from the latest relevant Git commit by `scripts/build-sitemap-static-dates.mjs`. CMS products, news and blogs use their persisted `updatedAt`, `publishedAt` or `createdAt` values. Generation never changes every URL to the current date.

On Vercel, a writable project filesystem is not persistent. The production implementation therefore validates all XML first, then activates a new snapshot in a Neon PostgreSQL transaction. The previous snapshot remains current if validation or storage fails. Local mode writes a temporary JSON file, validates it and atomically renames it.

CMS saves and status changes mark the Sitemap as dirty. The next public Sitemap request regenerates it under a job lock. A daily Vercel Cron performs a second consistency check, verifies the absolute Sitemap declaration in `robots.txt`, and records every run in `sync_job_runs` with file sizes, URL counts, skipped URLs, additions, modifications, removals and Search Console submission status.

## Public URLs

- `https://www.cowinmagnet.com/sitemap.xml`
- `https://www.cowinmagnet.com/sitemaps/sitemap-pages.xml`
- `https://www.cowinmagnet.com/sitemaps/sitemap-products.xml`
- `https://www.cowinmagnet.com/sitemaps/sitemap-categories.xml`
- `https://www.cowinmagnet.com/sitemaps/sitemap-posts.xml`
- `https://www.cowinmagnet.com/news-sitemap.xml`
- `https://www.cowinmagnet.com/robots.txt`

When a section exceeds a limit, numbered files such as `sitemap-products-1.xml` are generated and the index is updated automatically.

## Commands

```bash
npm run sitemap:generate -- --dry-run --verbose
npm run sitemap:generate -- --force --verbose
npm run sitemap:generate -- --force --submit --verbose
npm run sitemap:audit -- --url=https://www.cowinmagnet.com/sitemap.xml
npm test
npm run typecheck
npm run build
```

`--force` stores a fresh validated snapshot. `--dry-run` compares without replacing the current snapshot. `--submit` requests Search Console submission only when `GOOGLE_SEARCH_CONSOLE_ENABLED=true`. `--verbose` includes detailed file and URL-diff output. The HTTP audit recursively checks every URL in the Sitemap Index and exits non-zero for redirects, 4xx, 5xx or network failures.

## Vercel Cron

`vercel.json` schedules `/api/cron/sitemap-maintenance` at `35 2 * * *` (02:35 UTC daily). Vercel authenticates the request with `Authorization: Bearer $CRON_SECRET`. Do not expose this route without authentication and do not create a second scheduler for the same job.

## Environment Variables

```env
CRON_SECRET=
GOOGLE_SEARCH_CONSOLE_ENABLED=false
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://www.cowinmagnet.com/
GOOGLE_SEARCH_CONSOLE_SITEMAP_URL=https://www.cowinmagnet.com/sitemap.xml
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
# Local/server alternative to the two inline credential values:
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS_PATH=
```

The repository must never contain a service-account private key. On Vercel, use encrypted environment variables. The service account must be added to the matching Search Console property with sufficient permission, and the Search Console API must be enabled in Google Cloud.

The implementation uses the Search Console Sitemaps API. It does not use the retired Google Sitemap ping endpoint and does not use the Indexing API for normal company, product, blog or news pages.

## Logs

Sitemap runs are written to `sync_job_runs` with `job_name = 'sitemap-maintenance'`. The metadata records trigger, duration, status, files, counts, diff URLs and sanitized API results. Credentials, access tokens and private keys are never logged.

## Troubleshooting

- Sitemap 404: verify the current production deployment contains `app/sitemap.xml/route.ts` and inspect the latest `sitemap-maintenance` log.
- Invalid XML: run the dry-run command and tests. A failed generation does not replace the previous snapshot.
- Missing robots declaration: open `/robots.txt` and confirm the absolute `/sitemap.xml` line.
- Search Console API 403: verify the exact property string, service-account permission and `webmasters` scope.
- Submitted but not indexed: submission only helps Google discover URLs. Successful submission does not mean Google has crawled the URLs, and crawling does not guarantee indexing. Confirm final status in Google Search Console.

## Changed Files

The feature is implemented by `lib/sitemap/`, the custom Sitemap routes, the authenticated Sitemap Cron route, `lib/searchConsoleClient.js`, `lib/cmsStore.js`, `scripts/run-sitemap.mjs`, `scripts/build-sitemap-static-dates.mjs`, `tests/sitemap.test.mjs`, `vercel.json` and `app/robots.ts`.
