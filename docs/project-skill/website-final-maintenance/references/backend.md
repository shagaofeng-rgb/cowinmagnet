# Backend

API areas:

- Admin auth: `app/api/admin/login`, `app/api/admin/logout`, reset/forgot password routes.
- Admin analytics: `app/api/admin/analytics*`.
- Admin content: `app/api/admin/content/*`.
- Inquiry form: `app/api/inquiry`.
- News automation: `app/api/cron/news-automation`.
- Monitor cron: `app/api/cron/website-monitor`.

Rules:

- Protected admin pages and admin APIs require session auth.
- Form tests on production must be marked TEST and cleaned if created.
- Do not expose stack traces, tokens, DB URLs, or passwords.
- `CRON_SECRET` or `NEWS_SYSTEM_ADMIN_TOKEN` can authorize external cron calls.

For login verification, check both the login page and the POST route, and confirm a session cookie is returned.
