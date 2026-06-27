# Search Console Indexing Notice - 2026-06-09

## Notice

Google Search Console reported new non-indexing reasons for `cowinmagnet.com`:

- Alternative page with proper canonical tag
- Not found (404)

## Findings

- `Alternative page with proper canonical tag` is expected for duplicate locale/domain paths when Google consolidates equivalent URLs to the canonical URL.
- `robots.txt` and `sitemap.xml` are reachable.
- Sitemap contains 702 localized URLs and does not include the legacy `conveyor-metal-detector` slug.
- Production 404 logs showed one legitimate old product path: `/fr/products/conveyor-metal-detector`.
- The same old slug also existed as a footer product link in `components/Footer.jsx`.
- Other 404 logs were mostly UEditor `.ashx` probe paths, which are automated vulnerability scans and should not be indexed.

## Fix

- Updated the footer link from `/products/conveyor-metal-detector` to `/products/dls-type-window-metal-detector`.
- Added permanent redirects:
  - `/:locale/products/conveyor-metal-detector` -> `/:locale/products/dls-type-window-metal-detector`
  - `/products/conveyor-metal-detector` -> `/products/dls-type-window-metal-detector`

## Production Verification

- Deployment: `dpl_5addoWrJhEU2tNt8nYD4ZkzrfPYc`
- URL: `https://cowinmagnet-n7qz3pk46-davidsha.vercel.app`
- `https://www.cowinmagnet.com/en/products/conveyor-metal-detector` follows to `https://www.cowinmagnet.com/en/products/dls-type-window-metal-detector` and returns 200.
- `https://www.cowinmagnet.com/fr/products/conveyor-metal-detector` follows to `https://www.cowinmagnet.com/fr/products/dls-type-window-metal-detector` and returns 200.
- `https://www.cowinmagnet.com/en/products/dls-type-window-metal-detector` returns 200.
- Vercel cron list remains correct:
  - Current production Cron: `/api/cron/analytics-sync` at `0 */3 * * *`
  - `/api/cron/news-automation` is manual/admin only and must not be restored as a separate Vercel Cron entry

## Search Console Follow-up

After Google recrawls the site, validate the 404 issue in Search Console. Keep the canonical warning under observation; it is not harmful when the selected canonical is intentional.
