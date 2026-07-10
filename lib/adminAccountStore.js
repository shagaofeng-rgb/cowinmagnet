import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "./databaseUrl.js";

const { Pool } = pg;

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-admin") : path.join(process.cwd(), ".data");
const ADMIN_FILE = path.join(DATA_DIR, "admin-auth.json");
const RESET_TTL_MS = 60 * 60 * 1000;
const HASH_PARAMS = { N: 16384, r: 8, p: 1, keylen: 64 };
const SCHEMA_LOCK_ID = 52401002;

let pool;
let schemaReady = false;
let schemaPromise;

function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!isDatabaseConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: 3,
      connectionTimeoutMillis: Number(process.env.ADMIN_DB_CONNECTION_TIMEOUT_MS || 5000),
      idleTimeoutMillis: 10000,
      statement_timeout: Number(process.env.ADMIN_DB_STATEMENT_TIMEOUT_MS || 12000),
      query_timeout: Number(process.env.ADMIN_DB_QUERY_TIMEOUT_MS || 12000)
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db || schemaReady) return;
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    const existing = await db.query(`
      SELECT
        to_regclass('public.admin_accounts') IS NOT NULL
        AND to_regclass('public.admin_password_resets') IS NOT NULL AS ready
    `);
    if (existing.rows[0]?.ready) {
      schemaReady = true;
      return;
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const lock = await client.query("SELECT pg_try_advisory_xact_lock($1) AS locked", [SCHEMA_LOCK_ID]);
      if (!lock.rows[0]?.locked) {
        await client.query("ROLLBACK");
        throw new Error("Admin schema initialization is already in progress");
      }
      await client.query(`
      CREATE TABLE IF NOT EXISTS admin_accounts (
        email TEXT PRIMARY KEY,
        name TEXT,
        password_hash TEXT NOT NULL,
        must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

      await client.query(`
      CREATE TABLE IF NOT EXISTS admin_password_resets (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

      await client.query("CREATE INDEX IF NOT EXISTS admin_password_resets_token_idx ON admin_password_resets (token_hash)");
      await client.query("CREATE INDEX IF NOT EXISTS admin_password_resets_email_idx ON admin_password_resets (email)");
      await client.query("COMMIT");
      schemaReady = true;
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }
  })().catch((error) => {
    schemaPromise = null;
    throw error;
  });

  return schemaPromise;
}

async function readFileState() {
  try {
    const text = await fs.readFile(ADMIN_FILE, "utf8");
    const data = JSON.parse(text);
    return {
      accounts: Array.isArray(data.accounts) ? data.accounts : [],
      resets: Array.isArray(data.resets) ? data.resets : []
    };
  } catch {
    return { accounts: [], resets: [] };
  }
}

async function writeFileState(state) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ADMIN_FILE, JSON.stringify(state, null, 2), "utf8");
}

export function normalizeAdminEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function getConfiguredAdminEmail() {
  return normalizeAdminEmail(process.env.ADMIN_EMAIL || "davidsha@cowinmagnet.com");
}

export function isConfiguredAdminEmail(email) {
  return normalizeAdminEmail(email) === getConfiguredAdminEmail();
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const hash = crypto
    .scryptSync(String(password), salt, HASH_PARAMS.keylen, {
      N: HASH_PARAMS.N,
      r: HASH_PARAMS.r,
      p: HASH_PARAMS.p
    })
    .toString("base64url");
  return `scrypt$${HASH_PARAMS.N}$${HASH_PARAMS.r}$${HASH_PARAMS.p}$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash || !storedHash.startsWith("scrypt$")) return false;
  const [, n, r, p, salt, expected] = storedHash.split("$");
  if (!salt || !expected) return false;

  const actual = crypto
    .scryptSync(String(password), salt, Buffer.from(expected, "base64url").length, {
      N: Number(n),
      r: Number(r),
      p: Number(p)
    })
    .toString("base64url");

  return (
    actual.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  );
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createResetToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  return { token, tokenHash: tokenHash(token) };
}

export async function getStoredAdminAccount(email = getConfiguredAdminEmail()) {
  const normalizedEmail = normalizeAdminEmail(email);
  const db = getPool();

  if (db) {
    await ensureSchema();
    const result = await db.query("SELECT email, name, password_hash, must_change_password FROM admin_accounts WHERE email = $1", [
      normalizedEmail
    ]);
    return result.rows[0] || null;
  }

  const state = await readFileState();
  return state.accounts.find((account) => normalizeAdminEmail(account.email) === normalizedEmail) || null;
}

export async function upsertStoredAdminPassword({ email = getConfiguredAdminEmail(), name = process.env.ADMIN_NAME || "Administrator", password }) {
  const normalizedEmail = normalizeAdminEmail(email);
  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();
  const db = getPool();

  if (db) {
    await ensureSchema();
    await db.query(
      `
        INSERT INTO admin_accounts (email, name, password_hash, must_change_password, created_at, updated_at)
        VALUES ($1, $2, $3, false, NOW(), NOW())
        ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          must_change_password = false,
          updated_at = NOW()
      `,
      [normalizedEmail, name, passwordHash]
    );
    return { email: normalizedEmail, name, passwordHash };
  }

  const state = await readFileState();
  const nextAccounts = state.accounts.filter((account) => normalizeAdminEmail(account.email) !== normalizedEmail);
  nextAccounts.push({ email: normalizedEmail, name, passwordHash, mustChangePassword: false, createdAt: now, updatedAt: now });
  await writeFileState({ ...state, accounts: nextAccounts });
  return { email: normalizedEmail, name, passwordHash };
}

export async function verifyStoredAdminPassword(email, password) {
  const account = await getStoredAdminAccount(email);
  if (!account) return false;
  return verifyPassword(password, account.password_hash || account.passwordHash);
}

export async function createPasswordReset(email) {
  const normalizedEmail = normalizeAdminEmail(email);
  const { token, tokenHash: hashedToken } = createResetToken();
  const reset = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + RESET_TTL_MS).toISOString(),
    usedAt: null,
    createdAt: new Date().toISOString()
  };
  const db = getPool();

  if (db) {
    await ensureSchema();
    await db.query(
      `
        INSERT INTO admin_password_resets (id, email, token_hash, expires_at, used_at, created_at)
        VALUES ($1, $2, $3, $4, NULL, NOW())
      `,
      [reset.id, reset.email, reset.tokenHash, reset.expiresAt]
    );
    return { token, reset };
  }

  const state = await readFileState();
  const activeResets = state.resets.filter((item) => !item.usedAt && new Date(item.expiresAt).getTime() > Date.now());
  activeResets.push(reset);
  await writeFileState({ ...state, resets: activeResets });
  return { token, reset };
}

export async function consumePasswordResetToken(token) {
  const hashedToken = tokenHash(String(token || ""));
  const now = new Date();
  const db = getPool();

  if (db) {
    await ensureSchema();
    const result = await db.query(
      `
        SELECT id, email, expires_at, used_at
        FROM admin_password_resets
        WHERE token_hash = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [hashedToken]
    );
    const row = result.rows[0];
    if (!row || row.used_at || new Date(row.expires_at).getTime() <= now.getTime()) return null;

    await db.query("UPDATE admin_password_resets SET used_at = NOW() WHERE id = $1", [row.id]);
    return { id: row.id, email: row.email };
  }

  const state = await readFileState();
  const index = state.resets.findIndex((item) => item.tokenHash === hashedToken);
  const reset = index >= 0 ? state.resets[index] : null;
  if (!reset || reset.usedAt || new Date(reset.expiresAt).getTime() <= now.getTime()) return null;

  const nextResets = [...state.resets];
  nextResets[index] = { ...reset, usedAt: now.toISOString() };
  await writeFileState({ ...state, resets: nextResets });
  return { id: reset.id, email: reset.email };
}

export function passwordMeetsPolicy(password) {
  const value = String(password || "");
  return value.length >= 10 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
}

export function adminAccountStorageMode() {
  return isDatabaseConfigured() ? "database" : "local-file";
}
