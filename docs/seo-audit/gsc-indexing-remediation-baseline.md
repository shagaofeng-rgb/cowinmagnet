# GSC Indexing Remediation Baseline

Generated: 2026-08-22T07:03:30.461Z

- Live canonical sitemap URLs checked: 158
- Current sitemap URL HTTP failures: 0
- Static Blog records audited: 4
- Legacy Blog records removed from discovery pending rewrite: 4
- Explicitly retained indexable Blog records: 0

## Policy

Legacy Blog URLs remain available and keep their original publication date. Pages containing public editorial artifacts, raw publishing controls, or malformed legacy slugs are set to `noindex,follow` and are excluded from the Blog list and canonical sitemap. They are not deleted, redirected, or assigned a replacement URL until an individual rewrite/merge decision is verified.

## Search Console interpretation

The current sitemap is clean at HTTP level. Google coverage counts can include historical URLs that are no longer in the sitemap. Exact 404, redirect, alternate-canonical, and Google-selected-canonical examples must be exported from the GSC Pages report before a URL-specific redirect or canonical change is made.
