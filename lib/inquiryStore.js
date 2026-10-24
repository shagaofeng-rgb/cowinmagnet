import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databasePoolMax, databaseSsl, databaseUrl, withDatabaseRetry } from "./databaseUrl.js";
import { readDatabaseVisitorJourney } from "./analyticsDatabase.js";
import { safeSitePath, safeSiteUrl } from "./siteUrlSafety.js";

const { Pool } = pg;

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-inquiries") : path.join(process.cwd(), ".data");
const INQUIRY_FILE = path.join(DATA_DIR, "inquiry-submissions.json");
const SCHEMA_LOCK_ID = 52401003;
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const LEGACY_TEST_EMAIL = "monthly-form-test@cowinmagnet.com";
const NOTIFICATION_MAX_ATTEMPTS = 5;

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
      max: databasePoolMax(),
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
        visitor_id TEXT,
        session_id TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        owner TEXT,
        tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
        internal_note TEXT,
        notification_status TEXT NOT NULL DEFAULT 'not-tracked',
        notification_attempts INTEGER NOT NULL DEFAULT 0,
        notification_next_attempt_at TIMESTAMPTZ,
        notification_delivered_at TIMESTAMPTZ,
        notification_last_error TEXT,
        submitted_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS visitor_id TEXT");
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS session_id TEXT");
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS notification_status TEXT NOT NULL DEFAULT 'not-tracked'");
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS notification_attempts INTEGER NOT NULL DEFAULT 0");
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS notification_next_attempt_at TIMESTAMPTZ");
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS notification_delivered_at TIMESTAMPTZ");
      await client.query("ALTER TABLE inquiry_submissions ADD COLUMN IF NOT EXISTS notification_last_error TEXT");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_submitted_idx ON inquiry_submissions (submitted_at DESC)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_status_idx ON inquiry_submissions (status)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_email_idx ON inquiry_submissions (email)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_country_idx ON inquiry_submissions (country)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_source_idx ON inquiry_submissions (source_path)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_visitor_idx ON inquiry_submissions (visitor_id, submitted_at DESC)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_session_idx ON inquiry_submissions (session_id, submitted_at DESC)");
      await client.query("CREATE INDEX IF NOT EXISTS inquiry_submissions_notification_retry_idx ON inquiry_submissions (notification_next_attempt_at) WHERE notification_status IN ('pending', 'retry', 'sending')");
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

function isTestInquiry(item = {}) {
  return item.formType === "test" || item.form_type === "test" ||
    String(item.email || "").toLowerCase() === LEGACY_TEST_EMAIL;
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
    visitorId: row.visitor_id || row.payload?.visitorId || row.payload?.attribution?.visitorId || "",
    sessionId: row.session_id || row.payload?.sessionId || row.payload?.attribution?.sessionId || "",
    status: row.status,
    owner: row.owner,
    tags: row.tags || [],
    internalNote: row.internal_note,
    notificationStatus: row.notification_status || "not-tracked",
    notificationAttempts: Number(row.notification_attempts || 0),
    notificationNextAttemptAt: row.notification_next_attempt_at,
    notificationDeliveredAt: row.notification_delivered_at,
    notificationLastError: row.notification_last_error || "",
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
    sourcePath: safeSitePath(payload.sourcePath),
    pageUrl: safeSiteUrl(payload.pageUrl || payload.sourceUrl || payload.sourcePath),
    channel: String(sessionTouch.medium || payload.channel || "").trim(),
    utm,
    attribution,
    ip: String(payload.clientIp || "").trim(),
    userAgent: String(payload.userAgent || "").trim(),
    visitorId: String(payload.visitorId || attribution.visitorId || "").trim(),
    sessionId: String(payload.sessionId || attribution.sessionId || "").trim(),
    status: normalizeStatus(payload.status),
    owner: "",
    tags: [],
    internalNote: "",
    notificationStatus: payload.formType === "test" ? "test" : "pending",
    notificationAttempts: 0,
    notificationNextAttemptAt: null,
    notificationDeliveredAt: null,
    notificationLastError: "",
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
    payload
  };

  const db = getPool();
  if (db) {
    await withDatabaseRetry(async () => {
      await ensureSchema();
      await db.query(
      `
        INSERT INTO inquiry_submissions (
          id, form_type, name, email, phone, company, country, message,
          source_path, page_url, channel, utm, attribution, payload, ip,
          user_agent, visitor_id, session_id, status, owner, tags, internal_note,
          notification_status, notification_attempts, submitted_at, created_at, updated_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27)
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
        normalized.visitorId,
        normalized.sessionId,
        normalized.status,
        normalized.owner,
        normalized.tags,
        normalized.internalNote,
        normalized.notificationStatus,
        normalized.notificationAttempts,
        normalized.submittedAt,
        normalized.createdAt,
        normalized.updatedAt
      ]
      );
    });
    return normalized;
  }

  const items = await readFileItems();
  items.unshift(normalized);
  await writeFileItems(items);
  return normalized;
}

function notificationOutcome(sent, attempt, reason) {
  if (sent) return { status: "sent", nextAttemptAt: null, error: "" };
  const exhausted = attempt >= NOTIFICATION_MAX_ATTEMPTS;
  const delays = [5, 30, 120, 720];
  return {
    status: exhausted ? "failed" : "retry",
    nextAttemptAt: exhausted ? null : new Date(Date.now() + delays[Math.min(attempt - 1, delays.length - 1)] * 60_000).toISOString(),
    error: String(reason || "delivery-failed").slice(0, 120)
  };
}

export async function recordInquiryNotificationResult(id, { sent, reason = "", attempt = 1 } = {}) {
  const safeAttempt = Math.max(1, Number(attempt) || 1);
  const outcome = notificationOutcome(Boolean(sent), safeAttempt, reason);
  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query(
      `UPDATE inquiry_submissions
       SET notification_status = $2,
           notification_attempts = GREATEST(notification_attempts, $3),
           notification_next_attempt_at = $4,
           notification_delivered_at = CASE WHEN $2 = 'sent' THEN NOW() ELSE notification_delivered_at END,
           notification_last_error = $5,
           updated_at = NOW()
       WHERE id = $1`,
      [id, outcome.status, safeAttempt, outcome.nextAttemptAt, outcome.error]
    );
    return outcome;
  }

  const items = await readFileItems();
  const nextItems = items.map((item) => item.id === id ? {
    ...item,
    notificationStatus: outcome.status,
    notificationAttempts: Math.max(item.notificationAttempts || 0, safeAttempt),
    notificationNextAttemptAt: outcome.nextAttemptAt,
    notificationDeliveredAt: sent ? new Date().toISOString() : item.notificationDeliveredAt,
    notificationLastError: outcome.error,
    updatedAt: new Date().toISOString()
  } : item);
  await writeFileItems(nextItems);
  return outcome;
}

export async function claimDueInquiryNotifications(limit = 10) {
  const db = getPool();
  if (!db) return [];
  await ensureSchema();
  const result = await db.query(
    `WITH due AS (
       SELECT id FROM inquiry_submissions
       WHERE notification_attempts < $1
         AND (
           (notification_status = 'pending' AND created_at < NOW() - INTERVAL '10 minutes')
           OR (notification_status = 'retry' AND notification_next_attempt_at <= NOW())
           OR (notification_status = 'sending' AND updated_at < NOW() - INTERVAL '15 minutes')
         )
       ORDER BY created_at ASC
       LIMIT $2
       FOR UPDATE SKIP LOCKED
     )
     UPDATE inquiry_submissions AS i
     SET notification_status = 'sending',
         notification_attempts = i.notification_attempts + 1,
         updated_at = NOW()
     FROM due
     WHERE i.id = due.id
     RETURNING i.id, i.payload, i.notification_attempts`,
    [NOTIFICATION_MAX_ATTEMPTS, Math.min(25, Math.max(1, Number(limit) || 10))]
  );
  return result.rows.map((row) => ({ id: row.id, payload: row.payload || {}, attempt: Number(row.notification_attempts || 1) }));
}

export async function retryInquiryNotification(id) {
  const db = getPool();
  if (!db) return false;
  await ensureSchema();
  const result = await db.query(
    `UPDATE inquiry_submissions
     SET notification_status = 'retry', notification_attempts = 0,
         notification_next_attempt_at = NOW(), notification_last_error = '', updated_at = NOW()
     WHERE id = $1 AND notification_status IN ('failed', 'retry')
     RETURNING id`,
    [id]
  );
  return result.rowCount > 0;
}

export async function listInquirySubmissions({ q = "", status = "all", country = "all", startDate, endDate, page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
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

    params.push(LEGACY_TEST_EMAIL);
    where.push(`COALESCE(form_type, '') <> 'test' AND LOWER(COALESCE(email, '')) <> $${params.length}`);

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

    if (startDate && endDate) {
      params.push(startDate);
      where.push(`submitted_at >= $${params.length}::TIMESTAMPTZ`);
      params.push(endDate);
      where.push(`submitted_at <= $${params.length}::TIMESTAMPTZ`);
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
    .filter((item) => !isTestInquiry(item))
    .filter((item) => {
      if (!startDate || !endDate) return true;
      const time = new Date(item.submittedAt || item.createdAt || 0).getTime();
      return Number.isFinite(time) && time >= new Date(startDate).getTime() && time <= new Date(endDate).getTime();
    })
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

function trackingIdentifiers(inquiry) {
  const payload = inquiry?.payload || {};
  const attribution = inquiry?.attribution || payload.attribution || {};
  return {
    visitorId: String(inquiry?.visitorId || payload.visitorId || attribution.visitorId || "").trim(),
    sessionId: String(inquiry?.sessionId || payload.sessionId || attribution.sessionId || "").trim()
  };
}

function visitorMatchLabel(visitorId, sessionId) {
  if (visitorId && sessionId) return "visitor-session";
  if (visitorId) return "visitor";
  if (sessionId) return "session";
  return "unavailable";
}

export async function getInquirySubmissionDetail(id) {
  const safeId = String(id || "").trim();
  if (!safeId) return null;

  const db = getPool();
  let inquiry;
  if (db) {
    await ensureSchema();
    const result = await db.query("SELECT * FROM inquiry_submissions WHERE id = $1 LIMIT 1", [safeId]);
    if (!result.rows[0]) return null;
    inquiry = rowToInquiry(result.rows[0]);
  } else {
    const items = await readFileItems();
    inquiry = items.find((item) => item.id === safeId) || null;
    if (!inquiry) return null;
  }

  const { visitorId, sessionId } = trackingIdentifiers(inquiry);
  const events = await readDatabaseVisitorJourney({
    visitorId,
    sessionId,
    submittedAt: inquiry.submittedAt,
    beforeDays: 90,
    afterDays: 30,
    limit: 120
  });

  return {
    inquiry: { ...inquiry, visitorId, sessionId },
    storageMode: inquiryStorageMode(),
    visitorHistory: {
      matchMethod: visitorMatchLabel(visitorId, sessionId),
      available: Array.isArray(events),
      events: events || []
    }
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
