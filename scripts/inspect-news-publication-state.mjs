import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

const { Client } = pg;
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  const candidates = await client.query("SELECT status, rejection_reason, title, source_url, updated_at FROM news_candidates WHERE site_id=$1 ORDER BY updated_at DESC LIMIT 8", ["cowinmagnet-production"]);
  const runs = await client.query("SELECT status, error_summary, finished_at, started_at FROM news_publication_runs WHERE site_id=$1 AND run_type='daily-publish' ORDER BY started_at DESC LIMIT 5", ["cowinmagnet-production"]);
  const articles = await client.query("SELECT slug, status, published_at FROM generated_articles WHERE site_id=$1 ORDER BY updated_at DESC LIMIT 3", ["cowinmagnet-production"]);
  console.log(JSON.stringify({ candidates: candidates.rows, publishRuns: runs.rows, recentArticles: articles.rows }, null, 2));
} finally {
  await client.end().catch(() => {});
}
