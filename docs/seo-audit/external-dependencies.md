# External Dependencies

- Non-www to www redirect is implemented in application proxy code. DNS/CDN-level HTTP-to-HTTPS enforcement should also be confirmed in Vercel domain settings.
- `bzmagnet.com` and `cowinmagnet.co.za` are outside this repository unless separately linked to this deployment. Map each legacy URL to its matching canonical page, or return 410 where no replacement exists. Do not redirect all legacy URLs to an unrelated homepage.
