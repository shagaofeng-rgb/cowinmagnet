# Cowinmagnet Website

Next.js B2B independent site for Cowinmagnet magnetic separation equipment.

## Local Development

```bash
npm install
npm run dev
```

## Admin Analytics Dashboard

Admin routes:

- `/admin`
- `/admin/analytics`
- `/admin/search-console`
- `/admin/visitors`
- `/admin/pages`
- `/admin/journeys`
- `/admin/settings`

Tracking endpoint:

- `POST /api/analytics/track`

Admin API endpoints:

- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/traffic`
- `GET /api/admin/analytics/visitors`
- `GET /api/admin/analytics/pages`
- `GET /api/admin/analytics/journeys`
- `GET /api/admin/search-console/overview`
- `GET /api/admin/search-console/pages`
- `GET /api/admin/search-console/queries`
- `GET /api/admin/search-console/countries`
- `GET /api/admin/search-console/devices`
- `GET /api/admin/search-console/indexing-status`

The current implementation stores first-party analytics events in `.data/analytics-events.jsonl` for local preview and `/tmp/cowinmagnet-analytics` on Vercel. This is useful for testing the flow, but Vercel storage is ephemeral. For production-scale reporting, replace this lightweight store with Neon Postgres, Supabase, PlanetScale, or another persistent database.

## Required Admin Environment Variables

```bash
ADMIN_EMAIL=davidsha@cowinmagnet.com
ADMIN_PASSWORD_HASH=...
ADMIN_JWT_SECRET=...
```

Generate the password hash with the same `ADMIN_JWT_SECRET` used in production:

```bash
node -e "const crypto=require('crypto'); const p='your-password'; const s='your-long-random-secret'; console.log(crypto.createHash('sha256').update(`${p}:${s}`).digest('hex'))"
```

For quick private testing only, `ADMIN_PASSWORD` is also supported. Use `ADMIN_PASSWORD_HASH` for production.

## GA4 / Search Console Reserved Config

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_ANALYTICS_PROPERTY_ID=123456789
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://www.cowinmagnet.com/
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

GA4 script loads automatically when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured.

Search Console screens currently provide the dashboard structure and sample rows when API credentials are absent. After a Google service account is connected, the existing API route structure can be wired to live GSC data without changing the admin UI.

## Privacy Notes

- IP addresses are anonymized before storage.
- Admin routes are protected by an HTTP-only signed cookie.
- The tracker skips `/admin` pages.
- Event collection focuses on B2B site improvement: page views, scroll depth, outbound clicks, form submits, referrer, UTM and device metadata.
