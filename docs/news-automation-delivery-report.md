# Cowinmagnet Industry News Automation Delivery Report

Date: 2026-06-09

Superseded cron note, updated 2026-06-27:

- Current production Cron configuration must contain exactly one Vercel Cron entry: `/api/cron/analytics-sync` at `0 */3 * * *`.
- `/api/cron/analytics-sync` runs analytics sync and triggers the news automation backup when the last successful news job is older than 3 hours.
- `/api/cron/news-automation` remains available for authorized manual/admin runs, but it must not be restored as a separate Vercel Cron entry.
- Do not restore the older three-cron configuration documented in early June reports.

## Project Identification

- Repository: `C:\Users\Administrator\Documents\cowinmagnet.com主站`
- Vercel project: `cowinmagnet`
- Vercel project id: `prj_iXepbQHaIFG13YxbGRQgEJ2M6VVR`
- Production domain in code/config: `https://www.cowinmagnet.com`
- Framework: Next.js 16 App Router
- Database: PostgreSQL when `DATABASE_URL` is configured; local `.data` JSON fallback otherwise
- Existing Cron: `/api/cron/analytics-sync` at `0 */3 * * *`, with news backup logic inside the same route

## Industry Identification

- Brand: Cowinmagnet
- Company: Quzhou Qiying Import & Export Co., Ltd
- Core business: magnetic separation equipment sourcing, product matching, and export communication support
- Core products: suspended permanent magnetic separators, overband magnetic separators, electromagnetic separators, magnetic drums, magnetic pulleys, magnetic bars, magnetic grids, magnetic filters
- Main applications: mining conveyors, recycling sorting lines, cement and aggregate processing, coal handling, food and powder metal contamination control, bulk material handling
- Target markets: USA, Australia, India, Germany, UK, South Africa, UAE, Brazil, Canada, Chile, Indonesia, Vietnam, Malaysia, Thailand, Saudi Arabia

## Implemented Changes

- Tightened default publishing mode to `draft`.
- Set default automation limits to 1 article per run and 8 articles per day.
- Disabled third-party news images by default.
- Disabled AI-generated news images completely in configuration and image planning.
- Added SSRF protections for source fetches:
  - only HTTP/HTTPS
  - blocks localhost and private IP ranges
  - response size limit through `NEWS_MAX_SOURCE_SIZE_BYTES`
  - HTML content-type check for preview image discovery
- Added persistent news automation storage when `DATABASE_URL` exists:
  - `news_automation_state`
  - `news_job_runs`
- Added PostgreSQL advisory lock for production concurrency control.
- Added local lock-file fallback for non-database development runs.
- Changed Cron route response shape to `success`, `data`, `error`, and `requestId`.
- Removed query-string secret support from Cron route.
- Production Cron now requires either Vercel Cron header, Bearer token, or `x-cron-secret`.
- Added admin-only manual run endpoint: `/api/admin/news-automation/run`.
- Added recent automation run visibility and manual run button to `/admin/news`.

## News Source Policy

Configured sources include Recycling Today, Mining.com, Food Safety News, and Google News RSS queries. External source images are not reused unless both the source item and global config explicitly permit it. The default path is Cowinmagnet company-library imagery or draft/review status.

## SEO/GEO Status

Existing generated articles include SEO title, SEO description, canonical source URL, structured sections, source references, FAQ data, related product suggestions, and GEO entity fields. News detail pages emit `NewsArticle`, organization, FAQ, and breadcrumb schema. Sitemap and RSS routes already include news entries through `getNewsPosts()`.

## Verification

- Dry-run news job:
  - command: `node scripts/run-news-system.mjs job --dry-run --mode=draft --limit=3`
  - result: fetched 51 sources, scored 2 candidates, selected 1 candidate after dedupe, published 0
- Production build:
  - command: `next build --webpack`
  - result: passed
- Local HTTP smoke on port 3002:
  - `/`: 200
  - `/news`: 200
  - `/admin/news`: 200
  - `/api/cron/news-automation` without credentials: 401
  - `/api/cron/news-automation` with `x-vercel-cron: 1`: 200, mode `draft`, saved 1 draft, published 0

## Production Deployment Status

Production deployment completed.

- Preview deployment: `https://cowinmagnet-38l5kvzyv-davidsha.vercel.app`
- Production deployment: `https://cowinmagnet-4zk3tjhcn-davidsha.vercel.app`
- Production deployment id: `dpl_7peppiKtzX53BYVuXusmMQ1XfQqU`
- Production status: Ready
- Formal domains aliased:
  - `https://www.cowinmagnet.com`
  - `https://cowinmagnet.com`
- Vercel Cron route present: `/api/cron/analytics-sync`
- Production Cron schedule in `vercel.json`: exactly one entry, `/api/cron/analytics-sync` at `0 */3 * * *`
- `CRON_SECRET`: configured in Vercel Production environment
- `DATABASE_URL`: configured in Vercel Production/Preview/Development environments
- `NEWS_MAX_PUBLISH_PER_RUN`: configured as `1` in Production
- `NEWS_MAX_PUBLISH_PER_DAY`: configured as `8` in Production

## Production Verification

- `https://www.cowinmagnet.com/`: 200, deployment id `dpl_7peppiKtzX53BYVuXusmMQ1XfQqU`
- `https://www.cowinmagnet.com/news`: 200, deployment id `dpl_7peppiKtzX53BYVuXusmMQ1XfQqU`
- `https://www.cowinmagnet.com/sitemap.xml`: 200
- `https://www.cowinmagnet.com/news/rss.xml`: 200
- Unauthenticated Cron request: 401
- Authorized Cron simulation with `x-vercel-cron: 1`: 200
- Production Cron run request id: `c60cafd4-a2de-46f4-8e29-d38fe083ce1b`
- Production Cron result: fetched 212 items, scored 2, selected 1, saved 1, published 1
- Published article: `https://www.cowinmagnet.com/news/magnetic-separation-elementusa-colorado-school-of-mines-win-67m-award-for-rare-earth-proce`
- Published article checks: 200, contains `NewsArticle` schema, contains visible source reference `Mining.com`
- Vercel error log scan for latest deployment over the last 30 minutes: no error logs found

## Rollback

Revert these files to roll back this implementation:

- `config/news-system.config.mjs`
- `lib/news-system/storage.mjs`
- `lib/news-system/daily-runner.mjs`
- `lib/news-system/fetcher.mjs`
- `lib/news-system/image-handler.mjs`
- `lib/news-system/content-generator.mjs`
- `app/api/cron/news-automation/route.js`
- `app/api/admin/news-automation/run/route.js`
- `app/admin/(protected)/news/page.jsx`
- `docs/news-automation-delivery-report.md`

Database rollback, if `DATABASE_URL` was used and the new tables were created:

```sql
DROP TABLE IF EXISTS news_job_runs;
DROP TABLE IF EXISTS news_automation_state;
```

Do not run the SQL rollback if production run history must be preserved.

## Remaining Risks

- Preview deployment URL is protected by Vercel Deployment Protection and returns 401 to anonymous HTTP checks; production domains are public and verified.
- Production `NEWS_PUBLISH_MODE` is `published`, so high-quality items can publish automatically. This matches the automation goal, but editorial review should still monitor the first few runs.
- The source-image and AI-image safeguards are enforced in code even though older Vercel environment variables still exist.
- Build logs show a PostgreSQL SSL mode warning from the database connection string; current deployment succeeds, but the database URL should eventually use an explicit SSL mode compatible with future `pg` behavior.
- Existing admin page text appears mojibake in some Chinese labels; this report did not redesign or rewrite admin copy because it is outside the automation safety scope.

## 2026-06-09 News Image Automation Completion

### Implemented Image Behavior

- Replaced the previous company-library/AI-style image planning with source-first news image extraction.
- Extraction order now follows the required policy:
  - `og:image`
  - `twitter:image`
  - JSON-LD `image`
  - first valid large article image
  - source/RSS thumbnail fallback
  - no-image publishing when all candidates fail
- AI-generated images are not produced or used.
- Unrelated stock/library images are not used for automated news.
- Historical automated news now strips old company-library cover images and inline body images unless a validated `sourceImage` exists.
- News publishing is not blocked by image failure; invalid/missing images produce `imageUsageMode: "none"` and `imageStatus: "failed"` metadata instead.

### Image Validation and Safety

- External image URLs are checked for safe protocol and SSRF risk.
- Localhost, private IP ranges, loopback, link-local, multicast, and cloud metadata targets are blocked in production.
- Redirect targets are revalidated.
- Allowed formats are `jpg`, `jpeg`, `png`, `webp`, `avif`, and `gif`.
- Unknown SVG is rejected by default.
- Candidate images are rejected when they are too small, logo/favicon/icon/avatar/ad/pixel/placeholder-like, invalid MIME, unreachable, oversized, corrupt, or dimension parsing fails.
- Default suggested minimum dimensions: 800 x 450.
- Request timeout, redirect limit, and max file size limits are enforced.

### Stored Image Fields

The `sourceImage` object now records:

- `imageUrl`
- `originalImageUrl`
- `localImageUrl`
- `sourcePageUrl`
- `sourceName`
- `imageAlt`
- `imageCaption`
- `imageWidth`
- `imageHeight`
- `imageMimeType`
- `imageFileSize`
- `imageUsageMode`
- `imageStatus`
- `imageType`
- `fetchedAt`
- `createdAt`
- `updatedAt`
- `imageHash`
- candidate/failure details where relevant

Supported active usage modes are `remote`, `none`, and `review`. Local object-storage mode is intentionally marked `review_required` until a production object-storage/media backend is configured.

### Frontend and Metadata

- News detail pages render the source image below the title/intro only when a validated article image exists.
- News list cards use the same article image; no-image articles render without fake replacement art.
- Image rendering uses responsive sizing and `object-fit: contain`.
- Failed image loading does not prevent article reading.
- `og:image`, `twitter:image`, and `NewsArticle.image` are emitted only when the actual displayed article image exists.
- RSS image URLs now preserve absolute remote URLs instead of prefixing the site origin.

### Admin Management

The admin news screen now exposes image status and management actions:

- current image
- original image URL
- local image URL
- source page
- source name
- dimensions
- status
- usage mode
- fetched time
- refetch image
- remove image
- switch to remote reference
- request local-save review
- load/failure details

### Verification After Image Completion

- Image extractor test:
  - command: `node scripts/test-news-image-extractor.mjs`
  - result: passed
  - covered: `og:image`, `twitter:image`, JSON-LD image, body image, 404, too-small image, logo rejection, no-image publishing, RSS thumbnail fallback, and SSRF blocking.
- Production build:
  - command: `next build --webpack`
  - result: passed
- Production pages:
  - `https://www.cowinmagnet.com/`: 200
  - `https://www.cowinmagnet.com/news`: 200
  - `https://www.cowinmagnet.com/sitemap.xml`: 200
  - `https://www.cowinmagnet.com/news/rss.xml`: 200
- Cron security:
  - unauthenticated `/api/cron/news-automation`: 401
  - authorized `x-vercel-cron: 1`: 200
  - latest authorized result: fetched 212 items, scored 2, selected 0, saved 0, published 0, duplicate summary `duplicate-url: 2`
- Historical automated news image cleanup:
  - checked URL: `https://www.cowinmagnet.com/news/magnetic-separation-doe-awards-67m-to-elementusa-colorado-school-of-mines-for-rare-earth-p`
  - status: 200
  - old mining company-library cover path present: false
  - old company-library attribution present: false
  - `og:image`: omitted because no validated source image exists
  - `twitter:image`: omitted because no validated source image exists
  - `NewsArticle`: present
  - `NewsArticle.image`: omitted because no validated source image exists
- Vercel error log scan for latest deployment over the last 30 minutes: no logs found.

### Latest Production Deployment

- Production deployment id: `dpl_6cNcZSCJCogDyHDdopLaMeXrgxxL`
- Production deployment URL: `https://cowinmagnet-e6zw480ut-davidsha.vercel.app`
- Formal domains aliased:
  - `https://www.cowinmagnet.com`
  - `https://cowinmagnet.com`
- Production Cron schedule in `vercel.json`: `0 */3 * * *`

### Remaining Image-Specific Notes

- Remote-reference mode is active and verified.
- No-image publishing is active and verified.
- Local-save/object-storage mode is exposed as an admin review action but not silently enabled because no production object-storage/media backend is configured in this project.
- A PostgreSQL SSL mode warning still appears during build/runtime database initialization; it does not block deployment, but the database connection string should eventually use explicit `sslmode=verify-full`.
