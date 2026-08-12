# Content Operations Guide

## Scheduled News workflow

- The ingest job collects, normalizes, scores and deduplicates candidates only.
- The publisher preserves a minimum 48-hour gap between successful News publications.
- A generated item must pass structured-document validation and deployed-page health checks before it is considered published.
- An invalid or failed item is retained as `needs_revision`; it is not treated as a successful publication.

## Reviewing a failed item

1. Open the News record in the CMS and review its validation errors and source evidence.
2. Correct only factual, source-backed content or replace the candidate.
3. Keep the public article document limited to its approved structured fields; workflow notes, prompts and evidence remain private.
4. Republish through the existing automation endpoint or CMS action. The delivery check then verifies the list page, detail page, metadata, schema, image and CTA.

## Alerts and retries

The publisher records run state, validation results and delivery checks in the News automation tables. Recoverable delivery failures use the existing retry path. Re-running an already-held legacy-content audit is safe: it will not create duplicate CMS writes.

## Adding approved product facts

Add a fact only to the approved product source in the CMS with its model/configuration and applicable conditions. Do not place unverified figures, performance claims, certifications or commercial commitments in News content. The structured validator blocks unsupported claims before publication.

## Rollback

Restore the affected CMS payload from `.backups/news-automation-2026-08-12T07-57-08-904Z`, then redeploy the previous Vercel deployment if the renderer itself needs to be reverted. The database migration is additive; do not remove audit data without a confirmed retention decision.
