# Troubleshooting

Known issues:

- `curl` may not be on PATH; use Node `fetch` for HTTP checks.
- Standalone `tsc --noEmit` can fail while `next build` is regenerating `.next/types`; rerun after build finishes.
- Vercel Hobby rejects cron schedules that run more than once per day.
- Generated news external images may return 403; replace with local company-library images.
- Old scraped product content can contain `window.onload`, `UA-162924846`, `products_details.css`, or tenant scripts. Use `lib/productDisplay.ts` and clean source data when confirmed.
- Production domain aliases may remain on older deployments after `vercel --prod`; always inspect and set aliases.

Do not treat a single timeout during deploy cutover as final. Re-run smoke after aliases settle.
