# Backup And Rollback Plan

Generated: 2026-06-07T02:12:24.031Z

## Git Backup

- Backup branch: backup/pre-final-audit-20260607-1010
- Backup tag: pre-final-audit-20260607-1010
- Commit: be18431f889a6b8ddb45e6dd79c9d75347bb93be
- Remote push: completed

## Database Backup

- Backup file: /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/db/database-backup.json
- Summary file: /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/db/database-summary.json
- Tables: 4
- Rows: 540
- Restore note: this is a JSON logical backup because pg_dump is unavailable locally. Restore by replaying table rows with a controlled script after taking a fresh backup.

## File Backup

- Public and local data archive: /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/files/public-assets.tgz
- Production environment backup: /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/config/vercel-production.env
- Config snapshots: /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/config/
- Sensitive env file permissions: 0600

## Git Rollback

1. Confirm incident scope.
2. Checkout backup tag: git checkout pre-final-audit-20260607-1010
3. Create rollback branch if needed: git checkout -b rollback/YYYYMMDD-HHmm
4. Deploy rollback version with Vercel CLI or promote known-good deployment.
5. Rebind www.cowinmagnet.com and cowinmagnet.com to the rollback deployment.
6. Verify login, homepage, products, news, sitemap and robots.

## Database Rollback

1. Stop writes if a data-impacting issue is confirmed.
2. Create a new current backup before restore.
3. Compare current tables with /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/db/database-summary.json.
4. Restore only impacted tables/rows using a controlled script.
5. Verify row counts, admin login, CMS products/news, analytics health.

## File Rollback

1. Extract /Users/apple/Documents/cowinmagnet.com/final-audit-backups/20260607-1010/files/public-assets.tgz into a temporary directory.
2. Compare with current public/.data.
3. Restore only missing/changed required assets.
4. Rebuild and verify image/video URLs.

## Application Rollback

1. Prefer Vercel deployment promotion/alias rollback to a known deployment.
2. If rebuilding, deploy from backup tag.
3. Re-run smoke tests.

## Verification Checklist

- / returns 200
- /products returns 200
- one product detail returns 200
- /news returns 200
- one news detail returns 200
- /admin/login returns 200
- admin login succeeds
- /sitemap.xml and /robots.txt return 200
