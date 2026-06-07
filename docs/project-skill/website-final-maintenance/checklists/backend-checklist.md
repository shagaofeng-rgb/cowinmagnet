# Backend Checklist

- Admin login page loads.
- Admin login API returns session cookie.
- Protected admin pages reject unauthenticated access.
- Analytics APIs return correct date ranges.
- Inquiry API validates required fields.
- Cron endpoint rejects unauthenticated requests outside Vercel cron unless secret is present.
- API errors do not expose secrets or stack paths.
