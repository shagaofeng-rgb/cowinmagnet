# SEO Remediation Final Report

Generated: 2026-08-08

## Confirmed changes

- The legacy direct-publication News flow was removed. The active News system ingests source candidates every 12 hours and can publish one frontend-verified item every 48 hours when `NEWS_AUTOMATION_PRODUCTION_ENABLED=true`.
- A News item is blocked or reverted unless independent HTTPS sources, relevance and duplication rules, local media rules and a post-publication health check all pass. Each discovery/publish cycle records its result and skip/failure reason.
- Blog automatic publishing is retired. Existing Blog records are retained and manual CMS publishing remains available.
- Draft, archived and explicitly noindex News are excluded from listings and sitemaps without deleting CMS data; eligible published News can remain indexable.
- Non-www host redirects to the www host in the application proxy. Root requests use a stable 308 redirect to /en without IP or browser-language routing.
- Duplicate application routes permanently redirect to their English industry canonical URLs.
- Sitemap generation lists English canonical URLs and English/x-default hreflang only while translation completeness is not verified.
- Sitemap submission can occur only when the sitemap manifest changes; no deprecated sitemap ping or general URL Indexing API call is present.
- Product schema no longer invents Offer price, stock or availability values. Empty product blocks are suppressed.
- Category, product, Blog, News and localized home metadata emit a current-page Open Graph URL rather than a homepage fallback.
- The home showcase video no longer autoplays or loops, starts with preload=none, uses a poster and provides a caption track.
- robots.txt retains explicit access for Google, Bing-compatible general crawling, Google-Extended, GPTBot/OAI-SearchBot/ChatGPT-User, Claude and Perplexity bots. llms.txt is available at /llms.txt.

## Verification

- npm run typecheck: passed.
- npm test: passed, 23 tests.
- npm run build: passed.
- npm run lint: completed with 15 warnings and no errors. The warnings are documented below.
- Local production smoke crawl: 18 public routes passed with zero failures, including two category landing pages. Root redirects with 308 to /en; applications/recycling redirects directly with 308 to /en/industries/recycling; a non-www host request preserves its query string and redirects with 308 to the HTTPS www host.
- Local robots.txt, sitemap.xml, news-sitemap.xml and llms.txt returned HTTP 200.
- 2026-08-08 release verification: 88 of 88 English product detail pages passed the product-detail checker; the local production smoke crawl returned 0 failures across 18 public and 2 authenticated-route checks; production sitemap audit returned 237 of 237 URLs with HTTP 200 and no issues.
- Production non-www verification returned 308 to the matching HTTPS www URL while preserving a query parameter. Current Vercel runtime-error history contains one `Invalid time value` event from deployment `dpl_2JUb9ykV4X3DXgKba7KGJE7GgeC4`; a later ISO-date handling deployment is in production and no repeat was reported by this audit.

## Remaining work and data required

- Product category landing pages, product duplicate consolidation and technical copy require verified model-level product materials before publication.
- Existing content data contained only seven News records in the configured source available to the audit runner. Any records in unavailable external storage need a subsequent database export audit.
- Lint warnings remain for legacy img usage, cookie writes in language switchers, and an admin date-filter effect. They are not build blockers but should be addressed separately.
- DNS/CDN should be checked after deployment to confirm the host redirect also covers direct HTTP and any domain-level redirects.
- Search Console exports are required for ranking, CTR, coverage and crawl-stat conclusions. See search-console-export-checklist.md.
- Production deployments are performed from the `main` branch after the listed checks. The report must be regenerated with the exact deployment ID for each release.
