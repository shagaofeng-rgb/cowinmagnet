# Rollback Plan

1. Identify last known good deployment.
2. Re-alias production domains or run Vercel rollback.
3. Revert git commit if source needs rollback.
4. Restore DB/files only if data changed.
5. Re-run smoke and monitor.
