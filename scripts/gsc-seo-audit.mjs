// Reproducible, read-only technical SEO audit of published sitemap URLs.
// Usage: node scripts/gsc-seo-audit.mjs --phase=before --output=docs/seo/gsc-20261027
import fs from "node:fs/promises";
import path from "node:path";

const option = (name, fallback = "") => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
const siteUrl = option("site-url", "https://www.cowinmagnet.com").replace(/\/$/, "");
const targetOrigin = option("target-origin", siteUrl).replace(/\/$/, "");
const phase = option("phase", "audit").replace(/[^a-z0-9-]/gi, "-");
const outputDir = path.resolve(option("output", "docs/seo/gsc-20261027"));
const concurrency = Math.min(8, Math.max(1, Number(option("concurrency", "5"))));
const timeoutMs = Math.max(3000, Number(option("timeout", "20000")));
const siteOrigin = new URL(siteUrl).origin;

function decode(value = "") {
  return String(value).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return decode(match?.[1] || match?.[2] || match?.[3] || "");
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map((match) => match[0]);
}

function xmlLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
}

function requestUrl(canonicalUrl) {
  const original = new URL(canonicalUrl);
  if (original.origin !== siteOrigin) return original.toString();
  return new URL(`${original.pathname}${original.search}`, targetOrigin).toString();
}

async function get(url) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(requestUrl(url), {
        redirect: "manual",
        headers: { "User-Agent": "Cowinmagnet-GSC-SEO-Audit/1.0" },
        signal: AbortSignal.timeout(timeoutMs)
      });
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        await response.body?.cancel();
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
        continue;
      }
      return { response, body: response.status === 200 ? await response.text() : "" };
    } catch (error) {
      if (attempt === 2) return { error: String(error?.message || error) };
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  return { error: "request-failed" };
}

async function sitemapUrls(url, seen = new Set()) {
  if (seen.has(url)) return [];
  seen.add(url);
  const result = await get(url);
  if (!result.response?.ok) throw new Error(`Cannot read sitemap ${url}: ${result.error || result.response?.status}`);
  const locations = xmlLocations(result.body);
  if (!/<sitemapindex\b/i.test(result.body)) return locations;
  const children = await Promise.all(locations.map((child) => sitemapUrls(child, seen)));
  return children.flat();
}

function normalizeInternal(href, baseUrl) {
  try {
    const parsed = new URL(href, baseUrl);
    if (parsed.origin !== siteOrigin || !/^https?:$/.test(parsed.protocol)) return "";
    if (/^\/(?:api|admin|_next|assets|images)\b/.test(parsed.pathname) || /\.[a-z0-9]{2,6}$/i.test(parsed.pathname)) return "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, parsed.pathname === "/" ? "/" : "");
  } catch {
    return "";
  }
}

function inspectHtml(html, url) {
  const meta = tags(html, "meta");
  const links = tags(html, "link");
  const canonicalTags = links.filter((tag) => attribute(tag, "rel").toLowerCase() === "canonical");
  const robotsTags = meta.filter((tag) => /^(robots|googlebot)$/i.test(attribute(tag, "name")));
  const description = meta.find((tag) => attribute(tag, "name").toLowerCase() === "description");
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "").replace(/<[^>]+>/g, "");
  const jsonLdScripts = [...html.matchAll(/<script\b(?=[^>]*type=["']application\/ld\+json["'])[^>]*>([\s\S]*?)<\/script>/gi)];
  const schemaTypes = [];
  let jsonLdErrors = 0;
  let productSnippetMissing = false;
  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script[1]);
      const nodes = Array.isArray(data) ? data : Array.isArray(data?.["@graph"]) ? data["@graph"] : [data];
      for (const node of nodes) {
        const type = Array.isArray(node?.["@type"]) ? node["@type"].join("|") : String(node?.["@type"] || "unknown");
        schemaTypes.push(type);
        if (type.split("|").includes("Product") && !node.offers && !node.review && !node.aggregateRating) productSnippetMissing = true;
      }
    } catch { jsonLdErrors += 1; }
  }
  const hrefs = tags(html, "a").map((tag) => normalizeInternal(attribute(tag, "href"), url)).filter(Boolean);
  return {
    title,
    description: attribute(description || "", "content"),
    canonical: attribute(canonicalTags[0] || "", "href"),
    canonicalCount: canonicalTags.length,
    robotsMeta: robotsTags.map((tag) => attribute(tag, "content")).filter(Boolean).join("; "),
    hreflangs: links.filter((tag) => attribute(tag, "rel").toLowerCase() === "alternate" && attribute(tag, "hreflang")).map((tag) => ({ language: attribute(tag, "hreflang"), href: attribute(tag, "href") })),
    schemaTypes,
    jsonLdErrors,
    productSnippetMissing,
    h1Count: (html.match(/<h1\b/gi) || []).length,
    hrefs
  };
}

function templateFor(url) {
  const p = new URL(url).pathname;
  if (p === "/") return "root-redirect";
  if (/^\/(en|es|ru|ar|fr|pt)$/.test(p)) return "home";
  if (/^\/(en|es|ru|ar|fr|pt)\/products\/[^/]+$/.test(p)) return "product-or-category";
  if (/^\/(en|es|ru|ar|fr|pt)\/industries\/[^/]+$/.test(p)) return "industry-detail";
  if (/^\/(en|es|ru|ar|fr|pt)\/(blog|news)\/[^/]+$/.test(p)) return "article";
  if (/^\/(en|es|ru|ar|fr|pt)\//.test(p)) return "public-page";
  return "legacy-or-other";
}

async function inspect(url, inSitemap, expected = "") {
  const result = await get(url);
  const response = result.response;
  const httpStatus = response?.status || 0;
  const html = httpStatus === 200 && /text\/html/i.test(response.headers.get("content-type") || "") ? inspectHtml(result.body, url) : null;
  const issues = [];
  if (inSitemap) {
    if (httpStatus !== 200) issues.push(`sitemap-status-${httpStatus}`);
    if (/noindex/i.test(`${html?.robotsMeta || ""}; ${response?.headers.get("x-robots-tag") || ""}`)) issues.push("sitemap-noindex");
    if (!html?.canonical) issues.push("missing-canonical");
    else if (html.canonical !== url) issues.push("canonical-mismatch");
    if (html?.canonicalCount > 1) issues.push("duplicate-canonical");
    if (!html?.title) issues.push("missing-title");
    if (!html?.description) issues.push("missing-description");
    if (html?.description.endsWith("...")) issues.push("truncated-meta-description");
    if (html?.h1Count !== 1) issues.push(`h1-count-${html?.h1Count ?? "unknown"}`);
  }
  if (html?.jsonLdErrors) issues.push("invalid-jsonld");
  if (html?.productSnippetMissing) issues.push("product-snippet-missing-offer-or-review");
  if (!inSitemap && expected === "linked" && httpStatus !== 200) issues.push(`linked-status-${httpStatus}`);
  if (!inSitemap && expected === "linked" && httpStatus === 200 && html?.canonical === url && !/noindex/i.test(`${html.robotsMeta}; ${response?.headers.get("x-robots-tag") || ""}`)) {
    issues.push("indexable-linked-url-not-in-sitemap");
  }
  const pathname = new URL(url).pathname;
  return {
    url,
    template: templateFor(url),
    http_status: httpStatus || "unknown",
    redirect_target: response?.headers.get("location") || "",
    canonical: html?.canonical || "unknown",
    robots_meta: html?.robotsMeta || "",
    robots_header: response?.headers.get("x-robots-tag") || "",
    in_sitemap: inSitemap,
    language: pathname.split("/")[1] || "unknown",
    structured_data_type: html?.schemaTypes.join("|") || "",
    issue: issues.join("|") || (expected ? `expected-${expected}` : ""),
    action: issues.length ? "review-or-fix" : "retain",
    status: issues.length ? "open" : "normal",
    title: html?.title || "",
    description: html?.description || "",
    h1_count: html?.h1Count ?? "unknown",
    hreflang_count: html?.hreflangs.length ?? 0,
    jsonld_errors: html?.jsonLdErrors ?? 0,
    links: html?.hrefs || [],
    request_error: result.error || ""
  };
}

const urls = [...new Set(await sitemapUrls(`${siteUrl}/sitemap.xml`))];
const queue = urls.map((url) => ({ url, inSitemap: true }));
const examples = [
  { url: `${siteUrl}/`, expected: "redirect" },
  { url: `${siteUrl}/es`, expected: "noindex" },
  { url: `${siteUrl}/search`, expected: "redirect" },
  { url: `${siteUrl}/en/search`, expected: "noindex" },
  { url: `${siteUrl}/applications`, expected: "redirect" },
  { url: `${siteUrl}/en/seo-audit-intentional-missing-page`, expected: "404" },
  { url: `https://cowinmagnet.com/`, expected: "redirect" },
  { url: `http://www.cowinmagnet.com/`, expected: "redirect" }
];
for (const example of examples) if (!urls.includes(example.url)) queue.push({ ...example, inSitemap: false });

const rows = [];
async function worker() {
  while (queue.length) {
    const next = queue.shift();
    if (next) rows.push(await inspect(next.url, next.inSitemap, next.expected));
  }
}
await Promise.all(Array.from({ length: concurrency }, () => worker()));
const internalLinks = [...new Set(rows.flatMap((row) => row.links))].sort();
const sitemapSet = new Set(urls);
const linkedNotInSitemap = internalLinks.filter((url) => !sitemapSet.has(url));
const linkedSamples = linkedNotInSitemap.filter((url) => new URL(url).pathname.startsWith("/en/"));
for (const locale of ["es", "ru", "ar", "fr", "pt"]) {
  const samples = linkedNotInSitemap.filter((url) => new URL(url).pathname.startsWith(`/${locale}`));
  const byTemplate = new Map();
  for (const url of samples) {
    const template = templateFor(url);
    if (!byTemplate.has(template)) byTemplate.set(template, url);
  }
  linkedSamples.push(...byTemplate.values());
}
const linkedQueue = [...new Set(linkedSamples)].filter((url) => !rows.some((row) => row.url === url));
async function linkedWorker() {
  while (linkedQueue.length) {
    const url = linkedQueue.shift();
    if (url) rows.push(await inspect(url, false, "linked"));
  }
}
await Promise.all(Array.from({ length: concurrency }, () => linkedWorker()));
rows.sort((a, b) => a.url.localeCompare(b.url));
const issueCounts = rows.flatMap((row) => row.issue.split("|").filter((issue) => issue && !issue.startsWith("expected-"))).reduce((counts, issue) => {
  counts[issue] = (counts[issue] || 0) + 1;
  return counts;
}, {});
const summary = {
  generatedAt: new Date().toISOString(),
  phase,
  siteUrl,
  targetOrigin,
  sitemapUrlCount: urls.length,
  checkedUrlCount: rows.length,
  issueCounts,
  linkedNotInSitemap,
  rows: rows.map(({ links, ...row }) => row)
};

const columns = ["url", "template", "http_status", "redirect_target", "canonical", "robots_meta", "robots_header", "in_sitemap", "language", "structured_data_type", "issue", "action", "status", "title", "description", "h1_count", "hreflang_count", "jsonld_errors", "request_error"];
const csvCell = (value) => `"${String(value ?? "").replaceAll('"', '""').replaceAll(/\r?\n/g, " ")}"`;
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, `${phase}.json`), `${JSON.stringify(summary, null, 2)}\n`);
const csv = `${[columns.join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n")}\n`;
await fs.writeFile(path.join(outputDir, `${phase}.csv`), csv);
if (phase === "after") await fs.writeFile(path.join(outputDir, "GSC_SEO_URL_检查结果.csv"), csv);
console.log(JSON.stringify({ phase, sitemapUrlCount: urls.length, checkedUrlCount: rows.length, issueCounts, linkedNotInSitemap: linkedNotInSitemap.slice(0, 30) }, null, 2));
if (Object.keys(issueCounts).length) process.exitCode = 1;
