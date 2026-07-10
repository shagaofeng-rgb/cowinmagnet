import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "./databaseUrl.js";

const { Pool } = pg;

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-sync") : path.join(process.cwd(), ".data");
const STATUS_FILE = path.join(DATA_DIR, "sync-status.json");
const ANALYTICS_LOCK_ID = 52401030;

let pool;
let schemaReady = false;

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!hasDatabase()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: 2
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db || schemaReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS sync_job_runs (
      id BIGSERIAL PRIMARY KEY,
      job_name TEXT NOT NULL,
      status TEXT NOT NULL,
      started_at TIMESTAMPTZ NOT NULL,
      finished_at TIMESTAMPTZ,
      duration_ms INTEGER DEFAULT 0,
      processed_count INTEGER DEFAULT 0,
      failed_count INTEGER DEFAULT 0,
      skipped_count INTEGER DEFAULT 0,
      error_message TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await db.query("CREATE INDEX IF NOT EXISTS sync_job_runs_job_created_idx ON sync_job_runs (job_name, created_at DESC)");
  schemaReady = true;
}

async function readFileState() {
  try {
    return JSON.parse(await fs.readFile(STATUS_FILE, "utf8"));
  } catch {
    return { runs: [] };
  }
}

async function writeFileRun(run) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const state = await readFileState();
  state.runs = [run, ...(state.runs || [])].slice(0, 50);
  await fs.writeFile(STATUS_FILE, JSON.stringify(state, null, 2), "utf8");
}

export async function withSyncJobLock(jobName, callback) {
  const db = getPool();
  if (!db) return callback({ locked: true, storageMode: "file" });

  await ensureSchema();
  const client = await db.connect();
  try {
    const lockId = jobName === "analytics-sync" ? ANALYTICS_LOCK_ID : ANALYTICS_LOCK_ID + 1;
    const lock = await client.query("SELECT pg_try_advisory_lock($1) AS locked", [lockId]);
    if (!lock.rows[0]?.locked) {
      await recordSyncJobRun({
        jobName,
        status: "skipped_due_to_lock",
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        skippedCount: 1,
        metadata: { lockId }
      });
      return { locked: false, storageMode: "database" };
    }
    try {
      return await callback({ locked: true, storageMode: "database" });
    } finally {
      await client.query("SELECT pg_advisory_unlock($1)", [lockId]).catch(() => {});
    }
  } finally {
    client.release();
  }
}

export async function recordSyncJobRun(run) {
  const normalized = {
    jobName: run.jobName,
    status: run.status,
    startedAt: run.startedAt,
    finishedAt: run.finishedAt || new Date().toISOString(),
    durationMs: Number(run.durationMs || 0),
    processedCount: Number(run.processedCount || 0),
    failedCount: Number(run.failedCount || 0),
    skippedCount: Number(run.skippedCount || 0),
    errorMessage: run.errorMessage ? String(run.errorMessage).slice(0, 500) : "",
    metadata: run.metadata || {}
  };

  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query(
      `
        INSERT INTO sync_job_runs (
          job_name, status, started_at, finished_at, duration_ms,
          processed_count, failed_count, skipped_count, error_message, metadata
        )
        VALUES ($1, $2, $3::TIMESTAMPTZ, $4::TIMESTAMPTZ, $5, $6, $7, $8, $9, $10::jsonb)
      `,
      [
        normalized.jobName,
        normalized.status,
        normalized.startedAt,
        normalized.finishedAt,
        normalized.durationMs,
        normalized.processedCount,
        normalized.failedCount,
        normalized.skippedCount,
        normalized.errorMessage,
        JSON.stringify(normalized.metadata)
      ]
    );
    return { ok: true, storageMode: "database" };
  }

  await writeFileRun(normalized);
  return { ok: true, storageMode: "file" };
}

export async function getLatestSyncJobRuns(jobName = "analytics-sync", limit = 10) {
  const db = getPool();
  if (db) {
    await ensureSchema();
    const result = await db.query(
      `
        SELECT job_name, status, started_at, finished_at, duration_ms,
               processed_count, failed_count, skipped_count, error_message, metadata
        FROM sync_job_runs
        WHERE job_name = $1
        ORDER BY created_at DESC
        LIMIT $2
      `,
      [jobName, limit]
    );
    return result.rows.map((row) => ({
      jobName: row.job_name,
      status: row.status,
      startedAt: row.started_at,
      finishedAt: row.finished_at,
      durationMs: row.duration_ms,
      processedCount: row.processed_count,
      failedCount: row.failed_count,
      skippedCount: row.skipped_count,
      errorMessage: row.error_message,
      metadata: row.metadata || {}
    }));
  }

  const state = await readFileState();
  return (state.runs || []).filter((run) => run.jobName === jobName).slice(0, limit);
}

export async function getSyncStatus(jobName = "analytics-sync") {
  const runs = await getLatestSyncJobRuns(jobName, 10);
  const latest = runs[0] || null;
  const latestSuccess = runs.find((run) => run.status === "success") || null;
  const schedules = {
    "analytics-sync": "0 */3 * * *; also runs the news automation backup when the last news job is older than 3 hours",
    "blog-automation": "20 1 * * *; daily Blog automation at 09:20 Asia/Shanghai",
    "news-automation": "*/30 * * * *; every 30 minutes, with internal randomized daily slots and max 4 published posts per Asia/Shanghai day",
    "monthly-inquiry-test": "15 1 1 * *; monthly inquiry delivery test",
    "sitemap-maintenance": "35 2 * * *; daily Sitemap consistency check and optional Search Console submission"
  };
  return {
    jobName,
    schedule: schedules[jobName] || "manual or custom schedule",
    timezone: "UTC cron, displayed in Asia/Shanghai",
    latest,
    latestSuccess,
    runs
  };
}
