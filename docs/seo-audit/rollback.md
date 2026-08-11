# Rollback

1. Restore tracked files from `.backups/seo-remediation-20260806-204147` or revert the remediation commit.
2. Rebuild and validate sitemap before deployment.
3. No CMS rows are deleted by this remediation. Draft, archived and noindex News remains excluded from public discovery.
4. To stop automatic News publishing immediately, set `NEWS_AUTOMATION_PRODUCTION_ENABLED=false`; candidate ingestion remains independent.
5. Revert redirect rules only after checking Search Console and internal-link impact.
