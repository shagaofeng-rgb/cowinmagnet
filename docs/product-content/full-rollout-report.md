# Full Product Detail Rollout

Date: 2026-08-08

## Scope released

- Existing product records covered: 88
- Existing English product URLs preserved: 88
- Local route verification: 88 of 88 passed
- Sample set approved before rollout: 8 cross-family products

## Runtime changes

- Every current product route now uses `ProductDetailExperience`, the shared server-rendered detail page.
- The legacy unused `ProductDetail.jsx` and `ProductConversionSection.jsx` components were removed from the active codebase after a local backup was made.
- Legacy gallery media is not rendered by the new detail template until it has been confirmed as model-correct, COWIN-owned or permitted, and free from third-party branding or QR codes.
- Product-page inquiry submissions include product, model, family, source URL, locale, referrer and UTM context. Product-family selection fields are included in the submitted selection details.

## Content and data boundaries

The layout, selection logic, process explanation, FAQ boundaries, technical confirmation table and internal product relationships are active for every product route. Numeric technical values, certification claims, project results, extra media and document downloads remain confirmation-only until a current COWIN source-of-truth is attached. No third-party text, media, specifications or claims were copied into the site.

## Verification

- `npm run product:audit`: 88 records, 2 potential duplicate groups retained for manual review.
- `npm run product:verify`: 88 of 88 local English product pages passed HTTP, H1, Product schema, Breadcrumb schema and inquiry-context checks.
- `npm run typecheck`: passed.
- `npm test`: 25 passed.
- `npm run lint`: passed with 15 existing warnings outside this product-detail rollout.
- `npm run build`: passed; 857 routes generated.

## Rollback

The pre-change files are preserved locally in `.backups/product-detail-upgrade-20260808-124447/`. Production rollback can be performed by redeploying the prior Vercel production deployment or reverting the rollout commit after confirming the impact.
