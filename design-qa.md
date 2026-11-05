# Cowin Magnet interior design QA — 2026-11-05


Previous design verification: [Homepage option 2](docs/home-option2/design-qa.md).
**Scope:** 30 approved boards cover 18 public page types, including five catalogue categories, four individual industries and six representative product details. The product detail template applies to the 88 published product URLs. The home layout and its footer remain on their original variant.

**Reference and evidence:** `../design-review-20261105/manifest.json` lists the 30 original boards. The companion `../design-review-20261105/implementation/` contains browser renders, numbered source-to-build comparisons and locale checks. The evidence is local and is not bundled with the web application. Source boards are 1254 × 1254 PNG composites; the desktop and phone artboards were cropped from each source and normalized to 470 and 180 px wide alongside JPEG renders. Browser QA used 1120 × 850 desktop and 390 × 844 mobile at device scale 1, with 430 × 932 spot checks in six languages. The rendered pages use live catalogue records and the existing locale policy. Local news/blog screenshots used temporary samples from public published pages because the local server had no production database connection.

- **Layout and spacing:** All 30 routes were rendered in both desktop and phone viewports. The catalogue uses a desktop rail and mobile disclosure with compact cards; product details use separate, addressable content panels; editorial pages and legal pages use reading rails; enquiry and contact use the approved section hierarchy. Rechecked the final shared header/footer and main flows after the last style adjustments.
- **Typography and colour:** Kept the site font stack and matched the compact hierarchy, navy type, light blue surfaces and blue controls from the boards. Checked headings, long product names, form labels, selected states and right-to-left layout.
- **Image and copy fidelity:** Use verified images for actual devices, including the green wet-drum unit and orange RCYD unit. Approved boards illustrate composition, so render differences are expected where model colours, supplier photography, article titles and verified specifications differ. Technical process steps are displayed using the actual published descriptions and approved engineering diagrams where available. The two new coordination images are labeled illustrations. The live form does not display simulated success/failure. Article translations retain the existing notice when the full English original is the available source.
- **Interactions:** Product family and facet filters, search, pagination, image modal, technical panel and back history, product-to-quote context, consent, local inquiry save feedback, expandable footer links, mobile menu, and Google Maps/email/WhatsApp link targets were exercised. Browser inspection found one H1 per screen, no horizontal overflow at tested widths, and no application hydration or runtime errors. No live inquiry was sent for QA.

**Comparison history**

1. Board 01: The first mobile render had an oversized hero and a submit button squeezing the search input. Reduced the hero, moved equipment art next to the copy on mobile, and constrained the button to its content. Rechecked search and filtering in the 390 px browser; see `01-before-mobile.jpg` and `01-comparison.jpg`.
2. Boards 09–10: Some third-party covers failed in the local image optimizer. Added an error fallback to a site-owned image and captured a successful desktop and phone rerender. Production uses the existing approved image hosts; the fallback also covers outages.
3. Boards 03, 13 and 14: Reduced the product introduction and quick facts, aligned action buttons, removed the enquiry hero's redundant self-link and numbered the three steps. Replaced the tall inner-page footer with the reference's compact contact strip and a disclosure for existing links and QR codes. Rechecked 03/13/14 and verified the original homepage/footer.

**Release checks:** lint (0 errors; 3 pre-existing image warnings), TypeScript, webpack production build, local smoke and monitor. HTTP audit covered 191 routes (including all 88 product sitemap URLs) with no failures. Repository test comparison: 111/112 on both the base and the change; the pre-existing legacy blog redirect assertion fails identically. No SEO metadata or redirect definitions changed.

**Rollback:** Baseline Git tag `cowin-before-interior-design-20261105` (`fe40cff`), Vercel deployment `dpl_FjWqGNxTFZaMJmzmUqVfrVhWgr3Y`. If rollback is necessary, restore the prior deployment and revert the release commit on `main` to align the repository with production. No database migration is involved.

final result: passed
