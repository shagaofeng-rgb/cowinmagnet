import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the daily News source catalog migration.");

const { Client } = pg;
const migrationPath = path.join(process.cwd(), "db", "migrations", "20260820_news_daily_source_catalog.sql");
const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15_000 });

try {
  const sql = await fs.readFile(migrationPath, "utf8");
  await client.connect();
  await client.query("BEGIN");
  await client.query(sql);
  await client.query("COMMIT");
  console.log("NEWS_DAILY_SOURCE_CATALOG_MIGRATION=applied");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await client.end().catch(() => {});
}
