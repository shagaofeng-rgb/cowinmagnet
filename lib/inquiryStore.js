import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "./databaseUrl.js";

const { Pool } = pg;

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-inquiries") : path.join(process.cwd(), ".data");
const INQUIRY_FILE = path.join(DATA_DIR, "inquiry-submissions.json");
const SCHEMA_LOCK_ID = 52401003;
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

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
      connectionTimeoutMillis: Number(process.env.INQUIRY_DB_CONNECTION_TIMEOUT_MS || 5000),
      idleTimeoutMillis: 10000,
      statement_timeout: Number(process.env.INQUIRY_DB_STATEMENT_TIMEOUT_MS || 12000),
      query_timeout: Number(process.env.INQUIRY_DB_QUERY_TIMEOUT_MS || 12000)
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db || schemaReady) return;
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    const existing = await db.query("SELECT to_regclass('public.inquiry_submissions') IS NOT NULL AS ready");
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
        throw new Error("Inquiry schema initialization is already in progress");
      }
      await client.query(`
      CREATE TABLE IF NOT EXISTS inquiry_submissions (
        id TEXT PRIMARY KEY,
        form_type TEXT NOT NULL DEFAULT 'inquiry',
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        country TEXT,
        message TEXT,
        source_path TEXT,
        page_url TEXT,
        channel TEXT,
        utm JSONB NOT NULL DEFAULT '{}'::jsonb,
        attribution JSONB NOT NULL DEFAULT '{}'::jsonb,
        payload JSONB NOT NULL,
        ip TEXT,
        user_agent TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        owner TEXT,
        tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        internal_note TEXT,
        submitted_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_submitted_idx ON inquiry_submissions (submitted_at DESC)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_status_idx ON inquiry_submissions (status)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_email_idx ON inquiry_submissions (email)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_country_idx ON inquiry_submissions (country)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_source_idx ON inquiry_submissions (source_path)");
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

async function readFileItems() {
  try {
    const text = await fs.readFile(INQUIRY_FILE, "utf8");
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeFileItems(items) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(INQUIRY_FILE, JSON.stringify(items, null, 2), "utf8");
}

function inquiryId() {
  return `inq-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeStatus(value) {
  const status = String(value || "new").trim();
  return ["new", "pending", "contacted", "qualified", "quoted", "won", "lost", "spam", "archived"].includes(status)
    ? status
    : "new";
}

function normalizePageSize(value) {
  const pageSize = Number(value || DEFAULT_PAGE_SIZE);
  return PAGE_SIZE_OPTIONS.includes(pageSize) ? pageSize : DEFAULT_PAGE_SIZE;
}

function normalizePage(value) {
  return Math.max(1, Number(value || 1) || 1);
}

function rowToInquiry(row) {
  return {
    id: row.id,
    formType: row.form_type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    country: row.country,
    message: row.message,
    sourcePath: row.source_path,
    pageUrl: row.page_url,
    channel: row.channel,
    utm: row.utm || {},
    attribution: row.attribution || {},
    ip: row.ip,
    userAgent: row.user_agent,
    status: row.status,
    owner: row.owner,
    tags: row.tags || [],
    internalNote: row.internal_note,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function inquiryStorageMode() {
  return isDatabaseConfigured() ? "database" : "local-file";
}

export async function saveInquirySubmission(payload) {
  const now = payload.submittedAt || new Date().toISOString();
  const attribution = payload.attribution || {};
  const sessionTouch = attribution.sessionTouch || {};
  const utm = {
    raw: payload.utm || "",
    source: payload.utmSource || sessionTouch.source || "",
    medium: payload.utmMedium || sessionTouch.medium || "",
    campaign: payload.utmCampaign || sessionTouch.campaign || "",
    content: payload.utmContent || "",
    term: payload.utmTerm || ""
  };
  const normalized = {
    id: payload.inquiryId || inquiryId(),
    formType: payload.formType || "inquiry",
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim().toLowerCase(),
    phone: String(payload.phone || "").trim(),
    company: String(payload.company || "").trim(),
    country: String(payload.country || "").trim(),
    message: String(payload.message || "").trim(),
    sourcePath: String(payload.sourcePath || "").trim(),
    pageUrl: String(payload.pageUrl || payload.sourcePath || "").trim(),
    channel: String(sessionTouch.medium || payload.channel || "").trim(),
    utm,
    attribution,
    ip: String(payload.clientIp || "").trim(),
    userAgent: String(payload.userAgent || "").trim(),
    status: normalizeStatus(payload.status),
    owner: "",
    tags: [],
    internalNote: "",
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
    payload
  };

  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query(
      `
        INSERT INTO inquiry_submissions (
          id, form_type, name, email, phone, company, country, message,
          source_path, page_url, channel, utm, attribution, payload, ip,
          user_agent, status, owner, tags, internal_note, submitted_at, created_at, updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
        ON CONFLICT (id) DO NOTHING
      `,
      [
        normalized.id,
        normalized.formType,
        normalized.name,
        normalized.email,
        normalized.phone,
        normalized.company,
        normalized.country,
        normalized.message,
        normalized.sourcePath,
        normalized.pageUrl,
        normalized.channel,
        normalized.utm,
        normalized.attribution,
        normalized.payload,
        normalized.ip,
        normalized.userAgent,
        normalized.status,
        normalized.owner,
        normalized.tags,
        normalized.internalNote,
        normalized.submittedAt,
        normalized.createdAt,
        normalized.updatedAt
      ]
    );
    return normalized;
  }

  const items = await readFileItems();
  items.unshift(normalized);
  await writeFileItems(items);
  return normalized;
}

export async function listInquirySubmissions({ q = "", status = "all", country = "all", page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
  const safePage = normalizePage(page);
  const safePageSize = normalizePageSize(pageSize);
  const normalizedStatus = status === "all" ? "all" : normalizeStatus(status);
  const keyword = String(q || "").trim();
  const countryFilter = String(country || "all").trim();

  const db = getPool();
  if (db) {
    await ensureSchema();
    const where = [];
    const params = [];

    if (keyword) {
      params.push(`%${keyword}%`);
      where.push(`(
        name ILIKE $${params.length}
        OR email ILIKE $${params.length}
        OR phone ILIKE $${params.length}
        OR company ILIKE $${params.length}
        OR country ILIKE $${params.length}
        OR source_path ILIKE $${params.length}
        OR message ILIKE $${params.length}
      )`);
    }

    if (normalizedStatus !== "all") {
      params.push(normalizedStatus);
      where.push(`status = $${params.length}`);
    }

    if (countryFilter && countryFilter !== "all") {
      params.push(countryFilter);
      where.push(`country = $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const countResult = await db.query(`SELECT COUNT(*)::INTEGER AS count FROM inquiry_submissions ${whereSql}`, params);
    params.push(safePageSize);
    params.push((safePage - 1) * safePageSize);
    const rowsResult = await db.query(
      `
        SELECT *
        FROM inquiry_submissions
        ${whereSql}
        ORDER BY submitted_at DESC
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
      `,
      params
    );
    const total = Number(countResult.rows[0]?.count || 0);
    return {
      rows: rowsResult.rows.map(rowToInquiry),
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / safePageSize)),
      storageMode: inquiryStorageMode()
    };
  }

  const items = await readFileItems();
  const filtered = items
    .filter((item) => normalizedStatus === "all" || item.status === normalizedStatus)
    .filter((item) => countryFilter === "all" || item.country === countryFilter)
    .filter((item) => {
      if (!keyword) return true;
      return [item.name, item.email, item.phone, item.company, item.country, item.message, item.sourcePath]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword.toLowerCase());
    });
  const total = filtered.length;
  return {
    rows: filtered.slice((safePage - 1) * safePageSize, safePage * safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / safePageSize)),
    storageMode: inquiryStorageMode()
  };
}

export async function updateInquiryStatus(id, status) {
  const safeStatus = normalizeStatus(status);
  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query("UPDATE inquiry_submissions SET status = $2, updated_at = NOW() WHERE id = $1", [id, safeStatus]);
    return true;
  }

  const items = await readFileItems();
  const nextItems = items.map((item) => item.id === id ? { ...item, status: safeStatus, updatedAt: new Date().toISOString() } : item);
  await writeFileItems(nextItems);
  return true;
}
