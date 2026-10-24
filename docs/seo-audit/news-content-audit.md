# News Content Audit

Generated: 2026-10-24T08:29:40.282Z

- Total News records reviewed: 7
- Marked noindex and excluded from listings/sitemaps: 7
- Eligible to remain indexable: 0

This report is generated from existing CMS and legacy content records. No records were deleted.

## Current publishing controls

- The 12-hour ingest task only records site-scoped candidates and audit logs. It cannot compose, write CMS content or publish.
- The 48-hour publisher can run only when `NEWS_AUTOMATION_PRODUCTION_ENABLED=true`. It must pass source, duplicate, content and public frontend verification before it records success.
- A failed source, quality or post-publication health check is saved as `retry_pending` or reverted to `draft`; it is not kept publicly indexable.
- Blog automation is isolated from News automation.

## Review rules

- Draft or archived News remains excluded from public listings and sitemaps.
- Published News can remain indexable only when it has not been archived or explicitly marked `seoIndexable: false`.
