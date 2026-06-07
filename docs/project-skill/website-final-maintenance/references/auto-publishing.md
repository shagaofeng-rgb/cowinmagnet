# News Auto Publishing

Flow:

1. Fetch industry opportunities.
2. Score and filter relevance.
3. Generate or save draft content.
4. Publish according to mode and quality checks.
5. Rebuild or read generated news data through the app.

Important files:

- `app/api/cron/news-automation/route.js`
- `lib/news-system/*`
- `config/news-system.config.mjs`
- `scripts/build-generated-news-index.mjs`
- `data/news-generated/*.json`
- `data/generatedNews.js`

Cron limitation:

- Vercel Hobby only supports daily cron. It rejects `0 */3 * * *`.
- For every-3-hour automation, either upgrade to Vercel Pro or use an external scheduler that calls `/api/cron/news-automation` with `CRON_SECRET`.

Compliance:

- Do not use third-party news images unless licensing is verified.
- Keep source title, source name, source link, and date.
- Do not copy full articles.
