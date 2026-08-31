# Cowinmagnet Full-Site Audit and Production Acceptance

Generated: 2026-08-31 11:55 Asia/Shanghai

Status: `PRODUCTION_ACCEPTED`

## Scope

The audit covered the public frontend, admin and API access boundaries, PostgreSQL persistence, inquiry delivery, News automation, RSS and sitemap synchronization, SEO metadata, multilingual behavior, responsive layouts, images, runtime logs, repository synchronization, and Vercel production deployment.

## Repository and Deployment

- Repository: `shagaofeng-rgb/cowinmagnet`
- Branch: `main`
- Application fix commit: `458c160` (`Stabilize content images and SEO titles`)
- Monitoring fix commit: `88e087f` (`Make website monitoring resilient`)
- Accepted production deployment: `dpl_9z3oNzcGfW1X7cnSuJKiMdPZGzC4`
- Production aliases: `cowinmagnet.com`, `www.cowinmagnet.com`
- Deployment state: `READY`
- Alias errors: none
- Rollback branch: `backup/pre-full-site-audit-20260830`

## Problems Found and Resolved

1. Five sitemap pages and several utility routes repeated `COWIN MAGNET` in the HTML title because stored titles already included the brand while the root layout appended the same brand template. A shared title normalizer and corrected static metadata now produce one brand suffix.
2. Legacy News cards still depended on third-party source images, including an image endpoint that returned HTTP 403. Legacy remote News media now uses a stable, owned site fallback while current product-first News continues to use the matched local product image.
3. Legacy Blog cards served large third-party originals directly. Approved CMS media now passes through the Next.js image optimizer with AVIF/WebP negotiation and responsive candidates; unapproved remote hosts fall back to an owned site image. A real-browser full-scroll check loaded 13 optimized images with approximately 461 KB transferred instead of the previous roughly 30 MB raw-source estimate.
4. The standalone monitor created false P1/P2 alerts by checking the same resources repeatedly at high concurrency and by measuring the 3840 px fallback URL without browser image headers. It now deduplicates resource requests, retries only transient network/server failures, selects a representative 1200 px `srcset` candidate, and requests modern image formats.

## News Automation Acceptance

- Vercel Cron schedule: `45 1,3,6 * * *` UTC, corresponding to 09:45, 11:45, and 14:45 Asia/Shanghai retry windows.
- 2026-08-31 09:45 Asia/Shanghai: `published_success`.
- Published slug: `permanent-overband-magnetic-separator-recycling-application-considerations`.
- 2026-08-31 11:45 Asia/Shanghai on the new deployment: `already_published_today`, HTTP 200.
- Daily idempotence therefore prevented a duplicate publication.
- The latest item appears on `/en/news`, its detail page returns 200, and the item is present in both RSS and News Sitemap.
- The detail page contains the original-source link, editorial attribution, related product link, and owned product image.

## Data and API Acceptance

- A protected local backup of the two existing production inquiry rows was created before mutation testing.
- One uniquely marked audit inquiry was submitted through the production API and returned HTTP 200; database persistence and SMTP delivery completed.
- The exact marked inquiry and its matching attribution test row were transactionally deleted.
- Cleanup verification: marked test rows remaining `0`; original inquiry rows remaining `2`.
- Invalid inquiry and honeypot payloads return HTTP 400.
- Empty analytics beacon returns HTTP 204; analytics health returns HTTP 200.
- Unauthenticated admin APIs return HTTP 401 and protected admin pages redirect to login.
- Invalid admin credentials do not create a session cookie.
- Cron and automation endpoints reject unauthenticated requests with HTTP 401.
- Vercel keeps `CRON_SECRET` as a Hidden Secret; its value was not exposed or changed during this audit.

## Automated Verification

- Node test suite: `88/88` passed.
- TypeScript: passed with zero errors.
- ESLint: zero errors; four existing controlled `<img>` advisory warnings remain.
- Next.js production build: passed.
- Static generation: `870/870` pages.
- Local production smoke: public `17/17`, admin boundary `2/2`.
- Production smoke: public `18/18`, admin boundary `2/2`.
- Final production monitor: `Healthy`; 36 pages; abnormal pages `0`; P0/P1/P2/P3 = `0/0/0/0`.
- Current deployment runtime error scan: no runtime errors.

## SEO, Sitemap, Language, and Visual Acceptance

- Final sitemap scan: four sitemap files, 140 unique URLs, zero fetch errors, and zero duplicate-brand titles.
- Earlier route matrix plus sitemap acceptance covered 203 public URLs with no status, title, description, canonical, H1, alt-text, RSS, or sitemap failures.
- Desktop and mobile browser checks found one H1 per audited page, no horizontal overflow, no broken images, and no failed image responses.
- Arabic renders with `lang=ar` and RTL direction; English renders LTR. Other supported locale shells expose their locale server-side and the document language is synchronized in the browser.
- Non-English routes remain intentionally `noindex, follow` until editorial translation review is complete.

## Operational Notes

- No P0, P1, P2, or P3 launch blockers remain.
- Approved legacy Blog media is optimized and cached by Vercel but still originates from the configured CMS media host; a future asset-governance migration may copy those historical originals into owned storage without changing the current frontend contract.
- Rollback is available by promoting the previous known-good Vercel deployment or reverting commits `88e087f` and `458c160` in that order.
