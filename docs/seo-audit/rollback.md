# Rollback

1. Restore tracked files from `.backups/seo-remediation-20260806-204147` or revert the remediation commit.
2. Rebuild and validate sitemap before deployment.
3. No CMS rows are deleted by this remediation. Automated News visibility is computed from stored fields and can be restored after documented editorial approval.
4. Revert redirect rules only after checking Search Console and internal-link impact.
