# Project Inventory

Generated: 2026-06-07T02:12:24.030Z

## Current Version

- Branch: main
- Commit: be18431f889a6b8ddb45e6dd79c9d75347bb93be
- Remote: git@github.com:shagaofeng-rgb/cowinmagnet.git
- Vercel project id: prj_iXepbQHaIFG13YxbGRQgEJ2M6VVR
- Vercel org id: team_jV6c9fKQrHqay1jPr7GIKvgn

## Technology Stack

- Framework: Next.js 16.2.6
- Runtime: Node.js, Vercel serverless functions
- UI: React 19.2.6, CSS in app/globals.css
- Backend/API: Next.js App Router route handlers under app/api
- Database access: pg ^8.21.0, direct SQL helpers in lib/*Database.js and lib/cmsStore.js
- Database: Neon Postgres via DATABASE_URL
- Authentication: custom admin email/password hash + signed HTTP-only cookie
- CMS/admin: custom protected routes under app/admin/(protected)
- Deployment: Vercel CLI/project link
- Cron: Vercel cron routes configured in vercel.json
- i18n: URL locale segment and helpers in lib/i18n plus messages/*
- SEO: metadata exports, app/sitemap.ts, app/robots.ts, JSON-LD in page components
- News automation: scripts/run-news-system.mjs and lib/news-system/*
- Analytics: app/api/analytics/track + analytics_events table

## Directory Structure

- app/: public pages, admin pages, API routes, sitemap/robots/feed routes
- components/: frontend and admin React components
- data/: static product, blog, news, application and site data
- lib/: auth, CMS, analytics, SEO/linking, news automation, monitoring helpers
- messages/: locale message files
- public/: images, videos, downloadable assets and source product media
- scripts/: generated news index, monitor and news automation scripts
- docs/final-audit/: this audit output

## Counts

- Page route files: 45
- API route files: 33
- Public files: 922
- Public image/media files: 920
- Database tables: 4
- Database rows: 540

## Database Tables

- admin_accounts: 1 rows
- admin_password_resets: 6 rows
- analytics_events: 531 rows
- cms_items: 2 rows

## Environment Variables Present In Production Backup

Values are intentionally not shown.

- ADMIN_EMAIL
- ADMIN_JWT_SECRET
- ADMIN_PASSWORD_HASH
- DATABASE_URL
- DATABASE_URL_UNPOOLED
- GOOGLE_CLIENT_EMAIL
- GOOGLE_PRIVATE_KEY
- GOOGLE_SEARCH_CONSOLE_SITE_URL
- INQUIRY_BCC_EMAILS
- INQUIRY_FROM_EMAIL
- INQUIRY_TO_EMAIL
- NEON_AUTH_BASE_URL
- NEON_PROJECT_ID
- NEWS_ALLOW_AI_PHOTO_IMAGES
- NEWS_ENABLE_SOURCE_IMAGES
- NEWS_MAX_INLINE_IMAGES
- NEWS_MAX_POSTS_PER_DAY
- NEWS_MIN_INLINE_IMAGES
- NEWS_MIN_RELEVANCE_SCORE
- NEWS_PUBLISH_MODE
- NEWS_RUN_LIMIT
- NEWS_TIMEZONE
- NEXT_PUBLIC_SITE_URL
- NX_DAEMON
- PGDATABASE
- PGHOST
- PGHOST_UNPOOLED
- PGPASSWORD
- PGUSER
- POSTGRES_DATABASE
- POSTGRES_HOST
- POSTGRES_PASSWORD
- POSTGRES_PRISMA_URL
- POSTGRES_URL
- POSTGRES_URL_NON_POOLING
- POSTGRES_URL_NO_SSL
- POSTGRES_USER
- SITE_URL
- SMTP_HOST
- SMTP_PASS
- SMTP_PORT
- SMTP_SECURE
- SMTP_USER
- TURBO_CACHE
- TURBO_DOWNLOAD_LOCAL_ENABLED
- TURBO_REMOTE_ONLY
- TURBO_RUN_SUMMARY
- VERCEL
- VERCEL_ENV
- VERCEL_GIT_COMMIT_AUTHOR_LOGIN
- VERCEL_GIT_COMMIT_AUTHOR_NAME
- VERCEL_GIT_COMMIT_MESSAGE
- VERCEL_GIT_COMMIT_REF
- VERCEL_GIT_COMMIT_SHA
- VERCEL_GIT_PREVIOUS_SHA
- VERCEL_GIT_PROVIDER
- VERCEL_GIT_PULL_REQUEST_ID
- VERCEL_GIT_REPO_ID
- VERCEL_GIT_REPO_OWNER
- VERCEL_GIT_REPO_SLUG
- VERCEL_OIDC_TOKEN
- VERCEL_TARGET_ENV
- VERCEL_URL
- VITE_NEON_AUTH_URL

## Service Relationships

1. Public pages read static data from data/* and dynamic CMS items from cms_items.
2. Admin pages require cowin_admin_session cookie and read/write CMS and analytics tables.
3. Analytics tracking writes page_view/form_submit events to analytics_events.
4. News automation reads external/source configuration, generates candidate articles, stores/publishes through CMS helpers.
5. Sitemap and RSS aggregate static and CMS products/news.
6. Vercel cron calls /api/cron/news-automation and /api/cron/website-monitor.

## Deployment Relationship

- Source of truth: GitHub main branch.
- Production: Vercel project cowinmagnet, custom domains www.cowinmagnet.com and cowinmagnet.com.
- Persistent data: Neon Postgres plus public assets in repository/public.

## Potential Risks Found During Inventory

- Production env backup contains blank values for several optional SMTP/Search Console variables; verify before relying on reset email or GSC live metrics.
- pg_dump/psql are not installed locally, so database backup uses a JSON export through the pg client.
- .next and tsconfig.tsbuildinfo exist in local worktree and should remain ignored/uncommitted.
- Some requested destructive tests, such as database failure or service restart, must be simulated or documented instead of executed against production.
