import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const apply = process.argv.includes("--apply");
const { Pool } = pg;
const now = new Date().toISOString();
const root = process.cwd();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1 });
try {
  const { rows } = await pool.query(
    `SELECT id, slug, published_at, payload
     FROM cms_items
     WHERE type = 'news'
       AND payload->>'editorialStatus' = 'remediated-noindex-source-gap'
       AND COALESCE((payload->>'seoIndexable')::boolean, TRUE) = FALSE
     ORDER BY published_at DESC, created_at DESC`
  );
  const reportDir = path.join(root, "docs", "content-remediation");
  const backupDir = path.join(root, ".backups", `news-list-visibility-${now.replaceAll(":", "-").replaceAll(".", "-")}`);
  await Promise.all([mkdir(reportDir, { recursive: true }), mkdir(backupDir, { recursive: true })]);
  await writeFile(path.join(backupDir, "cms-news-before.json"), JSON.stringify(rows, null, 2));

  if (apply && rows.length) {
    await pool.query(
      `UPDATE cms_items
       SET payload = jsonb_set(payload, '{showInNewsList}', 'true'::jsonb, true),
           updated_at = NOW()
       WHERE type = 'news'
         AND payload->>'editorialStatus' = 'remediated-noindex-source-gap'
         AND COALESCE((payload->>'seoIndexable')::boolean, TRUE) = FALSE`
    );
  }

  const report = [
    "# Remediated News List Visibility",
    "",
    `Generated: ${now}`,
    `Mode: ${apply ? "applied" : "dry-run"}`,
    `Records: ${rows.length}`,
    "Public dates and database ordering were not changed.",
    "Records remain noindex, follow and are not eligible for the News sitemap."
  ].join("\n") + "\n";
  await writeFile(path.join(reportDir, "remediated-news-list-visibility.md"), report);
  console.log(JSON.stringify({ mode: apply ? "applied" : "dry-run", restoredToNewsList: rows.length, publishedAtChanged: false, backup: path.relative(root, backupDir).replaceAll("\\", "/") }, null, 2));
} finally {
  await pool.end();
}
