# Schedules and trigger chain baseline

| Task | Current entry | Current cadence | Writes | Observed state | New treatment |
| --- | --- | --- | --- | --- | --- |
| Legacy discovery | `/api/automation/news-discovery` | once daily at 01:05 UTC | `news_candidates`, legacy editorial plans, run log | successful runs with source failures and mixed relevance | replace with 12-hour candidate-only ingest; no plans, LLM, CMS, sitemap or publish calls |
| Legacy publish | `/api/automation/news-publish` | calendar every two days at 02:15 UTC | generated article, CMS News, sitemap, observation | several skips caused by product/source constraints; one recent publish | replace with 12-hour due-check route that publishes only when a 48-hour site cycle is due and verifies the public list, detail and sitemap before success |
| Blog webhook retry | `/api/cron/blog-publish-retry` | every 30 minutes | `blog_webhook_jobs`, Blog CMS rows | separate external Blog publisher | preserve as Blog-only; News code has no access to this job or its table |
| Sitemap maintenance | `/api/cron/sitemap-maintenance` | every 3 days | sitemap snapshot | independent shared SEO maintenance | retain; News only marks its own News content dirty through the CMS adapter |

All listed Vercel schedules use UTC. The new News scheduler records the configured site timezone and calculates its 12/48-hour windows from the site configuration.
