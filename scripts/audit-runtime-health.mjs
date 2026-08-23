import nextEnv from "@next/env";
import pg from "pg";
import { databaseSsl } from "../lib/databaseUrl.js";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), false);

const requiredEnvironment = [
  "DATABASE_URL",
  "CRON_SECRET",
  "SMTP_HOST",
  "INQUIRY_TO_EMAIL",
  "ADMIN_SESSION_SECRET",
  "GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL",
  "NEWS_AUTO_PUBLISH"
];

const tables = ["inquiry_submissions", "analytics_events", "news_articles", "blog_webhook_jobs"];
const report = {
  checkedAt: new Date().toISOString(),
  environment: Object.fromEntries(requiredEnvironment.map((name) => [name, Boolean(process.env[name])])),
  database: { configured: Boolean(process.env.DATABASE_URL), reachable: false, tables: {}, counts: {} }
};

if (process.env.DATABASE_URL) {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: databaseSsl(),
    max: 1,
    connectionTimeoutMillis: 8000,
    statement_timeout: 12000,
    query_timeout: 12000
  });

  try {
    const registration = await pool.query(
      `SELECT ${tables.map((table) => `to_regclass('public.${table}') AS ${table}`).join(", ")}`
    );
    report.database.reachable = true;
    report.database.tables = registration.rows[0] || {};

    for (const table of tables) {
      if (!report.database.tables[table]) {
        report.database.counts[table] = "unavailable";
        continue;
      }
      const result = await pool.query(`SELECT COUNT(*)::INTEGER AS count FROM ${table}`);
      report.database.counts[table] = Number(result.rows[0]?.count || 0);
    }
  } catch (error) {
    report.database.error = error?.code || error?.name || "database_error";
  } finally {
    await pool.end().catch(() => {});
  }
}

console.log(JSON.stringify(report));

if (report.database.configured && !report.database.reachable) process.exitCode = 1;
