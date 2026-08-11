import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databasePoolMax, databaseSsl, databaseUrl, withDatabaseRetry } from "../databaseUrl.js";

const { Pool } = pg;
const DATA_DIR = process.env.SITEMAP_DATA_DIR || (process.env.VERCEL ? path.join("/tmp", "cowinmagnet-sitemap") : path.join(process.cwd(), ".data", "sitemap"));
const SNAPSHOT_FILE = path.join(DATA_DIR, "current.json");
const DIRTY_FILE = path.join(DATA_DIR, "dirty.json");
const LOCK_FILE = path.join(DATA_DIR, "generation.lock");
const SITEMAP_JOB_LOCK_ID = 52403000;
const CONNECTION_TIMEOUT_MS = Number(process.env.SITEMAP_DB_CONNECTION_TIMEOUT_MS || 5000);
const QUERY_TIMEOUT_MS = Number(process.env.SITEMAP_DB_QUERY_TIMEOUT_MS || 15000);

let pool;
let schemaPromise;

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!hasDatabase()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: databasePoolMax(2),
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MS,
      idleTimeoutMillis: 10_000,
      statement_timeout: QUERY_TIMEOUT_MS,
      query_timeout: QUERY_TIMEOUT_MS
    });
  }
  return pool;
}

function retryDatabase(operation) {
  return withDatabaseRetry(operation, { attempts: 3, delayMs: 450 });
}

async function ensureSchema() {
  const db = getPool();
  if (!db) return;
  if (!schemaPromise) {
    schemaPromise = retryDatabase(async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS sitemap_snapshots (
          id TEXT PRIMARY KEY,
          manifest_hash TEXT NOT NULL,
          generated_at TIMESTAMPTZ NOT NULL,
          url_count INTEGER NOT NULL DEFAULT 0,
          file_count INTEGER NOT NULL DEFAULT 0,
          payload JSONB NOT NULL,
          is_current BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.query("CREATE UNIQUE INDEX IF NOT EXISTS sitemap_snapshots_current_idx ON sitemap_snapshots (is_current) WHERE is_current = TRUE");
      await db.query("CREATE INDEX IF NOT EXISTS sitemap_snapshots_created_idx ON sitemap_snapshots (created_at DESC)");
      await db.query(`
        CREATE TABLE IF NOT EXISTS sitemap_control (
          id TEXT PRIMARY KEY,
          dirty_at TIMESTAMPTZ,
          dirty_reason JSONB NOT NULL DEFAULT '{}'::jsonb,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.query("INSERT INTO sitemap_control (id) VALUES ('default') ON CONFLICT (id) DO NOTHING");
    }).catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

export async function atomicWriteJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  const serialized = JSON.stringify(value, null, 2);
  await fs.writeFile(temporaryPath, serialized, "utf8");
  try {
    JSON.parse(await fs.readFile(temporaryPath, "utf8"));
    await fs.rename(temporaryPath, filePath);
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

export async function markSitemapDirty(reason = {}) {
  const dirtyAt = new Date().toISOString();
  const sanitizedReason = {
    type: String(reason.type || "content").slice(0, 60),
    slug: String(reason.slug || "").slice(0, 160),
    action: String(reason.action || "update").slice(0, 60)
  };
  const db = getPool();
  if (db) {
    await ensureSchema();
    await retryDatabase(() => db.query(
      `
        INSERT INTO sitemap_control (id, dirty_at, dirty_reason, updated_at)
        VALUES ('default', $1::TIMESTAMPTZ, $2::jsonb, NOW())
        ON CONFLICT (id) DO UPDATE SET
          dirty_at = EXCLUDED.dirty_at,
          dirty_reason = EXCLUDED.dirty_reason,
          updated_at = NOW()
      `,
      [dirtyAt, JSON.stringify(sanitizedReason)]
    ));
    return { dirtyAt, storageMode: "database" };
  }

  await atomicWriteJson(DIRTY_FILE, { dirtyAt, reason: sanitizedReason });
  return { dirtyAt, storageMode: "file" };
}

export async function getCurrentSitemapState() {
  const db = getPool();
  if (db) {
    await ensureSchema();
    const [snapshotResult, controlResult] = await Promise.all([
      retryDatabase(() => db.query("SELECT payload FROM sitemap_snapshots WHERE is_current = TRUE ORDER BY created_at DESC LIMIT 1")),
      retryDatabase(() => db.query("SELECT dirty_at, dirty_reason FROM sitemap_control WHERE id = 'default'"))
    ]);
    return {
      snapshot: snapshotResult.rows[0]?.payload || null,
      dirtyAt: controlResult.rows[0]?.dirty_at?.toISOString?.() || controlResult.rows[0]?.dirty_at || null,
      dirtyReason: controlResult.rows[0]?.dirty_reason || null,
      storageMode: "database"
    };
  }

  const [snapshot, dirty] = await Promise.all([readJson(SNAPSHOT_FILE), readJson(DIRTY_FILE)]);
  return { snapshot, dirtyAt: dirty?.dirtyAt || null, dirtyReason: dirty?.reason || null, storageMode: "file" };
}

export function isSitemapStateDirty(state) {
  if (!state?.snapshot) return true;
  if (!state.dirtyAt) return false;
  return new Date(state.dirtyAt).getTime() > new Date(state.snapshot.generatedAt || 0).getTime();
}

export async function saveCurrentSitemapSnapshot(snapshot) {
  const db = getPool();
  if (db) {
    await ensureSchema();
    const client = await retryDatabase(() => db.connect());
    try {
      await client.query("BEGIN");
      await client.query("UPDATE sitemap_snapshots SET is_current = FALSE WHERE is_current = TRUE");
      await client.query(
        `
          INSERT INTO sitemap_snapshots (id, manifest_hash, generated_at, url_count, file_count, payload, is_current)
          VALUES ($1, $2, $3::TIMESTAMPTZ, $4, $5, $6::jsonb, TRUE)
        `,
        [snapshot.id, snapshot.manifestHash, snapshot.generatedAt, snapshot.totalUrls, snapshot.files.length, JSON.stringify(snapshot)]
      );
      await client.query(
        "UPDATE sitemap_control SET dirty_at = NULL, dirty_reason = '{}'::jsonb, updated_at = NOW() WHERE id = 'default'"
      );
      await client.query("COMMIT");
      return { saved: true, storageMode: "database" };
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  }

  await atomicWriteJson(SNAPSHOT_FILE, snapshot);
  await fs.rm(DIRTY_FILE, { force: true }).catch(() => {});
  return { saved: true, storageMode: "file" };
}

async function acquireFileLock(ttlMs) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const handle = await fs.open(LOCK_FILE, "wx");
    await handle.writeFile(JSON.stringify({ expiresAt: new Date(Date.now() + ttlMs).toISOString() }), "utf8");
    await handle.close();
    return true;
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
    const existing = await readJson(LOCK_FILE);
    if (existing?.expiresAt && new Date(existing.expiresAt).getTime() > Date.now()) return false;
    await fs.rm(LOCK_FILE, { force: true });
    return acquireFileLock(ttlMs);
  }
}

export async function withSitemapGenerationLock(callback, { ttlMs = 10 * 60 * 1000 } = {}) {
  const db = getPool();
  if (db) {
    await ensureSchema();
    const client = await retryDatabase(() => db.connect());
    try {
      const result = await client.query("SELECT pg_try_advisory_lock($1) AS locked", [SITEMAP_JOB_LOCK_ID]);
      if (!result.rows[0]?.locked) return { locked: false, storageMode: "database" };
      try {
        return { locked: true, storageMode: "database", value: await callback() };
      } finally {
        await client.query("SELECT pg_advisory_unlock($1)", [SITEMAP_JOB_LOCK_ID]).catch(() => {});
      }
    } finally {
      client.release();
    }
  }

  const locked = await acquireFileLock(ttlMs);
  if (!locked) return { locked: false, storageMode: "file" };
  try {
    return { locked: true, storageMode: "file", value: await callback() };
  } finally {
    await fs.rm(LOCK_FILE, { force: true }).catch(() => {});
  }
}
