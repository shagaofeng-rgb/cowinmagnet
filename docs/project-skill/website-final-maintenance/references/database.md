# Database

Database access is via Postgres helpers in `lib/`. Backups should be created before production-risk work.

Observed tables during final audit:

- `admin_accounts`
- `admin_password_resets`
- `analytics_events`
- `cms_items`

Backup rules:

- Use `pg_dump` if available.
- If `pg_dump` is unavailable, export table contents through a controlled Node + `pg` JSON backup.
- Store backups outside the repository.
- Never commit DB backups, `.env`, or exported secrets.

Cleanup rules:

- Do not delete official products, news, analytics, inquiries, or admin accounts without explicit approval.
- Test records must be marked TEST and removed after verification when created.
