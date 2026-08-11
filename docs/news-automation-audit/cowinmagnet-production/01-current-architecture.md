# Current architecture baseline

Audited: 2026-08-11 (Asia/Shanghai)

- Framework: Next.js App Router, Vercel Cron, PostgreSQL/Neon and the `cms_items` content store.
- Public News uses `/news` and `/news/[slug]`; localized pages reuse the same `type = news` CMS records.
- Public Blog uses `/blog` and `/blog/[slug]` and an external signed webhook with a durable retry table. That webhook is a distinct Blog source and is not a News candidate consumer.
- Legacy News discovery lived in `lib/newsOperations.js` and wrote `news_candidates`. Its publish path selected a product plan, called an LLM, wrote `cms_items.type = news`, updated sitemap state and then made a partial health check.
- Legacy schema had no `site_id`; candidate source URLs and publish locks were global. The new migration adds site isolation and dedicated delivery/audit tables without deleting historical rows.

## Baseline findings

1. The previous discovery route also seeded product editorial plans. That is prohibited for the new ingest-only job.
2. Legacy publish could skip because two sources, a product plan or model credentials were unavailable. This conflicts with a mandatory 48-hour delivery cycle with fallback sources and retries.
3. Existing News rendering already supports source references, but the shared template also renders product-oriented material and a quotation CTA. New automated News will not populate those sales fields and the page will be adjusted to use a neutral editorial disclaimer.
4. Current database records show rejected and verified candidates plus several legacy generated articles. They remain available for review; no historical rows are deleted by this work.
