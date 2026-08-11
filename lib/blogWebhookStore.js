import crypto from "node:crypto";
import pg from "pg";
import { databasePoolMax, databaseSsl, databaseUrl, withDatabaseRetry } from "./databaseUrl.js";

const { Pool } = pg;
const MAX_ATTEMPTS = 3;
let pool;
let schemaPromise;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: Math.min(3, databasePoolMax()),
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
      statement_timeout: 15000,
      query_timeout: 15000
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db) throw new Error("Blog webhook requires DATABASE_URL");
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS blog_webhook_jobs (
          fingerprint TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          slug TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          attempts INTEGER NOT NULL DEFAULT 0,
          max_attempts INTEGER NOT NULL DEFAULT ${MAX_ATTEMPTS},
          source_ip_hash TEXT,
          last_error TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          completed_at TIMESTAMPTZ,
          next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.query("CREATE INDEX IF NOT EXISTS blog_webhook_jobs_due_idx ON blog_webhook_jobs (status, next_attempt_at)");
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

export function hashClientIp(ip = "") {
  return crypto.createHash("sha256").update(String(ip)).digest("hex").slice(0, 24);
}

export async function enqueueBlogWebhookJob({ fingerprint, payload, sourceIpHash }) {
  const db = getPool();
  await ensureSchema();
  const result = await withDatabaseRetry(
    () => db.query(
      `
        INSERT INTO blog_webhook_jobs (fingerprint, payload, slug, status, source_ip_hash, next_attempt_at)
        VALUES ($1, $2, $3, 'pending', $4, NOW())
        ON CONFLICT (fingerprint) DO UPDATE SET
          payload = CASE WHEN blog_webhook_jobs.status = 'published' THEN blog_webhook_jobs.payload ELSE EXCLUDED.payload END,
          slug = CASE WHEN blog_webhook_jobs.status = 'published' THEN blog_webhook_jobs.slug ELSE EXCLUDED.slug END,
          source_ip_hash = COALESCE(blog_webhook_jobs.source_ip_hash, EXCLUDED.source_ip_hash),
          updated_at = NOW()
        RETURNING fingerprint, status, attempts, max_attempts, slug, last_error, created_at, updated_at, completed_at
      `,
      [fingerprint, payload, payload.slug, sourceIpHash]
    ),
    { attempts: 2, delayMs: 120 }
  );
  return result.rows[0];
}

export async function markBlogWebhookJobPublished(fingerprint, slug) {
  const db = getPool();
  await ensureSchema();
  await db.query(
    `UPDATE blog_webhook_jobs
     SET status = 'published', slug = $2, completed_at = NOW(), updated_at = NOW(), last_error = NULL
     WHERE fingerprint = $1`,
    [fingerprint, slug]
  );
}

export async function markBlogWebhookJobFailed(fingerprint, error) {
  const db = getPool();
  await ensureSchema();
  const message = String(error?.message || error || "Publication failed").slice(0, 1000);
  await db.query(
    `UPDATE blog_webhook_jobs
     SET attempts = attempts + 1,
         status = CASE WHEN attempts + 1 >= max_attempts THEN 'failed' ELSE 'retry' END,
         last_error = $2,
         next_attempt_at = CASE
           WHEN attempts + 1 >= max_attempts THEN next_attempt_at
           ELSE NOW() + (INTERVAL '1 minute' * POWER(5, attempts))
         END,
         updated_at = NOW()
     WHERE fingerprint = $1`,
    [fingerprint, message]
  );
}

export async function claimDueBlogWebhookJobs(limit = 10) {
  const db = getPool();
  await ensureSchema();
  const result = await db.query(
    `
      WITH due AS (
        SELECT fingerprint
        FROM blog_webhook_jobs
        WHERE status IN ('pending', 'retry')
          AND attempts < max_attempts
          AND next_attempt_at <= NOW()
        ORDER BY created_at ASC
        LIMIT $1
        FOR UPDATE SKIP LOCKED
      )
      UPDATE blog_webhook_jobs job
      SET status = 'processing', updated_at = NOW()
      FROM due
      WHERE job.fingerprint = due.fingerprint
      RETURNING job.fingerprint, job.payload, job.attempts, job.max_attempts
    `,
    [Math.max(1, Math.min(Number(limit) || 10, 20))]
  );
  return result.rows;
}

export async function getBlogWebhookJob(fingerprint) {
  const db = getPool();
  await ensureSchema();
  const result = await db.query(
    "SELECT fingerprint, status, attempts, max_attempts, slug, last_error, created_at, updated_at, completed_at FROM blog_webhook_jobs WHERE fingerprint = $1",
    [fingerprint]
  );
  return result.rows[0] || null;
}

export async function getLegacyExternalBlogDrafts(limit = 10) {
  const db = getPool();
  await ensureSchema();
  const result = await db.query(
    `
      SELECT payload
      FROM cms_items
      WHERE type = 'blog'
        AND COALESCE(payload->>'status', 'published') = 'draft'
        AND payload->>'contentOrigin' = 'external-webhook'
      ORDER BY updated_at ASC
      LIMIT $1
    `,
    [Math.max(1, Math.min(Number(limit) || 10, 20))]
  );
  return result.rows.map((row) => row.payload).filter((item) => item?.slug && item?.title && item?.content);
}
