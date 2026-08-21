import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the News media evidence migration.");

const { Client } = pg;
const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 15000 });
const migration = path.join(process.cwd(), "db", "migrations", "20260821_news_media_evidence.sql");

try {
  await client.connect();
  await client.query(await fs.readFile(migration, "utf8"));
  console.log("NEWS_MEDIA_EVIDENCE_MIGRATION=applied");
} finally {
  await client.end().catch(() => {});
}
