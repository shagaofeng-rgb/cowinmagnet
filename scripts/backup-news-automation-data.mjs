import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

const { Client } = pg;
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = path.join(process.cwd(), ".backups", `news-automation-${timestamp}`);
const tables = ["news_sources", "news_candidates", "generated_articles", "news_publication_runs", "cms_items"];
const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15000 });

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the News automation backup.");

try {
  await client.connect();
  await fs.mkdir(outputDir, { recursive: true });
  const summary = { createdAt: new Date().toISOString(), purpose: "Pre-migration News automation backup", tables: {} };
  for (const table of tables) {
    const result = await client.query(`SELECT * FROM ${table} ORDER BY 1`);
    await fs.writeFile(path.join(outputDir, `${table}.json`), `${JSON.stringify(result.rows, null, 2)}\n`, "utf8");
    summary.tables[table] = result.rowCount;
  }
  await fs.writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  console.log(`NEWS_AUTOMATION_BACKUP=${outputDir}`);
} finally {
  await client.end().catch(() => {});
}
