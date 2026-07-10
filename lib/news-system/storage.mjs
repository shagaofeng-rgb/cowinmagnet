import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { toMarkdown } from "./exporters.mjs";
import { databaseSsl, databaseUrl } from "../databaseUrl.js";

const { Pool } = pg;

const runtimeRoot = () => (process.env.VERCEL ? path.join("/tmp", "cowinmagnet-news-system") : process.cwd());
const root = () => path.join(runtimeRoot(), "data", "news-opportunities");
const generatedRoot = () => path.join(runtimeRoot(), "data", "news-generated");
const stateFile = () => path.join(runtimeRoot(), ".data", "news-system-state.json");
const lockFile = () => path.join(runtimeRoot(), ".data", "news-system.lock");
const NEWS_JOB_LOCK_ID = 52402001;
const NEWS_DB_CONNECTION_TIMEOUT_MS = Number(process.env.NEWS_DB_CONNECTION_TIMEOUT_MS || 5000);
const NEWS_DB_STATEMENT_TIMEOUT_MS = Number(process.env.NEWS_DB_STATEMENT_TIMEOUT_MS || 15000);
const NEWS_DB_QUERY_TIMEOUT_MS = Number(process.env.NEWS_DB_QUERY_TIMEOUT_MS || 15000);

let pool;
let schemaPromise;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: 3,
      connectionTimeoutMillis: NEWS_DB_CONNECTION_TIMEOUT_MS,
      idleTimeoutMillis: 10000,
      statement_timeout: NEWS_DB_STATEMENT_TIMEOUT_MS,
      query_timeout: NEWS_DB_QUERY_TIMEOUT_MS
    });
  }
  return pool;
}

async function ensureNewsSchema() {
  const db = getPool();
  if (!db) return;
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS news_automation_state (
          id TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.query(`
        CREATE TABLE IF NOT EXISTS news_job_runs (
          id TEXT PRIMARY KEY,
          run_date TEXT NOT NULL,
          job_type TEXT NOT NULL,
          status TEXT NOT NULL,
          started_at TIMESTAMPTZ NOT NULL,
          finished_at TIMESTAMPTZ,
          candidates_found INTEGER NOT NULL DEFAULT 0,
          candidates_verified INTEGER NOT NULL DEFAULT 0,
          articles_created INTEGER NOT NULL DEFAULT 0,
          articles_published INTEGER NOT NULL DEFAULT 0,
          articles_skipped INTEGER NOT NULL DEFAULT 0,
          articles_rejected INTEGER NOT NULL DEFAULT 0,
          error_message TEXT,
          request_id TEXT,
          payload JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.query("CREATE INDEX IF NOT EXISTS news_job_runs_date_idx ON news_job_runs (run_date DESC, started_at DESC)");
      await db.query("CREATE INDEX IF NOT EXISTS news_job_runs_status_idx ON news_job_runs (status)");
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

async function ensureRoot() {
  await fs.mkdir(root(), { recursive: true });
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export async function saveDailyRun(run) {
  await ensureRoot();
  const base = path.join(root(), run.date);
  await fs.writeFile(`${base}.json`, JSON.stringify(run, null, 2), "utf8");
  await fs.writeFile(`${base}.md`, toMarkdown(run), "utf8");

  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    const id = run.requestId || `${run.startedAt || new Date().toISOString()}-${run.action || "job"}`;
    await db.query(
      `
        INSERT INTO news_job_runs (
          id, run_date, job_type, status, started_at, finished_at,
          candidates_found, candidates_verified, articles_created, articles_published,
          articles_skipped, articles_rejected, error_message, request_id, payload
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          finished_at = EXCLUDED.finished_at,
          candidates_found = EXCLUDED.candidates_found,
          candidates_verified = EXCLUDED.candidates_verified,
          articles_created = EXCLUDED.articles_created,
          articles_published = EXCLUDED.articles_published,
          articles_skipped = EXCLUDED.articles_skipped,
          articles_rejected = EXCLUDED.articles_rejected,
          error_message = EXCLUDED.error_message,
          payload = EXCLUDED.payload
      `,
      [
        id,
        run.date,
        run.action || "job",
        run.status || "success",
        run.startedAt,
        run.finishedAt || run.generatedAt || new Date().toISOString(),
        Number(run.sourceCount || 0),
        Number(run.scoredCount || 0),
        Number(run.savedArticleCount || 0),
        Number(run.publishedCount || 0),
        Number(run.skippedCount || 0),
        Number(run.rejectedCount || 0),
        run.errorMessage || null,
        run.requestId || id,
        run
      ]
    );
  }

  return { jsonPath: `${base}.json`, markdownPath: `${base}.md` };
}

export async function saveGeneratedArticle(article) {
  await fs.mkdir(generatedRoot(), { recursive: true });
  const file = path.join(generatedRoot(), `${article.slug}.json`);
  await fs.writeFile(file, JSON.stringify(article, null, 2), "utf8");
  return file;
}

export async function listGeneratedArticles() {
  await fs.mkdir(generatedRoot(), { recursive: true });
  const files = await fs.readdir(generatedRoot());
  return files.filter((file) => file.endsWith(".json")).sort().reverse();
}

export async function readNewsState() {
  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    const result = await db.query("SELECT payload FROM news_automation_state WHERE id = $1", ["default"]);
    if (result.rows[0]?.payload) return result.rows[0].payload;
  }

  try {
    return JSON.parse(await fs.readFile(stateFile(), "utf8"));
  } catch {
    return {
      seenNews: { urls: {}, titles: {}, semantic: {}, images: {} },
      publishedSlugs: {},
      publishedTopics: [],
      sourceHistory: [],
      topicHistory: [],
      runs: [],
      updatedAt: null
    };
  }
}

export async function saveNewsState(state) {
  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    await db.query(
      `
        INSERT INTO news_automation_state (id, payload, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
      `,
      ["default", state]
    );
  }

  await fs.mkdir(path.dirname(stateFile()), { recursive: true });
  await fs.writeFile(stateFile(), JSON.stringify(state, null, 2), "utf8");
  return stateFile();
}

export async function readDailyRun(date) {
  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    const result = await db.query(
      "SELECT payload FROM news_job_runs WHERE run_date = $1 ORDER BY started_at DESC LIMIT 1",
      [date]
    );
    if (result.rows[0]?.payload) return result.rows[0].payload;
  }

  const file = path.join(root(), `${date}.json`);
  const content = await fs.readFile(file, "utf8");
  return JSON.parse(content);
}

export async function listDailyRuns() {
  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    const result = await db.query("SELECT run_date FROM news_job_runs ORDER BY started_at DESC LIMIT 60");
    return [...new Set(result.rows.map((row) => row.run_date))];
  }

  await ensureRoot();
  const files = await fs.readdir(root());
  return files
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(".json", ""))
    .sort()
    .reverse();
}

export async function listRecentJobRuns(limit = 20) {
  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    const result = await db.query(
      `
        SELECT payload
        FROM news_job_runs
        ORDER BY started_at DESC
        LIMIT $1
      `,
      [limit]
    );
    return result.rows.map((row) => row.payload);
  }

  const state = await readNewsState();
  return (state.runs || []).slice(0, limit);
}

export async function withNewsJobLock(callback, { ttlMs = 1000 * 60 * 20 } = {}) {
  const db = getPool();
  if (db) {
    await ensureNewsSchema();
    const client = await db.connect();
    try {
      const lock = await client.query("SELECT pg_try_advisory_lock($1) AS locked", [NEWS_JOB_LOCK_ID]);
      if (!lock.rows[0]?.locked) {
        return { locked: false, skippedDueToLock: true };
      }
      const value = await callback();
      return { locked: true, value };
    } finally {
      await client.query("SELECT pg_advisory_unlock($1)", [NEWS_JOB_LOCK_ID]).catch(() => {});
      client.release();
    }
  }

  await fs.mkdir(path.dirname(lockFile()), { recursive: true });
  try {
    const existing = JSON.parse(await fs.readFile(lockFile(), "utf8"));
    if (existing.expiresAt && new Date(existing.expiresAt).getTime() > Date.now()) {
      return { locked: false, skippedDueToLock: true };
    }
  } catch {}

  await fs.writeFile(lockFile(), JSON.stringify({ startedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + ttlMs).toISOString() }), {
    flag: "w"
  });

  try {
    const value = await callback();
    return { locked: true, value };
  } finally {
    await fs.rm(lockFile(), { force: true }).catch(() => {});
  }
}
