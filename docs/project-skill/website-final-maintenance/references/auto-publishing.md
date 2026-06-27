# News Auto Publishing

Flow:

1. Fetch industry opportunities.
2. Score and filter relevance.
3. Generate or save draft content.
4. Publish according to mode and quality checks.
5. Rebuild or read generated news data through the app.

Important files:

- `app/api/cron/analytics-sync/route.js` is the only Vercel Cron entry. It runs analytics sync and triggers the news automation backup when the latest successful news job is older than 3 hours.
- `app/api/cron/news-automation/route.js` remains available for authorized manual/admin triggering, but it must not be added back to `vercel.json` as a separate Vercel Cron job.
- `lib/news-system/*`
- `config/news-system.config.mjs`
- `scripts/build-generated-news-index.mjs`
- `data/news-generated/*.json`
- `data/generatedNews.js`

Cron rule:

- `vercel.json` must contain exactly one cron entry: `/api/cron/analytics-sync` at `0 */3 * * *`.
- Do not restore the old three-cron configuration with `analytics-sync */30`, `news-automation 0 */3`, and `monthly-inquiry-test 0 1 1 * *`.
- The local Windows Scheduled Task `CowinmagnetNewsAutomation` is only a fallback and calls `/api/cron/analytics-sync`.

Compliance:

- Automated news should use validated source-article images when available. Do not generate AI news images and do not use unrelated stock/company-library images as replacement news photos.
- Keep source title, source name, source link, and date.
- Do not copy full articles.
