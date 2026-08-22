# Product sync record: 2026-08-22

## Scope

The owned legacy product catalogue was inventoried before any public data was changed. The import process preserves existing Cowin product URLs, product ordering and prior gallery assets.

## Result

- Legacy product detail pages inventoried: 41
- Strict one-to-one Cowin matches: 12
- Source-to-target conflicts held for review: 4
- No current Cowin target found: 6
- Additional short-code or ambiguous records held for review: 19
- Public product pages updated: 12
- Imported static product and technical-reference assets: 70
- Legacy Flash assets: 0 published; retained only in the private migration backup

## Updated product pages

| Model | Cowin product URL | Model reference rows | Imported public assets |
| --- | --- | ---: | ---: |
| RCYB | `/en/products/rcyb-type-permanent-magnet-manual-iron-remover` | 13 | 4 |
| RCDB | `/en/products/rcdb-type-self-cooling-plate-electromagnetic-iron-remover` | 12 | 5 |
| RCDA | `/en/products/rcda-type-air-cooled-electromagnetic-iron-remover` | 12 | 7 |
| RCDD | `/en/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover` | 9 | 6 |
| RCDE | `/en/products/rcde-type-oil-cooled-electromagnetic-iron-remover` | 13 | 6 |
| RCYD | `/en/products/rcyd-type-permanent-magnet-self-dumping-iron-remover` | 11 | 8 |
| RCYP | `/en/products/rcyp-type-permanent-magnet-manual-self-dumping-iron-remover` | 9 | 6 |
| RCYA | `/en/products/rcya-type-inclined-pipeline-permanent-magnet-iron-remover` | 13 | 8 |
| RCYG | `/en/products/rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover` | 5 | 4 |
| RCDC | `/en/products/rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover` | 11 | 5 |
| RCDF | `/en/products/rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover` | 10 | 5 |
| RCYF | `/en/products/rcyf-type-vertical-pipeline-permanent-magnet-iron-remover` | 7 | 6 |

Each updated page now uses original English engineering copy, an English model-reference table, original static product media, and original engineering-reference drawings where available. Final configurations remain subject to material and site-condition confirmation. Existing URLs and existing gallery images remain in place.

## Held for review

No page was created or overwritten for old records without a clear, one-to-one Cowin target. This includes the GJT variants that both point to one existing GJT page, short model codes, and catalogue items outside the current Cowin product range. They remain in the private mapping report until the correct Cowin product relationship is confirmed.

## Verification

- Product details: 88 of 88 local English product routes returned HTTP 200 with one H1, Product schema, BreadcrumbList schema and inquiry context.
- Imported products: 12 of 12 pages passed imported-content checks; 45 rendered hero/engineering image URLs returned HTTP 200.
- TypeScript: passed.
- Existing automated tests: 65 of 65 passed.
- Production build: passed.
- Lint: 0 errors; 8 pre-existing warnings outside this import remain.

## Rollback

1. Restore `data/products.ts` from `.backups/xintuo-product-sync-20260822/products.ts.pre-import.bak`.
2. Remove only the `legacy-import` directories created under the 12 product asset folders, after confirming the paths are within `public/assets/products/`.
3. Re-run `npm run typecheck`, `npm test` and `npm run build`.
4. If committed, revert the dedicated product-sync commit rather than deleting live records manually.

Private source pages, raw Chinese source text, original URLs and original media files are retained only in the ignored local backup and report directories.
