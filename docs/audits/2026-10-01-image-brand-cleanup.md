# Image brand-mark cleanup — 2026-10-01

## Scope and method

- Inspected 1,007 readable local raster assets with OCR, then manually reviewed contact sheets covering site imagery and all 88 published product primary images. OCR is only a triage aid; small or stylized marks require visual review.
- Removed embedded brand names, invented Cowin logos and third-party marks from 23 existing image files used in the home page, marketing pages, industry/application scenes and a published product primary image. Existing official site logo (`public/images/cowin-logo.png`) and header/footer rendering were not changed.
- Used the built-in image editing tool for each changed source image. The common edit instruction was: *remove every embedded logo, company name, watermark and brand text from the marked image; reconstruct the underlying surface naturally; preserve equipment, workers, setting, composition and lighting; leave the surface unbranded; do not add a replacement or claim the depicted equipment belongs to Cowin*. Ten source images were edited, with cleaned output converted to the original file formats and responsive sizes.
- No third-party mark was replaced with a Cowin mark. Technical equipment labels, engineering drawings and safety information were not indiscriminately erased.

## Published image paths

The following twelve active assets have cache-busting names so the live site cannot keep using an old optimized image:

| Area | Published asset |
| --- | --- |
| Home hero | `public/images/generated/home-hero-cowinmagnet-clean-20261001.webp` |
| Contact/about | `public/images/generated/contact-support-cowinmagnet-clean-20261001.webp` |
| Factory | `public/images/generated/about-factory-team-cowinmagnet-clean-20261001.webp` |
| Recycling application | `public/images/generated/recycling-application-cowinmagnet-clean-20261001.webp` |
| Recycling industry cover | `public/images/industries/recycling-industry-magnetic-separation-cover-clean-20261001.webp` |
| Recycling solution | `public/images/industries/recycling-magnetic-separation-solution-clean-20261001.webp` |
| Recycling scenario | `public/images/industries/recycling-scenarios/non-metal-recycling-sorting-line-clean-20261001.jpg` |
| Mining industry cover | `public/images/industries/mining-industry-magnetic-separation-cover-clean-20261001.webp` |
| Mining scenario | `public/images/industries/mining-scenarios/mining-industry-magnetic-separation-cover-clean-20261001.jpg` |
| Aggregate crusher scenario | `public/images/industries/cement-aggregate-scenarios/crusher-protection-iron-removal-clean-20261001.jpg` |
| Aggregate finished-product scenario | `public/images/industries/cement-aggregate-scenarios/finished-aggregate-purification-clean-20261001.jpg` |
| Rotary pipe magnet primary image | `public/assets/products/rotary-pipe-magnet/rotary-pipe-magnet-01-clean-20261001.png` |

The original paths also contain the cleaned versions, including PNG fallbacks and responsive recycling variants. The published product gallery remains intentionally restricted to the primary image; unused legacy gallery/source-product files were not published or presented as Cowin-branded assets.

## Validation and limits

- Local lint, typecheck, production build and 102 automated tests passed after the image edits. Browser validation covers mobile and desktop routes, image loading, overflow and console errors; deployment checks should confirm the new asset URLs are served in production.
- Site-managed local images are covered. Images supplied later by an external Blog/CMS feed or future uploads need separate editorial review before publication. The Blog publishing pipeline itself is unchanged.
- Rollback: revert this change commit or restore the pre-change branch `codex/pre-image-logo-cleanup-d2e248c`, then redeploy.
