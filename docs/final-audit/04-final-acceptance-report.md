# Cowinmagnet Final Acceptance Report

Generated: 2026-06-09 12:35 Asia/Shanghai

Status: PRODUCTION_VERIFIED_SOURCE_COMMITTED_LOCALLY

## Project Information

- Repository: `shagaofeng-rgb/cowinmagnet`
- Local branch: `main`
- Vercel project: `davidsha/cowinmagnet`
- Production domain: `https://cowinmagnet.com`
- Production deployment: `dpl_EnqkHC6FyBkhy7UCAmXUrUJpQzuj`
- Deployment URL: `https://cowinmagnet-gk4r06f24-davidsha.vercel.app`
- Runtime: Next.js on Vercel, Node.js 24.x
- Database: PostgreSQL via `DATABASE_URL`

## Completed Changes

- Current production Cron uses a single endpoint: `/api/cron/analytics-sync`.
- Current schedule is `0 */3 * * *`.
- News automation is triggered from the analytics-sync backup logic when the last successful news job is older than 3 hours.
- Added sync run persistence in `sync_job_runs`.
- Added PostgreSQL advisory-lock protection for sync jobs.
- Added admin sync status API at `/api/admin/sync-status`.
- Updated admin realtime panels to show cron sync status.
- Rebuilt admin date range handling for day, week, month, and custom ranges.
- Restored custom date interaction: validation, clear, outside-click close, Escape close, and pending state.
- Added `.vercelignore` and ignored local tooling/runtime output.
- Added production `CRON_SECRET` in Vercel without committing the value.

## Verification Results

- `npm run build`: passed.
- `npx tsc --noEmit`: passed.
- `npx eslint .`: passed with 0 errors and existing warnings only.
- `npm run verify`: public 32/32 passed, admin smoke 2/2 passed.
- Vercel production status: Ready.
- Vercel cron list must contain one job only: `analytics-sync` every 3 hours. Do not restore the older separate `news-automation` cron.
- Manual production sync trigger: `200 OK`.
- Latest production sync result: `storageMode=database`, `processedCount=18`.
- Final smoke report: `docs/final-audit/runtime/smoke-1780979322107.json`.

## Rollback

Preferred rollback is Vercel deployment promotion:

1. Open Vercel project `davidsha/cowinmagnet`.
2. Promote the previous known-good deployment, or run `vercel rollback <deployment-url> --scope davidsha --yes`.
3. Confirm `cowinmagnet.com`, `/en`, `/admin/login`, `/sitemap.xml`, and `/api/cron/analytics-sync`.

Code rollback after GitHub push is available with:

```bash
git revert 92be8c1
```

## Remaining Item

The code is committed locally as `92be8c1 Restore admin sync automation and date filters`, but GitHub push is still blocked by GitHub CLI authentication in this desktop session. Production is already running the fixed deployment, but the remote GitHub `main` branch must be updated to prevent future GitHub-triggered deployments from overwriting this production fix.
