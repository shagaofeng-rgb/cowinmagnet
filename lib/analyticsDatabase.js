import pg from "pg";
import { databasePoolMax, databaseSsl, databaseUrl, withDatabaseRetry } from "./databaseUrl.js";

const { Pool } = pg;

let pool;
let schemaReady = false;
let schemaPromise;
const SCHEMA_LOCK_ID = 52401000;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!isDatabaseConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: databasePoolMax(),
      connectionTimeoutMillis: Number(process.env.ANALYTICS_DB_CONNECTION_TIMEOUT_MS || 5000),
      idleTimeoutMillis: 10000,
      statement_timeout: Number(process.env.ANALYTICS_DB_STATEMENT_TIMEOUT_MS || 12000),
      query_timeout: Number(process.env.ANALYTICS_DB_QUERY_TIMEOUT_MS || 12000)
    });
  }
  return pool;
}

async function dbQuery(db, text, values) {
  return withDatabaseRetry(() => db.query(text, values));
}

async function ensureSchema() {
  const db = getPool();
  if (!db || schemaReady) return;
  if (schemaPromise) return schemaPromise;

  schemaPromise = (async () => {
    const existing = await db.query(`
      SELECT
        to_regclass('public.analytics_events') IS NOT NULL
        AND to_regclass('public.traffic_events') IS NOT NULL
        AND to_regclass('public.analytics_snapshots') IS NOT NULL
        AND to_regclass('public.conversion_attributions') IS NOT NULL
        AND to_regclass('public.traffic_source_rules') IS NOT NULL AS ready
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
        throw new Error("Analytics schema initialization is already in progress");
      }
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        visitor_id TEXT,
        session_id TEXT,
        page TEXT,
        page_title TEXT,
        referrer TEXT,
        channel TEXT,
        country TEXT,
        city TEXT,
        device TEXT,
        browser TEXT,
        os TEXT,
        ip TEXT,
        duration INTEGER DEFAULT 0,
        scroll_depth INTEGER DEFAULT 0,
        event_time TIMESTAMPTZ NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_time_idx ON analytics_events (event_time DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_type_time_idx ON analytics_events (type, event_time DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_page_idx ON analytics_events (page)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON analytics_events (session_id)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_visitor_idx ON analytics_events (visitor_id)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_visitor_type_time_idx ON analytics_events (visitor_id, type, event_time DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_payload_source_idx ON analytics_events ((payload->>'sourcePlatform'), event_time DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_events_payload_campaign_idx ON analytics_events ((payload->'utm'->>'campaign'), event_time DESC)");
    await client.query(`
      CREATE TABLE IF NOT EXISTS traffic_events (
        id TEXT PRIMARY KEY,
        visitor_id TEXT,
        session_id TEXT,
        event_type TEXT NOT NULL,
        page_path TEXT,
        page_title TEXT,
        source TEXT,
        medium TEXT,
        campaign TEXT,
        platform TEXT,
        country_code TEXT,
        locale TEXT,
        metadata JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query("CREATE INDEX IF NOT EXISTS traffic_events_source_created_idx ON traffic_events (source, created_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS traffic_events_medium_created_idx ON traffic_events (medium, created_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS traffic_events_campaign_created_idx ON traffic_events (campaign, created_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS traffic_events_type_created_idx ON traffic_events (event_type, created_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS traffic_events_country_created_idx ON traffic_events (country_code, created_at DESC)");
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_snapshots (
        cache_key TEXT PRIMARY KEY,
        preset TEXT,
        range_start TIMESTAMPTZ NOT NULL,
        range_end TIMESTAMPTZ NOT NULL,
        snapshot JSONB NOT NULL,
        generated_at TIMESTAMPTZ NOT NULL,
        event_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query("CREATE INDEX IF NOT EXISTS analytics_snapshots_generated_idx ON analytics_snapshots (generated_at DESC)");
    await client.query("CREATE INDEX IF NOT EXISTS analytics_snapshots_range_idx ON analytics_snapshots (range_start, range_end)");
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversion_attributions (
        id TEXT PRIMARY KEY,
        conversion_type TEXT NOT NULL,
        conversion_id TEXT NOT NULL,
        visitor_id TEXT,
        session_id TEXT,
        first_source TEXT,
        first_medium TEXT,
        first_campaign TEXT,
        last_source TEXT,
        last_medium TEXT,
        last_campaign TEXT,
        session_source TEXT,
        session_medium TEXT,
        session_campaign TEXT,
        attribution_model TEXT NOT NULL DEFAULT 'first_last_session',
        metadata JSONB NOT NULL,
        converted_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query("CREATE INDEX IF NOT EXISTS conversion_attributions_type_time_idx ON conversion_attributions (conversion_type, converted_at DESC)");
    await client.query(`
      CREATE TABLE IF NOT EXISTS traffic_source_rules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source TEXT NOT NULL,
        channel TEXT NOT NULL,
        match_type TEXT NOT NULL,
        match_value TEXT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 100,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
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

export async function appendDatabaseEvent(event) {
  const db = getPool();
  if (!db) return false;

  return withDatabaseRetry(async () => {
    await ensureSchema();
    await db.query(
    `
      INSERT INTO analytics_events (
        id, type, visitor_id, session_id, page, page_title, referrer, channel,
        country, city, device, browser, os, ip, duration, scroll_depth, event_time, payload
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      )
      ON CONFLICT (id) DO NOTHING
    `,
    [
      event.id,
      event.type,
      event.visitorId,
      event.sessionId,
      event.page,
      event.pageTitle,
      event.referrer,
      event.channel,
      event.country,
      event.city,
      event.device,
      event.browser,
      event.os,
      event.ip,
      Number(event.duration || 0),
      Number(event.scrollDepth || 0),
      event.timestamp,
      event
    ]
    );
    const touch = event.attribution?.sessionTouch || {};
    await db.query(
    `
      INSERT INTO traffic_events (
        id, visitor_id, session_id, event_type, page_path, page_title, source,
        medium, campaign, platform, country_code, locale, metadata, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      ON CONFLICT (id) DO NOTHING
    `,
    [
      event.id,
      event.visitorId,
      event.sessionId,
      event.type,
      event.page,
      event.pageTitle,
      touch.source || event.sourcePlatform || "",
      touch.medium || event.channel || "",
      touch.campaign || event.utm?.campaign || "",
      touch.platform || event.sourcePlatform || "",
      event.country,
      touch.locale || "",
      event,
      event.timestamp
    ]
    );
    return true;
  });
}

export async function appendConversionAttribution(conversion) {
  const db = getPool();
  if (!db) return false;
  await ensureSchema();
  const first = conversion.attribution?.firstTouch || {};
  const last = conversion.attribution?.lastTouch || {};
  const session = conversion.attribution?.sessionTouch || {};
  await dbQuery(db,
    `
      INSERT INTO conversion_attributions (
        id, conversion_type, conversion_id, visitor_id, session_id,
        first_source, first_medium, first_campaign,
        last_source, last_medium, last_campaign,
        session_source, session_medium, session_campaign,
        metadata, converted_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (id) DO NOTHING
    `,
    [
      conversion.id,
      conversion.conversionType,
      conversion.conversionId,
      conversion.visitorId || "",
      conversion.sessionId || "",
      first.source || "",
      first.medium || "",
      first.campaign || "",
      last.source || "",
      last.medium || "",
      last.campaign || "",
      session.source || "",
      session.medium || "",
      session.campaign || "",
      conversion,
      conversion.convertedAt
    ]
  );
  return true;
}

export async function readDatabaseEvents({ days = 90, startDate, endDate, limit = 8000 } = {}) {
  const db = getPool();
  if (!db) return null;

  await ensureSchema();

  const eventFields = `
    SELECT
      id,
      type,
      visitor_id,
      session_id,
      page,
      page_title,
      referrer,
      channel,
      country,
      city,
      device,
      browser,
      os,
      ip,
      duration,
      scroll_depth,
      event_time,
      payload->'utm' AS utm,
      payload->'attribution' AS attribution,
      payload->>'previousPage' AS previous_page,
      payload->>'eventId' AS event_id,
      payload->>'clientTimestamp' AS client_timestamp
    FROM analytics_events
  `;

  const toEvent = (row) => ({
    id: row.id,
    type: row.type,
    visitorId: row.visitor_id,
    sessionId: row.session_id,
    page: row.page,
    previousPage: row.previous_page || "",
    pageTitle: row.page_title,
    referrer: row.referrer,
    channel: row.channel,
    country: row.country,
    city: row.city,
    device: row.device,
    browser: row.browser,
    os: row.os,
    ip: row.ip,
    duration: Number(row.duration || 0),
    scrollDepth: Number(row.scroll_depth || 0),
    timestamp: row.event_time,
    utm: row.utm || {},
    attribution: row.attribution || {},
    eventId: row.event_id || "",
    clientTimestamp: row.client_timestamp || ""
  });

  if (startDate && endDate) {
    const result = await dbQuery(db,
      `
        ${eventFields}
        WHERE event_time >= $1::TIMESTAMPTZ
          AND event_time <= $2::TIMESTAMPTZ
        ORDER BY event_time DESC
        LIMIT $3
      `,
      [startDate, endDate, limit]
    );

    return result.rows.map(toEvent);
  }

  const result = await dbQuery(db,
    `
      ${eventFields}
      WHERE event_time >= NOW() - ($1::TEXT || ' days')::INTERVAL
      ORDER BY event_time DESC
      LIMIT $2
    `,
    [String(days), limit]
  );

  return result.rows.map(toEvent);
}

export async function readDatabaseVisitorJourney({
  visitorId = "",
  sessionId = "",
  submittedAt,
  beforeDays = 90,
  afterDays = 30,
  limit = 120
} = {}) {
  const db = getPool();
  if (!db) return null;

  const safeVisitorId = String(visitorId || "").trim();
  const safeSessionId = String(sessionId || "").trim();
  if (!safeVisitorId && !safeSessionId) return [];

  await ensureSchema();
  const referenceDate = new Date(submittedAt || Date.now());
  const referenceTime = Number.isNaN(referenceDate.getTime()) ? new Date().toISOString() : referenceDate.toISOString();
  const safeBeforeDays = Math.min(365, Math.max(1, Number(beforeDays) || 90));
  const safeAfterDays = Math.min(90, Math.max(0, Number(afterDays) || 30));
  const safeLimit = Math.min(250, Math.max(1, Number(limit) || 120));
  const result = await dbQuery(db,
    `
      SELECT
        type,
        visitor_id,
        session_id,
        page,
        page_title,
        channel,
        country,
        device,
        browser,
        event_time,
        payload->>'previousPage' AS previous_page,
        payload->'attribution' AS attribution
      FROM analytics_events
      WHERE (
        ($1 <> '' AND visitor_id = $1)
        OR ($2 <> '' AND session_id = $2)
      )
        AND event_time >= $3::TIMESTAMPTZ - ($4::TEXT || ' days')::INTERVAL
        AND event_time <= $3::TIMESTAMPTZ + ($5::TEXT || ' days')::INTERVAL
      ORDER BY event_time DESC
      LIMIT $6
    `,
    [safeVisitorId, safeSessionId, referenceTime, String(safeBeforeDays), String(safeAfterDays), safeLimit]
  );

  return result.rows.map((row) => ({
    type: row.type,
    visitorId: row.visitor_id || "",
    sessionId: row.session_id || "",
    page: row.page || "",
    pageTitle: row.page_title || "",
    previousPage: row.previous_page || "",
    channel: row.channel || "",
    country: row.country || "",
    device: row.device || "",
    browser: row.browser || "",
    timestamp: row.event_time,
    attribution: row.attribution || {}
  }));
}

export async function countDatabaseAnalyticsEvents({ days = 1, startDate, endDate } = {}) {
  const db = getPool();
  if (!db) return null;

  await ensureSchema();

  const result = startDate && endDate
    ? await db.query(
        `
          SELECT COUNT(*)::INTEGER AS count
          FROM analytics_events
          WHERE event_time >= $1::TIMESTAMPTZ
            AND event_time <= $2::TIMESTAMPTZ
        `,
        [startDate, endDate]
      )
    : await db.query(
        `
          SELECT COUNT(*)::INTEGER AS count
          FROM analytics_events
          WHERE event_time >= NOW() - ($1::TEXT || ' days')::INTERVAL
        `,
        [String(days)]
      );

  return Number(result.rows[0]?.count || 0);
}

export async function readDatabaseVisitorHistory({ days = 731, limit = 100000, visitorIds } = {}) {
  const db = getPool();
  if (!db) return null;

  await ensureSchema();

  const params = [String(days)];
  let visitorFilter = "";
  if (Array.isArray(visitorIds)) {
    const scopedVisitorIds = [...new Set(visitorIds.filter(Boolean).map(String))].slice(0, 5000);
    if (!scopedVisitorIds.length) return [];
    params.push(scopedVisitorIds);
    visitorFilter = `AND visitor_id = ANY($${params.length}::TEXT[])`;
  }
  params.push(Number(limit || 100000));
  const limitParam = params.length;

  const result = await dbQuery(db,
    `
      SELECT
        visitor_id,
        MIN(event_time) AS event_time
      FROM analytics_events
      WHERE type = 'page_view'
        AND visitor_id IS NOT NULL
        AND event_time >= NOW() - ($1::TEXT || ' days')::INTERVAL
        ${visitorFilter}
      GROUP BY visitor_id, DATE(event_time AT TIME ZONE 'Asia/Shanghai')
      ORDER BY MIN(event_time) ASC
      LIMIT $${limitParam}
    `,
    params
  );

  return result.rows.map((row) => ({
    type: "page_view",
    visitorId: row.visitor_id,
    timestamp: row.event_time
  }));
}

export async function readDatabaseAnalyticsSnapshot({ cacheKey, maxAgeMs, allowStale = true } = {}) {
  const db = getPool();
  if (!db || !cacheKey) return null;

  await ensureSchema();

  const result = await dbQuery(db,
    `
      SELECT cache_key, snapshot, generated_at, event_count
      FROM analytics_snapshots
      WHERE cache_key = $1
      LIMIT 1
    `,
    [cacheKey]
  );
  const row = result.rows[0];
  if (!row) return null;

  const generatedAt = new Date(row.generated_at);
  const ageMs = Date.now() - generatedAt.getTime();
  const isFresh = Number.isFinite(ageMs) && (!maxAgeMs || ageMs <= maxAgeMs);
  if (!allowStale && !isFresh) return null;

  return {
    snapshot: row.snapshot,
    generatedAt: row.generated_at,
    eventCount: row.event_count,
    ageMs,
    isFresh
  };
}

export async function writeDatabaseAnalyticsSnapshot({
  cacheKey,
  preset = "",
  rangeStart,
  rangeEnd,
  snapshot,
  eventCount = 0
} = {}) {
  const db = getPool();
  if (!db || !cacheKey || !rangeStart || !rangeEnd || !snapshot) return false;

  await ensureSchema();

  await dbQuery(db,
    `
      INSERT INTO analytics_snapshots (
        cache_key, preset, range_start, range_end, snapshot, generated_at, event_count, updated_at
      )
      VALUES ($1, $2, $3::TIMESTAMPTZ, $4::TIMESTAMPTZ, $5::JSONB, NOW(), $6, NOW())
      ON CONFLICT (cache_key) DO UPDATE SET
        preset = EXCLUDED.preset,
        range_start = EXCLUDED.range_start,
        range_end = EXCLUDED.range_end,
        snapshot = EXCLUDED.snapshot,
        generated_at = EXCLUDED.generated_at,
        event_count = EXCLUDED.event_count,
        updated_at = NOW()
    `,
    [cacheKey, preset, rangeStart, rangeEnd, JSON.stringify(snapshot), Number(eventCount || 0)]
  );

  return true;
}
