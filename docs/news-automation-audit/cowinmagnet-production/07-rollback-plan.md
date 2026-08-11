# Rollback plan

1. The untouched source files were copied before edits to `.backups/news-automation-20260811-132258/`.
2. The source baseline is Git commit `06f466e` on `main`.
3. Do not run the new migration rollback blindly in production. First pause Vercel News cron routes, export rows created after rollout, then restore the previous application commit.
4. The migration is additive. New columns and tables can be removed only after confirming no new runs depend on them; historical CMS News and Blog content is never part of rollback deletion.
5. This local workspace cannot create a Git branch because `.git/refs` is write-protected; the failure is recorded for repository administration.
