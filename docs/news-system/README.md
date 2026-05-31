# Cowinmagnet Global Industry News Opportunity System

This module turns global industry news into reviewed B2B content opportunities for Cowinmagnet.

Cowinmagnet positioning used by the system:

- Brand: Cowinmagnet
- Company: Quzhou Qiying Import & Export Co., Ltd
- Website: https://www.cowinmagnet.com
- Positioning: magnetic separation equipment sourcing and export service partner
- Forbidden claims: own factory, source manufacturer, factory direct, production base, project participation claims

## Architecture

1. News Fetcher  
   Pulls items from RSS feeds and optional APIs such as Bing News Search and NewsAPI.

2. News Scoring Engine  
   Scores each item by relevance, pain point, industry value, market value, freshness, authority and content opportunity.

3. Product Match Engine  
   Matches the news angle to Cowinmagnet product categories:
   - Permanent Magnetic Separation Equipment
   - Electromagnetic Separation Equipment
   - Magnetic Rollers, Magnetic Bars & Magnetic Components

4. Content Generator  
   Generates an English draft with source reference, short news summary, pain point analysis, Cowinmagnet viewpoint, product match, scenario, CTA and SEO keywords.

5. Image Handler  
   Outputs safe image recommendations and AI image prompts. It does not copy copyrighted news images.

6. Manual Review Dashboard  
   Available at `/en/admin/news-opportunities`.

7. Export Layer  
   Outputs JSON, Markdown, CSV and HTML. WordPress/Strapi publishing can be connected later.

## Local Commands

Run a daily scan:

```bash
npm run news:daily
```

Build the Next.js site:

```bash
npm run build
```

## API Routes

- `GET /api/news-opportunities`  
  Lists local daily runs and latest summary.

- `POST /api/news-opportunities/run`  
  Runs the fetch-score-generate workflow. If `NEWS_SYSTEM_ADMIN_TOKEN` is set, send `Authorization: Bearer <token>`.

- `GET /api/news-opportunities/2026-05-31`  
  Returns a daily JSON report.

- `GET /api/news-opportunities/2026-05-31?format=md`  
  Returns Markdown.

- `GET /api/news-opportunities/2026-05-31?format=csv`  
  Returns CSV.

- `GET /api/news-opportunities/2026-05-31?format=html`  
  Returns HTML.

## Configuration

Main config:

```text
config/news-system.config.mjs
```

Environment variables:

```text
OPENAI_API_KEY=
OPENAI_NEWS_MODEL=gpt-4.1-mini
BING_NEWS_API_KEY=
NEWSAPI_KEY=
GOOGLE_CUSTOM_SEARCH_API_KEY=
GOOGLE_CUSTOM_SEARCH_CX=
NEWS_SYSTEM_ADMIN_TOKEN=
WORDPRESS_API_URL=
WORDPRESS_USERNAME=
WORDPRESS_APP_PASSWORD=
```

If no API keys are configured, the system uses local sample items so the dashboard and exports can be previewed.

## Scoring Algorithm

Default weights:

| Dimension | Weight |
|---|---:|
| Relevance | 0.24 |
| Pain Point | 0.22 |
| Industry Value | 0.18 |
| Market Value | 0.14 |
| Freshness | 0.10 |
| Authority | 0.07 |
| Content Opportunity | 0.05 |

Minimum publish-candidate score:

```text
68
```

## AI Prompt Rules

The generator must:

- Summarize only; never copy full source articles.
- Keep the original source title, URL, source name, author if present, published date and retrieved date.
- Avoid political-heavy or unrelated news.
- Avoid exploiting accidents or disasters.
- Avoid fake sources, fake quotes, and false participation claims.
- Use careful language: may help, can support, is often used to, could reduce, should be evaluated.
- Avoid any claim that Cowinmagnet owns a factory or is factory direct.

## Manual Review Workflow

Supported statuses:

```text
fetched -> scored -> generated -> reviewed -> approved -> rejected -> published
```

The current local version stores status in JSON. For production, use the PostgreSQL schema in:

```text
docs/news-system/database-schema.sql
```

## Vercel Cron Example

Add a cron endpoint later, or point Vercel Cron to the existing API:

```json
{
  "crons": [
    {
      "path": "/api/news-opportunities/run",
      "schedule": "0 1 * * *"
    }
  ]
}
```

For protected cron runs, include a token through middleware or a dedicated cron route that checks `CRON_SECRET`.

## Copyright Compliance

- Do not download or reuse news images unless the license is confirmed.
- Do not republish full articles.
- Keep source URL and retrieved date.
- Treat news as a trigger for independent industrial analysis.
- Manually review every generated draft before publishing.

## Production Upgrade Path

1. Add Bing News, NewsAPI or Google Custom Search API keys.
2. Replace local file storage with PostgreSQL using the provided schema.
3. Add approve/reject API endpoints for reviewer workflow.
4. Connect approved items to WordPress, Strapi or a Next.js CMS.
5. Add multilingual generation after the English master draft is approved.
6. Track impressions, clicks, inquiries and source-to-lead performance.
