import manifest from "@/docs/audits/2026-10-01-branded-image-manifest.json";

const brandedBySource = new Map(manifest.entries.map((entry) => [entry.source, entry.branded]));

/** Resolve historical CMS image references to the published, permanently branded file. */
export function brandedImageUrl(value: string): string {
  if (!value) return value;
  try {
    const url = new URL(value, "https://www.cowinmagnet.com");
    if (!/(^|\.)cowinmagnet\.com$/i.test(url.hostname)) return value;
    const branded = brandedBySource.get(url.pathname);
    if (!branded) return value;
    return value.startsWith("/") ? `${branded}${url.search}${url.hash}` : `${url.origin}${branded}${url.search}${url.hash}`;
  } catch {
    return value;
  }
}
