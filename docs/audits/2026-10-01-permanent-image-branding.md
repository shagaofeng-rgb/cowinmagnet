# Permanent image branding — 2026-10-01

## Scope

The official transparent logo `public/images/cowin-logo.png` was composited into 173 published local content-image files from 172 sources; the homepage hero has separate desktop and mobile versions. The images include published product primary photos, engineering diagrams, industry and application scenes, page heroes, selected article/news media, the homepage video poster and responsive banner variants. No AI redraw was used: the original picture and official logo pixels remain unchanged apart from the added corner mark and normal output encoding.

Original assets remain in place. Branded siblings use the `-cowin-brand-20261001` suffix, and published code/data references point to those new files. The complete source-to-output mapping, dimensions, selected corner and checksums are in `2026-10-01-branded-image-manifest.json`.

## Placement

- The mark uses the site's existing blue symbol on a small, translucent white plate, scaled to the image's shorter edge and inset from the border.
- Product photos favor an uncluttered upper corner to avoid the product page's bottom-right “Open image” control.
- The homepage hero uses separate desktop and mobile crops with dedicated logo positions so neither crop cuts off the mark or covers the left-aligned headline.
- Other scene images use the least visually busy suitable corner, preferring the lower right. The logo is never painted onto an equipment nameplate or presented as a manufacturer label.
- Small engineering dimension and installation drawings receive a separate white footer containing the logo; none of the technical labels, lines or dimensions are covered.

## Exclusions and future media

Navigation logos, favicons, interface icons, QR codes, and unused historical product-gallery/source-product files are not stamped: a mark on those assets would harm their function or imply ownership of unused third-party material. The third-party Blog/CMS feed serves some remote images that are not local files; this batch does not alter its publishing pipeline or remotely hosted originals. New uploads should be reviewed and run through the same branding step before publication.

## Reproduction and rollback

- Regenerate the branded files and references with `node scripts/brand-published-images.mjs --apply`. Running without `--apply` lists the local image inventory; `--preview=/images/...` creates one preview in `/tmp` without changing site files.
- Before the batch, Git branch `codex/pre-logo-stamp-3dab033` preserved the unbranded publication state. Reverting the branding commit or restoring that branch and redeploying restores the previous page references. The original source images were not overwritten.
