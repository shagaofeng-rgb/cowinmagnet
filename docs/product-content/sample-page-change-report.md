# Product Detail Sample Change Report

Generated: 2026-08-08

## Local preview samples

1. RCYD Permanent Self-Cleaning Iron Remover
2. RCDD Self-Cooling Electromagnetic Iron Remover
3. Wet Drum Magnetic Separator
4. Belt High-Gradient Magnetic Separator
5. Eccentric Eddy Current Separator
6. Drawer Magnet
7. Rotary Pipe Magnet
8. GJT Window Metal Detector

## Applied changes

- Reused one server-rendered detail component for the existing localized and non-localized product URLs.
- Replaced the generic hero with breadcrumb, primary product media, selection summary, quick facts and product-specific quote/WhatsApp actions.
- Added process-position flow, configuration logic, material/industry context, confirmation-only technical table, selection checklist, related process equipment and product-specific FAQ.
- Added unique dynamic title, meta description, Open Graph/Twitter metadata, Product, BreadcrumbList and FAQPage JSON-LD without price, stock, rating or review claims.
- Added product name, model reference, product family, source URL, locale, referrer and UTM context to product-page inquiry submissions.
- Removed the initial 88-option product selector from the inquiry form; non-product pages now use a free-text product field.
- Withheld legacy gallery media until individual media verification is complete; the primary current product image remains in use.

## Verification scope

- Product audit: 88 static product records, 8 sample routes, 2 potential duplicate URL groups.
- `npm run product:audit`: passed.
- `npm run typecheck`: passed.
- `npm test`: 25 passed.
- `npm run lint`: passed with 15 pre-existing warnings outside the new product-detail files.
- `npm run build`: passed.
- Local desktop and mobile screenshots reviewed for the RCYD and Eccentric Eddy Current samples. Mobile layout measurement confirmed the mobile breakpoint is active and the page has no horizontal document overflow.

## Deliberately deferred until technical records are supplied

- Numeric specifications, dimensions, performance, capacity, magnetic field strength, electrical values, certification, hygienic claims, pressure/temperature limits and case-study results.
- Additional gallery images, PDF downloads and video captions for assets that have not been verified as COWIN-owned and model-correct.
- The remaining 80 technical-content rewrites. The shared template is ready, but the instruction requires sample acceptance before batch rollout.
