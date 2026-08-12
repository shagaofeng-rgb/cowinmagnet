# Automated News System and Published Content Remediation

Generated: 2026-08-12

## Scope

This change replaces public News article rendering from unbounded legacy Markdown/HTML fragments with a validated structured document contract. It preserves legacy records, media references, public slugs and canonical paths.

## Production migration sequence

1. A timestamped data backup was created before this work at `.backups/news-automation-2026-08-12T07-57-08-904Z`.
2. Additive storage is available through `db/migrations/20260812_structured_article_documents.sql` and the News storage schema bootstrap.
3. Run `POST /api/automation/content-remediation` with the configured Cron Secret. It updates the existing RCDD record and immediately performs an HTTP health check.
4. Run `GET /api/automation/content-remediation/audit?apply=true` with the Cron Secret. It audits all News and Blog CMS records. Invalid legacy News entries are held as `needs_revision`, set to `noindex,follow`, and kept in storage for revision. No record, URL or media is deleted.
5. Export `content-audit-after.csv` from the protected audit endpoint after the update.

## RCDD regression repair

The existing URL remains unchanged:

`/en/news/selection-checklist-rcdd-self-cooling-self-dumping-electromagnetic-iron-remover`

It is now a `technical-guide`, renders `Article` rather than `NewsArticle`, has a single H1, five technical sections plus one visible FAQ section, one focused quote-request CTA, no source panel, and no mining-news references. The legacy body is retained privately in `legacyContentBackup` on the existing CMS record.

## Publication controls

- The scheduled ingest path continues to collect candidates only.
- The publisher keeps the existing 48-hour minimum gap.
- New automated News content is generated as structured JSON and must pass deterministic validation before it can be written to public CMS data.
- A failed delivery check sends the generated record to `needs_revision`/retry flow rather than treating a CMS write as a successful publication.
- News content uses `NewsArticle`; technical or application guides use `Article`.

## Rollback

- Restore the affected payload from the timestamped backup above or the `cms_items` backup artifact.
- Revert this commit and redeploy the prior Vercel deployment.
- The database migration is additive. To roll it back after confirming no retained audit is needed, drop only `content_remediation_audits` and the three new `generated_articles` columns. Do not run that command automatically.

## Known environment constraint

The local Windows runner resolves the Neon host to IPv6 only and cannot connect to it. The production application on Vercel performs the protected migration and audit within its own runtime. No local or simulated data was used in place of production data.
