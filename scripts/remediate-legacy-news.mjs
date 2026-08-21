import crypto from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { saveCmsItem } from "../lib/cmsStore.js";
import { recordNewsAuditEvent } from "../lib/newsAutomationStore.js";
import { createLegacyNewsRemediation } from "../lib/legacyNewsRemediation.js";

const apply = process.argv.includes("--apply");
const { Pool } = pg;
const root = process.cwd();
const now = new Date().toISOString();
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

function csv(value = "") { return `"${String(value ?? "").replaceAll('"', '""')}"`; }
function target(row) { return row.payload?.editorialStatus === "needs-review-auto-news" && row.payload?.seoIndexable === false; }

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 });
try {
  const { rows } = await pool.query("SELECT id, slug, payload, published_at, created_at, updated_at FROM cms_items WHERE type='news' ORDER BY published_at DESC, created_at DESC");
  const selected = rows.filter(target).map((row) => ({ ...row.payload, id: row.id, slug: row.slug, publishedAt: row.payload?.publishedAt || row.published_at?.toISOString(), createdAt: row.payload?.createdAt || row.created_at?.toISOString(), updatedAt: row.payload?.updatedAt || row.updated_at?.toISOString() }));
  const reportDir = path.join(root, "docs", "content-remediation");
  const backupDir = path.join(root, ".backups", `legacy-news-remediation-${now.replaceAll(":", "-").replaceAll(".", "-")}`);
  await Promise.all([mkdir(reportDir, { recursive: true }), mkdir(backupDir, { recursive: true })]);
  await writeFile(path.join(backupDir, "cms-news-before.json"), JSON.stringify(selected, null, 2));
  const report = [];
  for (const post of selected) {
    const remediation = createLegacyNewsRemediation(post);
    if (!remediation.validation.passed) throw new Error(`${post.slug}: ${remediation.validation.errors.join(",")}`);
    report.push({ slug: post.slug, publishedAtBefore: post.publishedAt, publishedAtAfter: remediation.document.publishedAt, action: remediation.sourceDirectlyRelevant ? "rewritten-and-indexable" : "rewritten-noindex-source-gap", title: remediation.document.title, validation: "passed" });
    if (!apply) continue;
    const indexable = remediation.sourceDirectlyRelevant;
    await saveCmsItem({
      ...post,
      title: remediation.document.title,
      h1: remediation.document.title,
      excerpt: remediation.document.summary,
      seoTitle: remediation.document.seo.metaTitle,
      seoDescription: remediation.document.seo.metaDescription,
      contentType: "technical-guide",
      category: "technical-guide",
      categoryTitle: "Technical Guide",
      articleDocument: remediation.document,
      sourceUrl: undefined,
      sourcePublisher: undefined,
      sourcePublishedAt: undefined,
      sources: undefined,
      faqs: remediation.document.faq,
      content: undefined,
      sections: undefined,
      newsTriage: undefined,
      seoIndexable: indexable,
      editorialStatus: indexable ? "remediated-validated" : "remediated-noindex-source-gap",
      relevanceStatus: indexable ? "remediated-direct-scope" : "remediated-guide-source-gap",
      showInNewsList: true,
      status: "published",
      // The historical date is copied verbatim: list order and public date stay stable.
      publishedAt: post.publishedAt
    });
    await recordNewsAuditEvent({ siteId: post.siteId || "cowinmagnet-production", eventType: "legacy_news_remediated", entityType: "news_article", entityId: post.id, details: { slug: post.slug, indexable, publishedAtPreserved: post.publishedAt === remediation.document.publishedAt, backup: path.relative(root, backupDir).replaceAll("\\", "/") } });
  }
  const reportBase = apply ? "legacy-news-remediation" : "legacy-news-remediation-dry-run";
  const body = ["slug,published_at_before,published_at_after,action,title,validation", ...report.map((row) => [row.slug, row.publishedAtBefore, row.publishedAtAfter, row.action, row.title, row.validation].map(csv).join(","))].join("\n") + "\n";
  await writeFile(path.join(reportDir, `${reportBase}.csv`), body);
  const summary = { mode: apply ? "applied" : "dry-run", selected: selected.length, indexableAfterRewrite: report.filter((row) => row.action === "rewritten-and-indexable").length, retainedNoindexForSourceGap: report.filter((row) => row.action === "rewritten-noindex-source-gap").length, publishedAtPreserved: report.every((row) => row.publishedAtBefore === row.publishedAtAfter), backup: path.relative(root, backupDir).replaceAll("\\", "/"), report: `docs/content-remediation/${reportBase}.csv`, checksum: crypto.createHash("sha256").update(JSON.stringify(selected.map((item) => [item.id, item.publishedAt]))).digest("hex") };
  await writeFile(path.join(reportDir, `${reportBase}.md`), `# Legacy News Remediation\n\nGenerated: ${now}\n\n- Mode: ${summary.mode}\n- Records selected: ${summary.selected}\n- Rewritten and indexable: ${summary.indexableAfterRewrite}\n- Rewritten but retained as noindex due to an unrelated or absent source: ${summary.retainedNoindexForSourceGap}\n- Every published date preserved: ${summary.publishedAtPreserved}\n- Backup: ${summary.backup}\n\nThe remediation replaces leaked template copy with structured, non-numeric technical guidance. It does not reuse unrelated source claims or change URLs, publication dates or ordering.\n`);
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await pool.end();
}
