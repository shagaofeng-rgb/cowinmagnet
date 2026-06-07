# Frontend

Main public pages:

- Home: `app/page.tsx`, localized version in `components/LocalizedPages.tsx`.
- Products: `app/products`, `app/[locale]/products`.
- Product detail: `app/products/[slug]/page.tsx`, `app/[locale]/products/[slug]/page.tsx`.
- News: `app/news`, `app/[locale]/news`.
- About/contact/request quote/industry pages under `app/`.

Guardrails:

- Do not redesign global layout, header, footer, or homepage unless explicitly requested.
- Product image display should avoid distortion; product cards and detail images need stable aspect ratios.
- Mobile QA must check 390px and 430px widths at minimum.
- Navigation menus must close on route change and must not trap users.
- Use `next/image` for local images when practical; external news images require licensing and fallback handling.

Known cleanup:

- Product detail rendering uses `lib/productDisplay.ts` to hide scraped script artifacts.
- Industry icons should use descriptive alt text, not empty alt, when monitor reports them.
