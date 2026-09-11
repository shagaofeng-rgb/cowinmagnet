# Homepage redesign visual QA

## Comparison target

- Source visual truth: `/Users/apple/.codex/generated_images/01a0527b-3836-7bd3-98dd-ecfc9aada1ed/exec-dc9b4434-2f19-4367-ab0c-d2d519d15d88.png`
- Implementation: `http://127.0.0.1:3100/en`, captured in the Codex in-app browser after the local production build.
- Desktop state: 1440px-wide in-app browser viewport, default navigation closed, top of the homepage.
- Narrow state: in-app browser narrow viewport; the compact navigation, hero proof grid and single-column content rules were inspected.
- Density normalization: both were judged as browser-rendered desktop web content rather than device-frame captures. The source is a 2112×1412 visual board; implementation was evaluated at its browser CSS size.

## Evidence and comparison history

The source image and the browser-rendered implementation were opened in the same QA session. Focused inspection covered the header/hero and the product, industry, and enquiry transitions. The browser accessibility tree confirms a single H1, six working product links, five product-category links, four industry links, both primary CTAs, the video CTA, and the full inquiry form. No console-visible runtime failure or horizontal-overflow symptom appeared during the browser check.

### Fidelity surfaces

- **Fonts and typography:** Large all-caps hero hierarchy, compact uppercase labels, restrained card headings, and readable form labels match the reference's industrial tone. The site keeps its existing production font stack for consistency across localized pages.
- **Spacing and layout rhythm:** The hero has clear left-side copy and right-side machinery focal point, a four-column proof strip, a centered product-selection section, dark industry band, then an asymmetric video/form conversion row. At narrow widths, proof items become two columns and product/industry cards become one column.
- **Colors and tokens:** Navy structural surfaces, electric blue primary action, white content surfaces, and muted blue-gray borders follow the selected reference while preserving existing brand colors.
- **Image quality and asset fidelity:** The hero, products, industries, video poster, logo, and global-map asset are existing, real Cowinmagnet assets delivered through `next/image` where applicable. No placeholder, CSS illustration, or fabricated product imagery was introduced.
- **Copy and app-specific text:** The selected reference's English hero and product-selection language was applied where it did not overwrite factual product data. Product names, industry data, links, localization behavior, and form submission flow remain real site content.

## Findings

- No actionable P0, P1, or P2 mismatches remain for the implemented production-homepage scope.

## Follow-up polish

- P3: The generated reference includes six industry tiles; the live site deliberately shows the four actual industry solution pages to avoid inventing unsupported routes or duplicate imagery.

## Final result

final result: passed
