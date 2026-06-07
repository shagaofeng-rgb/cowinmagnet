# Deployment

Production deploy uses Vercel CLI:

```bash
/tmp/vercel-full/node_modules/.bin/vercel --prod --yes
```

After deploy, confirm aliases:

```bash
/tmp/vercel-full/node_modules/.bin/vercel alias ls --scope davidsha
/tmp/vercel-full/node_modules/.bin/vercel alias set <deployment>.vercel.app www.cowinmagnet.com --scope davidsha
/tmp/vercel-full/node_modules/.bin/vercel alias set <deployment>.vercel.app cowinmagnet.com --scope davidsha
```

Rollback:

- Use Vercel rollback or re-alias domains to a known previous deployment.
- Git backup branch/tag should exist before high-risk work.
- Keep DB/file backups outside the repo.

Never deploy a configuration Vercel rejects; fix or document the platform limitation first.
