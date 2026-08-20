import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { hasDirectCowinNewsScopeSignal } from "../lib/news/scopeGate.js";

const { Pool } = pg;
const apply = process.argv.includes("--apply");
const now = new Date().toISOString();
const root = process.cwd();
const markerPatterns = ["Why It Matters", "Industry Perspective", "Brand/Product Connection", "Buyer Questions", "Update Note", "SEO Meta", "CMS Publishing Checklist"];

function csv(value = "") {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function inspect(payload) {
  const document = payload.articleDocument || {};
  const visibleText = [payload.title, payload.excerpt, payload.content, document.title, document.summary, ...(document.sections || []).map((section) => `${section.heading} ${(section.blocks || []).map((block) => block.text || (block.items || []).join(" ")).join(" ")}`)].filter(Boolean).join(" ");
  const markerHits = markerPatterns.filter((marker) => visibleText.includes(marker));
  const automated = payload.contentOrigin === "news-automation" || payload.editorialStatus === "automatically-validated";
  const contentType = document.contentType || payload.contentType || "news";
  const sourceEntries = document.sources || [];
  const sourcePresent = Boolean(payload.sourceUrl || sourceEntries.some((source) => source?.url));
  // Do not let a generated product explanation make an unrelated source look relevant.
  // Source relevance is judged from the source's own title/summary metadata only.
  const sourceContext = [payload.sourceTitle, payload.sourceArticleTitle, payload.sourceSummary, ...sourceEntries.flatMap((source) => [source?.title, source?.relevanceNote])].filter(Boolean).join(" ");
  const inScope = hasDirectCowinNewsScopeSignal(sourceContext);
  const legacyTemplate = markerHits.length >= 2;
  const shouldHold = legacyTemplate || (automated && contentType === "news" && (!sourcePresent || !inScope));
  const reasons = [];
  if (!sourcePresent) reasons.push("source-missing");
  if (!inScope) reasons.push("source-outside-direct-industry-scope");
  if (legacyTemplate) reasons.push(`legacy-template-markers:${markerHits.join("|")}`);
  const alreadyHeld = payload.seoIndexable === false && payload.editorialStatus === "needs-review-auto-news";
  return {
    automated,
    contentType,
    sourcePresent,
    inScope,
    markerHits,
    decision: shouldHold ? (alreadyHeld ? "already-noindex-pending-review" : "noindex-pending-review") : "keep-or-review-manually",
    reason: reasons.join("; ") || "no-automatic-hold-rule-matched"
  };
}

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to triage published News.");

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
try {
  const { rows } = await pool.query("SELECT id, slug, payload, published_at, updated_at FROM cms_items WHERE type='news' ORDER BY published_at DESC NULLS LAST, created_at DESC");
  const assessed = rows.map((row) => ({ ...row, inspection: inspect(row.payload || {}) }));
  const reportDirectory = path.join(root, "docs", "audits");
  const backupDirectory = path.join(root, ".backups", `news-triage-${now.replaceAll(":", "-").replaceAll(".", "-")}`);
  await mkdir(reportDirectory, { recursive: true });
  await mkdir(backupDirectory, { recursive: true });
  await writeFile(path.join(backupDirectory, "cms-news-before.json"), JSON.stringify(rows.map((row) => ({ id: row.id, slug: row.slug, payload: row.payload, publishedAt: row.published_at, updatedAt: row.updated_at })), null, 2));

  const csvRows = ["slug,title,published_at,content_origin,content_type,source_present,direct_scope,decision,reason"];
  assessed.forEach(({ slug, payload, published_at, inspection }) => {
    csvRows.push([slug, payload?.title || "", published_at?.toISOString?.() || "", payload?.contentOrigin || "", inspection.contentType, inspection.sourcePresent, inspection.inScope, inspection.decision, inspection.reason].map(csv).join(","));
  });
  await writeFile(path.join(reportDirectory, "news-published-triage.csv"), `${csvRows.join("\n")}\n`);

  const hold = assessed.filter((row) => row.inspection.decision === "noindex-pending-review");
  if (apply && hold.length) {
    for (const row of hold) {
      const triage = { decision: row.inspection.decision, reason: row.inspection.reason, reviewedAt: now, rollbackBackup: path.relative(root, backupDirectory).replaceAll("\\", "/") };
      await pool.query(
        "UPDATE cms_items SET payload = payload || jsonb_build_object('seoIndexable', FALSE, 'editorialStatus', 'needs-review-auto-news', 'newsTriage', $2::jsonb), updated_at=NOW() WHERE id=$1",
        [row.id, JSON.stringify(triage)]
      );
    }
  }
  console.log(JSON.stringify({ mode: apply ? "applied" : "dry-run", inspected: assessed.length, heldForReview: hold.map((row) => ({ slug: row.slug, reason: row.inspection.reason })), report: "docs/audits/news-published-triage.csv", backup: path.relative(root, backupDirectory).replaceAll("\\", "/"), checksum: crypto.createHash("sha256").update(JSON.stringify(rows.map((row) => row.id))).digest("hex") }, null, 2));
} finally {
  await pool.end();
}
