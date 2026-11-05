# Homepage option 2 visual QA — 2026-10-09

## Source and output

- Approved source: `docs/home-option2/approved-reference.webp` (946 × 1663 px).
- Desktop: `docs/home-option2/desktop-full.webp` (1440 × 3353 CSS-pixel capture, device scale 1).
- Side-by-side source/render comparison: `docs/home-option2/desktop-comparison.webp` (source left, implementation right, both normalized to 945 px wide and cropped to the reference height).
- Mobile: `docs/home-option2/mobile-390.webp` and `docs/home-option2/mobile-430.webp` (390 × 844 and 430 × 844 viewports, device scale 1, full-page captures).

## Comparison and iterations

1. The first implementation retained the old dark full-bleed hero, six compact cards, and a dark industry section. These were replaced with the approved white/image split hero, three equal large product cards, six-tile pale-blue industry block, and video/form split.
2. The first local capture showed the hero title overlapping too much of the image and the home form placing name/company on separate lines. The title scale and grid selectors were corrected. The top utility strip was hidden on the homepage to match the single white reference header.
3. A side-by-side comparison showed the branded machine too far right and the industry heading breaking into three lines. The hero image focal point was shifted to the right edge of its source crop, bringing the machine left in the viewport, and the heading scale was reduced to restore the two-line composition.
4. The generated hero and three missing industry scenes are generic illustrative imagery; actual product photos, official logo, product links, navigation, video, and inquiry endpoint remain the site's existing assets/functions. The three new industry files carry a permanently composited copy of the official logo. No unverified numeric product claims were copied from the concept image.

## Generated scene prompts and saved assets

- Power generation: realistic wide documentary photograph of an industrial power plant with coal-handling conveyors and steel silos, daylight, no text or other logos. Saved as `public/images/generated/home-industry-power-20261009-cowin-brand.webp`.
- Cement: realistic cement plant exterior with silver silos, bulk conveyors, daytime sky, no text or other logos. Saved as `public/images/generated/home-industry-cement-20261009-cowin-brand.webp`.
- Aggregates: realistic quarry aggregate stockpile with elevated conveyor, bright overcast sky, no text or other logos. Saved as `public/images/generated/home-industry-aggregates-20261009-cowin-brand.webp`.
- All three were generated with the built-in image-generation tool, then converted and marked with the existing official logo using deterministic image composition. The approved branded hero asset was reused from the selected design iteration and saved as `public/images/generated/home-hero-option-two-branded-20261009.webp`.

## Functional and responsive checks

- English desktop and 390/430 px mobile views: no horizontal overflow or broken images.
- Arabic mobile: RTL content direction, visible text, and no horizontal overflow.
- Product category tab changed from All Products to Magnetic Pulleys and showed only the pulley card.
- Video play control loaded the actual MP4, reached ready state 4, and advanced beyond 3 seconds without console errors.
- Home inquiry form retains six required inputs and the existing `/api/inquiry` submission action; no test inquiry was submitted to avoid creating customer/test data.
- TypeScript and production build passed. Full automated suite: 106 passed, 0 failed. Lint: 0 errors, 4 pre-existing warnings outside the edited homepage.

## Final result

passed
