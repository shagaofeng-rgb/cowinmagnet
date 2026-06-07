# Multilingual

Locales currently include English plus additional localized paths such as Spanish, Russian, Arabic, French, and Portuguese.

Rules:

- Default public SEO target is English.
- Localized routes should keep consistent slugs and hreflang alternates.
- `x-default` should point to the English version.
- Manual language selection should not break navigation.
- RTL languages need layout checks; do not assume English spacing works.

QA:

- Check `/en`, `/es`, `/ru`, `/ar`, `/fr`, `/pt` route availability.
- Confirm localized product and news detail URLs render.
- Confirm forms still submit from localized pages.
