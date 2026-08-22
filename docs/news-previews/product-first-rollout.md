# Product-first News rollout

Status: local implementation and sample generation only. No preview article has been saved to the CMS, added to a sitemap, or deployed.

## Publishing contract

1. Resolve a verified COWIN product and its owned primary image before drafting.
2. Write the product role, process position, application conditions, configuration boundary, and enquiry checklist first.
3. Resolve a directly relevant, verified external report after the product context is established.
4. Add the report in the `Recent industry reporting` section with its publisher, title, date, link, original editorial summary, and a clear non-affiliation boundary.
5. Reject any document that moves reporting ahead of product/application context, lacks a 60-120 word source summary, or falls below 1,100 words.
6. Bind the COWIN product image and product URL as immutable publication context. Do not use an external news image without a rights record.
7. Run the existing fact, source, similarity, rendering, SEO, sitemap, RSS and frontend delivery checks before publication.

## Local samples

The generated samples are stored in `product-first-news-previews.json` and `product-first-news-previews.md` in this directory:

- Permanent Overband Magnetic Separator for aggregate conveyor protection
- Wet Drum Magnetic Separator for mineral slurry processing
- Drawer Magnet for dry powder contamination control

The external reports are context only. No external imagery, numerical performance statement, competitor brand, customer relationship, or project claim is introduced.

## Local page

When `NEWS_LOCAL_PREVIEW=true`, the guarded, unlinked route below renders the samples with the production News component:

`/en/news-preview/product-first?sample=1`

Use `sample=2` or `sample=3` for the remaining samples. The route returns 404 unless the local preview environment variable is explicitly enabled and is not part of the sitemap.
