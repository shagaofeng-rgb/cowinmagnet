# CowinMagnet News media pipeline audit

Audit time: 2026-08-21 (Asia/Shanghai)

## Scope and baseline

- Production project: `cowinmagnet` on Vercel.
- Public News routes: `/en/news`, `/en/news/[slug]`, RSS and News sitemap routes.
- Backup created before any database migration: `.backups/news-automation-2026-08-21T10-10-10-712Z`.
- Published News records inspected: 104.
- Production News publication run recovered from a stale `running` state: 1. The recovered run and its reserved candidate were returned to retry-safe states; no article or historical CMS data was deleted.

## Confirmed root causes

1. The production `/api/automation/news-publish` route timed out at Vercel's 120-second limit. The prior publisher could try several candidates serially in one invocation, leaving a run marked `running` after timeout.
2. Product media was inferred from a generic catalogue image field. A legacy catalogue fallback could point an unrelated product at `automatic-cleaning-magnetic-separator.webp`, so a News record could show a mismatched image.
3. The article contract did not require a public 60 to 120 word source summary. Existing pages could render a bare source URL without factual context.
4. The legacy admin image action could write an external image URL directly to `coverImage`. That was a hotlink path and did not demonstrate reuse rights or controlled storage.
5. The current deployment configuration has no configured object-storage adapter for licensed external images. Serverless temporary storage is not a safe media store.
6. The inspected local production environment did not contain an OpenAI API key. A source-bound deterministic fallback is therefore required for the system to make a safe publication attempt; it does not invent product facts.

## Implemented corrective controls

- One fully verified candidate attempt per serverless publish invocation, with bounded composition and delivery timeouts.
- Stale publish-run recovery and candidate release.
- Same-product, owned-media resolution with an immutable media snapshot. Generic image fallbacks are rejected.
- Source evidence extraction and a required public editorial source summary.
- Structured article renderer source cards, reporting note, controlled-image rendering guard and related-product link rendering.
- New evidence, media and quality-check tables for auditable publication readiness.
- External media reuse blocked unless rights are explicit and a controlled-storage copy exists. In the current configuration, a valid owned product hero image is used instead.
- The older admin action now marks unlicensed or unsynchronised images for review instead of publishing remote URLs.

## Historical repair queue

`docs/audits/cowinmagnet-news-media-repair-queue.csv` is a non-destructive classification of the 104 published records:

- `repair`: 1 record with a controlled product image and citations but no valid public source summary.
- `needs-review`: 103 records missing a resolvable product/media or source evidence condition. They retain their URLs, publication dates, order, data and media until a review can establish the missing facts.

No record was deleted, slugged differently, re-dated, mass-noindexed or replaced with guessed facts during this implementation.

## Remaining configuration requirements

- Configure a durable object-store adapter and public base URL before licensed external images can be synchronized.
- Set `NEWS_AUTO_PUBLISH=true` in the production Vercel environment only after the deployed build has passed the production verification run.
- An OpenAI API key is optional for richer drafting. Without it, the publisher uses the validated source-bound continuity document and still blocks any unsupported claim.
