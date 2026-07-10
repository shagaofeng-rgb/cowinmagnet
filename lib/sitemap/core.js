import crypto from "node:crypto";

export const MAX_SITEMAP_URLS = 50_000;
export const MAX_SITEMAP_BYTES = 50 * 1024 * 1024;

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_OPEN = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
const URLSET_CLOSE = "</urlset>";

export function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function normalizeLastmod(value) {
  const date = value instanceof Date ? value : new Date(value || "");
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function normalizeAbsoluteUrl(value, siteOrigin) {
  try {
    const url = new URL(String(value));
    if (url.protocol !== "https:" || url.origin !== siteOrigin || url.search || url.hash) return "";
    return url.toString().replace(/\/$/, url.pathname === "/" ? "/" : "");
  } catch {
    return "";
  }
}

export function normalizeSitemapEntry(entry, siteUrl) {
  const siteOrigin = new URL(siteUrl).origin;
  const loc = normalizeAbsoluteUrl(entry?.loc, siteOrigin);
  const lastmod = normalizeLastmod(entry?.lastmod);
  if (!loc || !lastmod) return null;

  const alternates = [];
  const seen = new Set();
  for (const alternate of entry?.alternates || []) {
    const hreflang = String(alternate?.hreflang || "").trim();
    const href = normalizeAbsoluteUrl(alternate?.href, siteOrigin);
    const key = `${hreflang}:${href}`;
    if (!hreflang || !href || seen.has(key)) continue;
    seen.add(key);
    alternates.push({ hreflang, href });
  }

  return { loc, lastmod, alternates };
}

export function serializeUrlEntry(entry) {
  const alternateXml = (entry.alternates || [])
    .map(
      (alternate) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`
    )
    .join("\n");
  return [
    "  <url>",
    `    <loc>${escapeXml(entry.loc)}</loc>`,
    `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`,
    alternateXml,
    "  </url>"
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildUrlsetXml(entries) {
  return `${XML_HEADER}\n${URLSET_OPEN}\n${entries.map(serializeUrlEntry).join("\n")}\n${URLSET_CLOSE}`;
}

export function buildSitemapIndexXml(files, siteUrl) {
  const origin = new URL(siteUrl).origin;
  const body = files
    .map(
      (file) => `  <sitemap>
    <loc>${escapeXml(`${origin}/sitemaps/${file.name}`)}</loc>
    <lastmod>${escapeXml(file.lastmod)}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `${XML_HEADER}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`;
}

export function validateSitemapXml(xml, { kind = "urlset" } = {}) {
  const text = String(xml || "");
  const errors = [];
  if (!text.startsWith(XML_HEADER)) errors.push("missing-xml-declaration");
  if (/&(?!amp;|lt;|gt;|quot;|apos;)/.test(text)) errors.push("unescaped-ampersand");

  if (kind === "index") {
    if (!text.includes("<sitemapindex ") || !text.endsWith("</sitemapindex>")) errors.push("invalid-sitemap-index-root");
    if ((text.match(/<sitemap>/g) || []).length !== (text.match(/<\/sitemap>/g) || []).length) errors.push("unbalanced-sitemap-tags");
  } else {
    if (!text.includes("<urlset ") || !text.endsWith(URLSET_CLOSE)) errors.push("invalid-urlset-root");
    if ((text.match(/<url>/g) || []).length !== (text.match(/<\/url>/g) || []).length) errors.push("unbalanced-url-tags");
  }

  for (const match of text.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const decoded = match[1].replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    try {
      const url = new URL(decoded);
      if (!/^https:$/.test(url.protocol)) errors.push("non-https-loc");
    } catch {
      errors.push("invalid-loc");
    }
  }

  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

export function chunkSitemapEntries(entries, { maxUrls = MAX_SITEMAP_URLS, maxBytes = MAX_SITEMAP_BYTES } = {}) {
  const overhead = Buffer.byteLength(`${XML_HEADER}\n${URLSET_OPEN}\n\n${URLSET_CLOSE}`, "utf8");
  const chunks = [];
  let chunk = [];
  let bytes = overhead;

  for (const entry of entries) {
    const entryBytes = Buffer.byteLength(`${serializeUrlEntry(entry)}\n`, "utf8");
    if (entryBytes + overhead > maxBytes) throw new Error(`Sitemap entry exceeds file limit: ${entry.loc}`);
    if (chunk.length && (chunk.length >= maxUrls || bytes + entryBytes > maxBytes)) {
      chunks.push(chunk);
      chunk = [];
      bytes = overhead;
    }
    chunk.push(entry);
    bytes += entryBytes;
  }
  if (chunk.length) chunks.push(chunk);
  return chunks;
}

function latestDate(entries) {
  return entries.reduce((latest, entry) => (entry.lastmod > latest ? entry.lastmod : latest), "1970-01-01");
}

function sitemapFileName(section, index, count) {
  return count === 1 ? `sitemap-${section}.xml` : `sitemap-${section}-${index + 1}.xml`;
}

export function diffSitemapManifests(previous = {}, current = {}) {
  const added = [];
  const modified = [];
  const removed = [];
  for (const [url, lastmod] of Object.entries(current)) {
    if (!(url in previous)) added.push(url);
    else if (previous[url] !== lastmod) modified.push(url);
  }
  for (const url of Object.keys(previous)) {
    if (!(url in current)) removed.push(url);
  }
  return { added, modified, removed };
}

export function buildSitemapSnapshotPayload({ sections, siteUrl, generatedAt = new Date().toISOString(), maxUrls, maxBytes }) {
  const files = [];
  const manifest = {};
  const skipped = [];
  const globalSeen = new Set();

  for (const [section, rawEntries] of Object.entries(sections)) {
    const entries = [];
    for (const rawEntry of rawEntries || []) {
      const entry = normalizeSitemapEntry(rawEntry, siteUrl);
      if (!entry) {
        skipped.push({ section, url: String(rawEntry?.loc || ""), reason: "invalid-url-or-lastmod" });
        continue;
      }
      if (globalSeen.has(entry.loc)) {
        skipped.push({ section, url: entry.loc, reason: "duplicate-url" });
        continue;
      }
      globalSeen.add(entry.loc);
      manifest[entry.loc] = entry.lastmod;
      entries.push(entry);
    }

    const chunks = chunkSitemapEntries(entries, { maxUrls, maxBytes });
    chunks.forEach((chunk, index) => {
      const xml = buildUrlsetXml(chunk);
      const validation = validateSitemapXml(xml);
      if (!validation.valid) throw new Error(`Invalid ${section} sitemap XML: ${validation.errors.join(", ")}`);
      files.push({
        name: sitemapFileName(section, index, chunks.length),
        section,
        lastmod: latestDate(chunk),
        urlCount: chunk.length,
        byteSize: Buffer.byteLength(xml, "utf8"),
        xml
      });
    });
  }

  const indexXml = buildSitemapIndexXml(files, siteUrl);
  const indexValidation = validateSitemapXml(indexXml, { kind: "index" });
  if (!indexValidation.valid) throw new Error(`Invalid sitemap index XML: ${indexValidation.errors.join(", ")}`);

  const manifestHash = crypto.createHash("sha256").update(JSON.stringify(manifest)).digest("hex");
  return {
    version: 1,
    siteUrl: new URL(siteUrl).origin,
    generatedAt,
    manifestHash,
    manifest,
    indexXml,
    files,
    totalUrls: Object.keys(manifest).length,
    totalBytes: files.reduce((sum, file) => sum + file.byteSize, Buffer.byteLength(indexXml, "utf8")),
    split: files.length > Object.keys(sections).filter((key) => (sections[key] || []).length).length,
    skipped
  };
}
