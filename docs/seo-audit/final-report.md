# SEO Remediation Final Report

Generated: 2026-08-06

## Confirmed changes

- Automatic News runs every three hours and can create drafts only; public publishing requires an approved editorial status and a named technical reviewer.
- External Blog webhook submissions are drafts only. Existing Blog records are retained.
- Seven current News records were assessed and marked noindex by policy; they are excluded from public listings and sitemaps without deleting CMS data.
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
- npm test: passed, 25 tests.
- npm run build: passed.
- npm run lint: completed with 15 warnings and no errors. The warnings are documented below.
- Local production smoke crawl: 18 public routes passed with zero failures, including two category landing pages. Root redirects with 308 to /en; applications/recycling redirects directly with 308 to /en/industries/recycling; a non-www host request preserves its query string and redirects with 308 to the HTTPS www host.
- Local robots.txt, sitemap.xml, news-sitemap.xml and llms.txt returned HTTP 200.

## Remaining work and data required

- Product category landing pages, product duplicate consolidation and technical copy require verified model-level product materials before publication.
- Existing content data contained only seven News records in the configured source available to the audit runner. Any records in unavailable external storage need a subsequent database export audit.
- Lint warnings remain for legacy img usage, cookie writes in language switchers, and an admin date-filter effect. They are not build blockers but should be addressed separately.
- DNS/CDN should be checked after deployment to confirm the host redirect also covers direct HTTP and any domain-level redirects.
- Search Console exports are required for ranking, CTR, coverage and crawl-stat conclusions. See search-console-export-checklist.md.
- No production deployment was performed for this remediation.
