import pg from "pg";

const { Pool } = pg;

let pool;
let schemaReady = false;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!isDatabaseConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
      max: 3
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db || schemaReady) return;

  await db.query(`
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

  await db.query("CREATE INDEX IF NOT EXISTS analytics_events_time_idx ON analytics_events (event_time DESC)");
  await db.query("CREATE INDEX IF NOT EXISTS analytics_events_page_idx ON analytics_events (page)");
  await db.query("CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON analytics_events (session_id)");
  schemaReady = true;
}

export async function appendDatabaseEvent(event) {
  const db = getPool();
  if (!db) return false;

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
  return true;
}

export async function readDatabaseEvents({ days = 90, limit = 8000 } = {}) {
  const db = getPool();
  if (!db) return null;

  await ensureSchema();
  const result = await db.query(
    `
      SELECT payload
      FROM analytics_events
      WHERE event_time >= NOW() - ($1::TEXT || ' days')::INTERVAL
      ORDER BY event_time DESC
      LIMIT $2
    `,
    [String(days), limit]
  );

  return result.rows.map((row) => row.payload);
}
