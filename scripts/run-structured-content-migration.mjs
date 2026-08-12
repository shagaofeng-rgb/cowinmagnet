import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

const { Client } = pg;
const migrationPath = path.join(process.cwd(), "db", "migrations", "20260812_structured_article_documents.sql");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the structured content migration.");
const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  await client.query("BEGIN");
  await client.query(await fs.readFile(migrationPath, "utf8"));
  await client.query("COMMIT");
  console.log("STRUCTURED_CONTENT_MIGRATION=applied");
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally { await client.end().catch(() => {}); }
