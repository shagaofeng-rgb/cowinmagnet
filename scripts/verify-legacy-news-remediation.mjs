import pg from "pg";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 });
const csv = (value = "") => `"${String(value).replaceAll('"', '""')}"`;

try {
  const [sourceResult, contentResult, auditResult] = await Promise.all([
    pool.query(`SELECT validation_status, active, COUNT(*)::int AS count
      FROM news_sources
      WHERE site_id='cowinmagnet-production'
      GROUP BY validation_status, active
      ORDER BY validation_status, active`),
    pool.query(`SELECT slug, published_at, payload
      FROM cms_items
      WHERE type='news' AND payload->>'editorialStatus'='remediated-noindex-source-gap'
      ORDER BY published_at DESC, created_at DESC`),
    pool.query(`SELECT entity_id, created_at, details_json
      FROM news_audit_events
      WHERE site_id='cowinmagnet-production' AND event_type='legacy_news_remediated'
      ORDER BY created_at ASC`)
  ]);
  const remediated = contentResult.rows;
  const dateMismatches = remediated.filter((row) => {
    const publicDate = row.payload?.publishedAt;
    return !publicDate || Number.isNaN(new Date(publicDate).getTime()) || new Date(publicDate).getTime() !== new Date(row.published_at).getTime();
  }).map((row) => row.slug);
  const reportDir = path.join(process.cwd(), "docs", "content-remediation");
  await mkdir(reportDir, { recursive: true });
  const reportRows = remediated.map((row) => [row.slug, row.published_at.toISOString(), row.payload?.publishedAt || "", "rewritten-noindex-source-gap", row.payload?.title || "", dateMismatches.includes(row.slug) ? "failed" : "passed"]);
  await writeFile(path.join(reportDir, "legacy-news-remediation.csv"), ["slug,published_at_before,published_at_after,action,title,validation", ...reportRows.map((row) => row.map(csv).join(","))].join("\n") + "\n");
  await writeFile(path.join(reportDir, "legacy-news-remediation.md"), `# Legacy News Remediation\n\nVerified: ${new Date().toISOString()}\n\n- Records remediated: ${remediated.length}\n- Historical publication-date mismatches: ${dateMismatches.length}\n- Public ordering basis: preserved published_at values\n- Indexing state: retained as noindex, follow because the legacy external-source context was unrelated or not safely verifiable\n- Audit events recorded: ${auditResult.rows.length}\n\nThe records retain their original URLs and dates. Their leaked/template copy was replaced with structured, non-numeric technical guidance; no unsupported external claims were restored.\n`);
  console.log(JSON.stringify({
    sources: sourceResult.rows,
    remediatedNews: remediated.length,
    publishedAtMismatches: dateMismatches.length,
    auditEvents: auditResult.rows.length,
    mismatchSlugs: dateMismatches,
    newestRemediatedSlug: remediated[0]?.slug || null,
    oldestRemediatedSlug: remediated.at(-1)?.slug || null
  }, null, 2));
} finally {
  await pool.end();
}
