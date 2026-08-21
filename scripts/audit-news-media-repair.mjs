import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

const { Client } = pg;
const now = new Date().toISOString();
const outputDirectory = path.join(process.cwd(), "docs", "audits");

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the News media audit.");

function csv(value = "") {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function words(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function isControlledImage(src = "") {
  const value = String(src || "").trim();
  if (value.startsWith("/") || value.startsWith("/api/")) return Boolean(value);
  try {
    return /(^|\.)cowinmagnet\.com$/i.test(new URL(value).hostname);
  } catch {
    return false;
  }
}

function inspect(row) {
  const payload = row.payload || {};
  const document = payload.articleDocument || {};
  const sources = Array.isArray(document.sources) ? document.sources : [];
  const sourceSummaries = sources.filter((source) => {
    const length = words(source?.editorialSummary);
    return length >= 60 && length <= 120;
  });
  const hero = document.heroImage?.assetId || payload.coverImage || "";
  const defects = [];
  if (!payload.relatedProducts?.length) defects.push("product-link-missing");
  if (!hero) defects.push("product-hero-missing");
  else if (!isControlledImage(hero)) defects.push("uncontrolled-or-external-hero");
  if (!sources.length) defects.push("citation-missing");
  if (!sourceSummaries.length) defects.push("source-summary-missing-or-invalid");
  if (sources.some((source) => !source?.url || !source?.publisher || !source?.title)) defects.push("citation-metadata-incomplete");
  if (document.contentType !== "news") defects.push("content-type-review-required");
  if (payload.status !== "published") defects.push("not-currently-published");
  const action = defects.length === 0 ? "keep" : (defects.includes("product-hero-missing") || defects.includes("citation-missing")) ? "needs-review" : "repair";
  return {
    id: row.id,
    slug: row.slug,
    url: `https://www.cowinmagnet.com/en/news/${row.slug}`,
    publishedAt: payload.publishedAt || row.published_at?.toISOString?.() || "",
    contentType: document.contentType || payload.contentType || "news",
    status: payload.status || "",
    productLinked: Boolean(payload.relatedProducts?.length),
    controlledHero: Boolean(hero) && isControlledImage(hero),
    citationCount: sources.length,
    sourceSummaryCount: sourceSummaries.length,
    action,
    defects: defects.join(";")
  };
}

const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  const { rows } = await client.query("SELECT id, slug, payload, published_at FROM cms_items WHERE type='news' ORDER BY published_at DESC, created_at DESC");
  const records = rows.map(inspect);
  await fs.mkdir(outputDirectory, { recursive: true });
  const headers = Object.keys(records[0] || { id: "" });
  const csvBody = `${headers.join(",")}\n${records.map((record) => headers.map((key) => csv(record[key])).join(",")).join("\n")}\n`;
  await fs.writeFile(path.join(outputDirectory, "cowinmagnet-news-media-repair-queue.csv"), csvBody, "utf8");
  const counts = Object.fromEntries(["keep", "repair", "needs-review"].map((action) => [action, records.filter((record) => record.action === action).length]));
  const report = `# CowinMagnet News media repair audit\n\nGenerated: ${now}\n\n- Published News records inspected: ${records.length}\n- Keep: ${counts.keep}\n- Repairable through the structured media/source pipeline: ${counts.repair}\n- Needs a real product/source decision before any automated change: ${counts["needs-review"]}\n\nClassification is non-destructive. Existing slugs, public dates, records and media are unchanged. A record is only eligible for an automatic repair when it has a controlled COWIN product image, a resolvable product relationship, and a valid source with an original 60 to 120 word editorial summary. Records lacking those facts remain in the review queue rather than being filled with guessed content.\n\nCSV: [cowinmagnet-news-media-repair-queue.csv](./cowinmagnet-news-media-repair-queue.csv)\n`;
  await fs.writeFile(path.join(outputDirectory, "cowinmagnet-news-media-repair-queue.md"), report, "utf8");
  console.log(JSON.stringify({ inspected: records.length, ...counts, output: "docs/audits/cowinmagnet-news-media-repair-queue.csv" }, null, 2));
} finally {
  await client.end().catch(() => {});
}
