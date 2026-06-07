# Architecture

Cowinmagnet is a Next.js App Router B2B product website with public pages, localized routes, product/news catalogs, admin dashboards, analytics APIs, inquiry APIs, and cron endpoints.

Important areas:

- `app/`: routes, layouts, pages, API endpoints.
- `components/`: public UI, product cards, forms, admin panels.
- `data/`: static products, applications, blogs, generated news index.
- `lib/`: SEO helpers, admin auth, analytics store, CMS adapters, news system helpers.
- `scripts/`: monitor, smoke test, news-index generation, import/maintenance scripts.
- `docs/final-audit/`: audit evidence and rollback notes.

Data flow:

1. Public pages read static data and optional CMS/admin data.
2. Admin routes authenticate with `cowin_admin_session`.
3. Analytics events are written through API routes and read in admin dashboards.
4. Generated news JSON files are converted into `data/generatedNews.js` before build.
5. Vercel deploy builds and serves the Next.js app.

Use Vercel aliases to connect production domains to a verified deployment.
