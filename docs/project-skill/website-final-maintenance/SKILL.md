---
name: website-final-maintenance
description: Maintain, audit, repair, test, and deploy the Cowinmagnet Next.js B2B website, including products, admin analytics, SEO/GEO, multilingual pages, news automation, Vercel deployment, rollback, and final acceptance reporting.
---

# Website Final Maintenance

Use this skill for Cowinmagnet maintenance, launch checks, regression testing, SEO/GEO audits, product/news cleanup, admin QA, Vercel deployment, and rollback planning.

## Project Snapshot

- Project root: `/Users/apple/Documents/cowinmagnet.com/repo-src`
- Framework: Next.js App Router
- Frontend: React, TypeScript, JavaScript, CSS in `app/globals.css`
- Backend: Next.js API routes under `app/api`
- Data: static product/news data plus Postgres-backed admin/analytics tables
- Deployment: Vercel project `cowinmagnet`
- Production domains: `www.cowinmagnet.com`, `cowinmagnet.com`
- Admin auth: cookie session via `/api/admin/login`
- News automation: `/api/cron/news-automation`

Do not store or reveal passwords, tokens, database URLs, or environment-variable values.

## Required Workflow

1. Inspect current git status, branch, latest commit, deployment target, and environment.
2. Back up before risky work: git branch/tag, database export, public assets, and non-committed config snapshots.
3. Identify whether the task touches product data, public layout, admin, SEO, news automation, or deployment.
4. Make the smallest safe fix. Do not redesign layout unless the user explicitly asks.
5. Run checks in this order: lint, typecheck, build, smoke, monitor, browser/mobile check.
6. Deploy with Vercel only after local checks pass.
7. Confirm aliases for `www.cowinmagnet.com` and `cowinmagnet.com` point to the new deployment.
8. Run production smoke and monitor after aliasing.
9. Write or update final report and rollback notes.

## High-Risk Rules

- Never delete products, inquiries, analytics records, admin accounts, media, or generated news without backup and explicit reason.
- Do not commit `.env`, passwords, database URLs, Vercel tokens, email secrets, or backups containing secrets.
- Do not run destructive CRUD tests on production unless the user specifically approves and cleanup is guaranteed.
- If Vercel Hobby rejects cron frequency above daily, record it as a platform limitation and deploy with a supported schedule.
- Generated news must not use third-party article images unless licensing is verified; prefer Cowinmagnet company-library images.
- Product content must not expose old scraped scripts such as `window.onload`, `UA-162924846`, or `products_details.css`.

## Common Commands

Use the bundled Node runtime when the system Node/npm tools are unavailable:

```bash
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/typescript/bin/tsc --noEmit
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/eslint/bin/eslint.js .
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/.bin/next build --webpack
SITE_URL=https://www.cowinmagnet.com /Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/final-audit-smoke.mjs
SITE_URL=https://www.cowinmagnet.com /Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/monitor/run-monitor.mjs --no-email
/tmp/vercel-full/node_modules/.bin/vercel --prod --yes
```

## Reference Loading

Read only the reference needed for the current task:

- `references/architecture.md` for system layout and data flow.
- `references/frontend.md` for routing, components, responsive checks, and layout guardrails.
- `references/backend.md` for API, admin, authentication, and forms.
- `references/database.md` for backup and table notes.
- `references/seo-geo.md` for SEO, schema, AI search, sitemap, robots, hreflang.
- `references/multilingual.md` for locale rules and language QA.
- `references/auto-publishing.md` for news automation and cron limits.
- `references/testing.md` for check order and acceptance.
- `references/deployment.md` for Vercel deploy, alias, rollback.
- `references/troubleshooting.md` for known failures and fixes.

## Completion Signal

A maintenance task is complete only when:

- Local build passes.
- Relevant automated checks pass or residual risks are documented.
- Production smoke passes after deployment when deployment is requested.
- Modified files and rollback path are reported.
