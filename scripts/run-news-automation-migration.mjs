import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

const { Client } = pg;
const migrationPath = path.join(process.cwd(), "db", "migrations", "20260811_news_12h_48h_multisite.sql");
const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15000 });

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the News automation migration.");

try {
  const sql = await fs.readFile(migrationPath, "utf8");
  await client.connect();
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("NEWS_AUTOMATION_MIGRATION=applied");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await client.end().catch(() => {});
}
