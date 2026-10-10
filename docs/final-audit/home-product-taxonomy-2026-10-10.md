# Homepage product taxonomy — 2026-10-10

## Change

The homepage previously filtered six featured cards, so most published catalogue products could never appear under its small product tabs. It now classifies all 88 static products by equipment type and shows three cards per page. The first three featured cards and their visual treatment remain unchanged. A page selector allows direct access to later pages without stacking the entire catalogue on one screen.

| Homepage family | Products |
| --- | ---: |
| Suspended Magnets | 21 |
| Pulleys & Drums | 6 |
| Magnetic Separators | 30 |
| Components & Filters | 20 |
| Metal Detection & Recycling | 6 |
| Industrial Equipment | 5 |
| Total | 88 |

Model-level exceptions in `lib/homeProductTaxonomy.ts` distinguish suspended iron removers, conveyor head pulleys and magnetic drums, and pipeline magnets from the older broad catalogue categories. The original product URLs and main catalogue data are unchanged. An unknown future category falls into an explicitly labelled Other Products tab rather than being hidden or assigned a misleading equipment type.

## Verification

- TypeScript and production build passed.
- ESLint passed with four existing News image warnings outside this change.
- 108 automated tests passed, including full taxonomy coverage and exception checks.
- Local smoke: 17/17 public and 2/2 admin entry checks passed.
- Local monitor: 22 pages, zero abnormal results.
- Browser: desktop tab wrap, category switching, last-page jump, 390px English and 430px Arabic layouts; no page-level horizontal overflow or console errors.
- No inquiry form was submitted and no customer or analytics records were modified.

## Rollback

The pre-change commit is preserved at branch `codex/home-taxonomy-prepatch-20261010`. Restore the previous Vercel deployment or re-alias the production domains to its verified deployment if rollback is needed; do not reset the working tree or alter the database.
