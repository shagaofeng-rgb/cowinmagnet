# Testing

Standard check order:

1. `tsc --noEmit`
2. `eslint .`
3. `next build --webpack`
4. Local smoke against `localhost`
5. Local monitor
6. Browser check: desktop and mobile
7. Deploy
8. Alias production domains
9. Production smoke
10. Production monitor

Smoke script:

- `scripts/final-audit-smoke.mjs`
- Supports `SITE_URL`, `ADMIN_SMOKE_EMAIL`, `ADMIN_SMOKE_PASSWORD`.
- Writes JSON reports to `docs/final-audit/runtime/`.

Monitor script:

- `scripts/monitor/run-monitor.mjs --no-email`
- Writes JSON/HTML reports to `reports/website-monitor/`.

Browser QA must check console errors, horizontal overflow, visible script artifacts, H1 count, and missing alt.
