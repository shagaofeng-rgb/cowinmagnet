# News Content Audit

Generated: 2026-08-08T08:51:04.469Z

- Total News records reviewed: 7
- Marked noindex and excluded from listings/sitemaps: 3
- Eligible to remain indexable: 4

This report is generated from existing CMS and legacy content records. No records were deleted.

## Current publishing controls

- The daily discovery task records candidate sources and planned topics only.
- The 48-hour publishing task can publish only when `NEWS_AUTOPUBLISH_ENABLED=true`, two independent HTTPS sources, the content-quality rules, a local product image and a self-made local process diagram all pass validation.
- A failed source, quality or post-publication health check is saved as `needs_review` or reverted to `draft`; it is not kept publicly indexable.
- Blog has no automatic publishing task. Manual CMS publishing remains available.

## Review rules

- Draft or archived News remains excluded from public listings and sitemaps.
- Published News can remain indexable only when it has not been archived or explicitly marked `seoIndexable: false`.
