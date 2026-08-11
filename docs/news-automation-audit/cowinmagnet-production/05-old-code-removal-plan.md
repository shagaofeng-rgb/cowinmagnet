# Old code removal plan

The following legacy behavior is incompatible with the new News contract and will be removed or replaced:

1. Discovery seeding editorial/product plans.
2. Discovery states named only `verified` without a scored candidate lifecycle or site isolation.
3. Publish requiring two independent sources and a matching product before attempting a valid News article.
4. Product-image defaults, multi-product references and quotation-oriented output in automated News.
5. A global publish lock and global source/candidate uniqueness rules.

Historical data is retained. No CMS News, Blog post, source or candidate record is removed by this change.
