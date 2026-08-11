# News / Blog boundary audit

| Boundary | Existing state | Required change |
| --- | --- | --- |
| URL | `/news/*` and `/blog/*` are distinct | preserve |
| CMS type | one `cms_items` table with separate `type` values | retain strict `type` and add News `siteId` / `contentType` guards |
| Automation | News has its own routes; Blog has its own webhook and retry route | remove cross-purpose legacy News product-plan behavior; do not call Blog webhook from News |
| Sitemap | source code builds separate Blog and News entries | ensure automated News only writes `type = news` and delivery checks inspect News sitemap only |
| Media | legacy News uses product images | new automated News uses no image unless an owned/licensed neutral asset has a rights record |
| Analytics | no shared automated write path located | preserve existing page analytics without mixing automation events |

Conclusion: a shared CMS table is acceptable only with strict `type`, `siteId`, route and query filters. The new News store is separate from Blog job storage.
