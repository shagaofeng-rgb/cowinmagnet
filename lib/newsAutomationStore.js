import crypto from "node:crypto";
import pg from "pg";
import { databasePoolMax, databaseSsl, databaseUrl, withDatabaseRetry } from "./databaseUrl.js";
import { getNewsSiteConfig } from "./newsAutomationConfig.js";
import { getCatalogSeedSources } from "./news/sourceCatalog.js";

const { Pool } = pg;
const DEFAULT_SITE_ID = "cowinmagnet-production";
let pool;
let schemaPromise;

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function json(value) {
  return JSON.stringify(value ?? {});
}

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

function asCandidate(row) {
  return row && {
    ...row,
    sourceUrl: row.source_url,
    canonicalUrl: row.canonical_url,
    publishedAt: row.source_published_at || row.published_at,
    sourcePublishedAt: row.source_published_at || row.published_at,
    candidateScore: Number(row.candidate_score || 0),
    duplicateFingerprint: row.duplicate_fingerprint,
    contentFingerprint: row.content_fingerprint,
    rejectionReason: row.rejection_reason,
    facts: row.facts_json || []
  };
}

export function newsAutomationStorageMode() {
  return getPool() ? "postgres" : "not-configured";
}

export async function ensureNewsAutomationSchema() {
  const db = getPool();
  if (!db) throw new Error("DATABASE_URL is required for News automation.");
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS news_sources (
          id TEXT PRIMARY KEY, domain TEXT NOT NULL, name TEXT NOT NULL, priority SMALLINT NOT NULL DEFAULT 2,
          rss_url TEXT, allowed BOOLEAN NOT NULL DEFAULT TRUE, active BOOLEAN NOT NULL DEFAULT TRUE,
          site_id TEXT NOT NULL DEFAULT '${DEFAULT_SITE_ID}', source_type TEXT NOT NULL DEFAULT 'trade-media',
          source_trust_score NUMERIC NOT NULL DEFAULT 0, allowed_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
          allowed_languages JSONB NOT NULL DEFAULT '["en"]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS news_candidates (
          id TEXT PRIMARY KEY, source_url TEXT NOT NULL, canonical_url TEXT NOT NULL, publisher TEXT NOT NULL,
          title TEXT NOT NULL, author TEXT, published_at TIMESTAMPTZ, discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          language TEXT, country TEXT, industry TEXT, materials JSONB NOT NULL DEFAULT '[]'::jsonb,
          process_stage TEXT, product_families JSONB NOT NULL DEFAULT '[]'::jsonb, credibility_score NUMERIC NOT NULL DEFAULT 0,
          novelty_score NUMERIC NOT NULL DEFAULT 0, relevance_score NUMERIC NOT NULL DEFAULT 0,
          image_rights_status TEXT NOT NULL DEFAULT 'unknown', facts_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          duplicate_fingerprint TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'discovered', used_count INTEGER NOT NULL DEFAULT 0,
          last_used_at TIMESTAMPTZ, rejection_reason TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          site_id TEXT NOT NULL DEFAULT '${DEFAULT_SITE_ID}', normalized_url_hash TEXT, title_hash TEXT,
          content_fingerprint TEXT, candidate_score NUMERIC NOT NULL DEFAULT 0, source_type TEXT,
          source_published_at TIMESTAMPTZ, reserved_at TIMESTAMPTZ, used_by_article_id TEXT
        );
        CREATE TABLE IF NOT EXISTS generated_articles (
          id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, locale TEXT NOT NULL DEFAULT 'en', title TEXT NOT NULL,
          meta_title TEXT NOT NULL, meta_description TEXT NOT NULL, html TEXT NOT NULL DEFAULT '', markdown TEXT NOT NULL DEFAULT '',
          primary_keyword TEXT, secondary_keywords_json JSONB NOT NULL DEFAULT '[]'::jsonb, product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
          industry TEXT, country TEXT, source_ids JSONB NOT NULL DEFAULT '[]'::jsonb, hero_media_id TEXT,
          status TEXT NOT NULL DEFAULT 'draft', similarity_score NUMERIC NOT NULL DEFAULT 0,
          fact_check_json JSONB NOT NULL DEFAULT '{}'::jsonb, published_at TIMESTAMPTZ, canonical_url TEXT,
          rollback_snapshot JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          site_id TEXT NOT NULL DEFAULT '${DEFAULT_SITE_ID}'
        );
        CREATE TABLE IF NOT EXISTS news_publication_runs (
          id TEXT PRIMARY KEY, run_type TEXT NOT NULL, started_at TIMESTAMPTZ NOT NULL, finished_at TIMESTAMPTZ,
          status TEXT NOT NULL, logs_json JSONB NOT NULL DEFAULT '[]'::jsonb, error_summary TEXT,
          site_id TEXT NOT NULL DEFAULT '${DEFAULT_SITE_ID}', cycle_started_at TIMESTAMPTZ, attempt INTEGER NOT NULL DEFAULT 0, request_id TEXT
        );
        CREATE TABLE IF NOT EXISTS news_operation_locks (
          lock_name TEXT PRIMARY KEY, owner_id TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS news_candidate_fingerprints (
          site_id TEXT NOT NULL, fingerprint TEXT NOT NULL, candidate_id TEXT REFERENCES news_candidates(id) ON DELETE CASCADE,
          fingerprint_type TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (site_id, fingerprint, fingerprint_type)
        );
        CREATE TABLE IF NOT EXISTS news_delivery_checks (
          id TEXT PRIMARY KEY, site_id TEXT NOT NULL, article_id TEXT, slug TEXT NOT NULL,
          checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), list_http_status INTEGER, detail_http_status INTEGER,
          sitemap_http_status INTEGER, list_visible BOOLEAN, detail_visible BOOLEAN, canonical_valid BOOLEAN,
          schema_valid BOOLEAN, source_panel_visible BOOLEAN, blog_isolated BOOLEAN,
          details_json JSONB NOT NULL DEFAULT '{}'::jsonb
        );
        CREATE TABLE IF NOT EXISTS news_audit_events (
          id TEXT PRIMARY KEY, site_id TEXT NOT NULL, event_type TEXT NOT NULL, entity_type TEXT NOT NULL,
          entity_id TEXT, details_json JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS news_article_evidence (
          id TEXT PRIMARY KEY, site_id TEXT NOT NULL, article_id TEXT, candidate_id TEXT,
          product_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb, citations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          media_json JSONB NOT NULL DEFAULT '[]'::jsonb, readiness_json JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS news_media_assets (
          id TEXT PRIMARY KEY, site_id TEXT NOT NULL, article_id TEXT, content_hash TEXT,
          storage_key TEXT, public_url TEXT, source_url TEXT, publisher TEXT, license_basis TEXT,
          rights_verified_at TIMESTAMPTZ, status TEXT NOT NULL, metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS news_article_quality_checks (
          id TEXT PRIMARY KEY, site_id TEXT NOT NULL, article_id TEXT, check_type TEXT NOT NULL,
          passed BOOLEAN NOT NULL, details_json JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS content_remediation_audits (
          id TEXT PRIMARY KEY, content_id TEXT NOT NULL, content_type TEXT NOT NULL, slug TEXT NOT NULL,
          locale TEXT NOT NULL DEFAULT 'en', action TEXT NOT NULL, defects JSONB NOT NULL DEFAULT '[]'::jsonb,
          details JSONB NOT NULL DEFAULT '{}'::jsonb, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      await db.query(`
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS site_id TEXT;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'trade-media';
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS source_trust_score NUMERIC NOT NULL DEFAULT 0;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS allowed_topics JSONB NOT NULL DEFAULT '[]'::jsonb;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS allowed_languages JSONB NOT NULL DEFAULT '["en"]'::jsonb;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS source_ordinal INTEGER;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS raw_entry TEXT;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS requested_url TEXT;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS source_group TEXT;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS discovery_methods JSONB NOT NULL DEFAULT '[]'::jsonb;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS tier TEXT NOT NULL DEFAULT 'C';
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS validation_status TEXT NOT NULL DEFAULT 'pending';
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS robots_allowed BOOLEAN;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMPTZ;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMPTZ;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS use_count INTEGER NOT NULL DEFAULT 0;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS canonical_duplicate_of TEXT;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS notes TEXT;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS next_check_at TIMESTAMPTZ;
        ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS failure_count INTEGER NOT NULL DEFAULT 0;
        UPDATE news_sources SET site_id = '${DEFAULT_SITE_ID}' WHERE site_id IS NULL;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS site_id TEXT;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS normalized_url_hash TEXT;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS title_hash TEXT;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS content_fingerprint TEXT;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS candidate_score NUMERIC NOT NULL DEFAULT 0;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS source_type TEXT;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS source_published_at TIMESTAMPTZ;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS reserved_at TIMESTAMPTZ;
        ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS used_by_article_id TEXT;
        UPDATE news_candidates SET site_id = '${DEFAULT_SITE_ID}' WHERE site_id IS NULL;
        UPDATE news_candidates SET source_published_at = published_at WHERE source_published_at IS NULL;
        ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS site_id TEXT;
        ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS document_json JSONB;
        ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'news';
        ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS validation_json JSONB NOT NULL DEFAULT '{}'::jsonb;
        UPDATE generated_articles SET site_id = '${DEFAULT_SITE_ID}' WHERE site_id IS NULL;
        ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS site_id TEXT;
        ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS cycle_started_at TIMESTAMPTZ;
        ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS attempt INTEGER NOT NULL DEFAULT 0;
        ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS request_id TEXT;
        UPDATE news_publication_runs SET site_id = '${DEFAULT_SITE_ID}' WHERE site_id IS NULL;
      `);
      await db.query("ALTER TABLE news_sources DROP CONSTRAINT IF EXISTS news_sources_domain_key");
      await db.query("ALTER TABLE news_candidates DROP CONSTRAINT IF EXISTS news_candidates_source_url_key");
      await db.query("CREATE UNIQUE INDEX IF NOT EXISTS news_sources_site_domain_idx ON news_sources (site_id, domain)");
      await db.query("CREATE INDEX IF NOT EXISTS news_sources_validation_idx ON news_sources (site_id, validation_status, active, next_check_at)");
      await db.query("CREATE UNIQUE INDEX IF NOT EXISTS news_candidates_site_source_url_idx ON news_candidates (site_id, source_url)");
      await db.query("CREATE INDEX IF NOT EXISTS news_candidates_site_state_score_idx ON news_candidates (site_id, status, candidate_score DESC, source_published_at DESC)");
      await db.query("CREATE INDEX IF NOT EXISTS news_candidates_site_fingerprint_idx ON news_candidates (site_id, content_fingerprint)");
      await db.query("CREATE INDEX IF NOT EXISTS generated_articles_site_status_date_idx ON generated_articles (site_id, status, published_at DESC)");
      await db.query("CREATE INDEX IF NOT EXISTS news_publication_runs_site_type_date_idx ON news_publication_runs (site_id, run_type, started_at DESC)");
      await db.query("CREATE INDEX IF NOT EXISTS news_delivery_checks_site_slug_date_idx ON news_delivery_checks (site_id, slug, checked_at DESC)");
      await db.query("CREATE INDEX IF NOT EXISTS content_remediation_audits_content_idx ON content_remediation_audits (content_type, slug, created_at DESC)");
      await db.query("CREATE INDEX IF NOT EXISTS news_article_evidence_site_article_idx ON news_article_evidence (site_id, article_id, updated_at DESC)");
      await db.query("CREATE UNIQUE INDEX IF NOT EXISTS news_media_assets_site_hash_idx ON news_media_assets (site_id, content_hash) WHERE content_hash IS NOT NULL");
      await db.query("CREATE INDEX IF NOT EXISTS news_article_quality_checks_article_idx ON news_article_quality_checks (site_id, article_id, created_at DESC)");
    })().catch((error) => { schemaPromise = null; throw error; });
  }
  return schemaPromise;
}

async function db() {
  await ensureNewsAutomationSchema();
  return getPool();
}

export async function syncNewsSources(site) {
  const connection = await db();
  const configuredSources = [...(site.sources?.primary_whitelist || []), ...(site.sources?.fallback_whitelist || [])].map((source) => ({
    ...source,
    domain: (() => {
      try { return new URL(source.rss_or_api_url || source.rssUrl || `https://${source.domain}`).hostname.replace(/^www\./i, ""); }
      catch { return source.domain; }
    })(),
    rss_or_api_url: source.rss_or_api_url || source.rssUrl || null,
    validationStatus: "verified",
    robotsAllowed: true,
    active: true,
    tier: source.source_trust_score >= 90 ? "A" : "B",
    discoveryMethod: ["rss"]
  }));
  const sources = [...configuredSources, ...getCatalogSeedSources()];
  for (const source of sources) {
    await connection.query(
      `INSERT INTO news_sources (id, site_id, domain, name, priority, rss_url, allowed, active, source_type, source_trust_score, allowed_topics, allowed_languages, source_ordinal, raw_entry, requested_url, source_group, discovery_methods, tier, validation_status, robots_allowed, canonical_duplicate_of, notes)
       VALUES ($1,$2,$3,$4,2,$5,TRUE,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
       ON CONFLICT (site_id, domain) DO UPDATE SET name=EXCLUDED.name, rss_url=COALESCE(EXCLUDED.rss_url, news_sources.rss_url), source_type=EXCLUDED.source_type,
       source_trust_score=GREATEST(news_sources.source_trust_score, EXCLUDED.source_trust_score), allowed_topics=EXCLUDED.allowed_topics, allowed_languages=EXCLUDED.allowed_languages,
       source_ordinal=COALESCE(EXCLUDED.source_ordinal, news_sources.source_ordinal), raw_entry=COALESCE(EXCLUDED.raw_entry, news_sources.raw_entry), requested_url=COALESCE(EXCLUDED.requested_url, news_sources.requested_url),
       source_group=COALESCE(EXCLUDED.source_group, news_sources.source_group), discovery_methods=CASE WHEN jsonb_array_length(EXCLUDED.discovery_methods) > 0 THEN EXCLUDED.discovery_methods ELSE news_sources.discovery_methods END,
       tier=CASE WHEN EXCLUDED.tier IN ('A','B') THEN EXCLUDED.tier ELSE news_sources.tier END,
       validation_status=CASE
         WHEN EXCLUDED.active=TRUE AND EXCLUDED.tier <> 'discovery-only' AND EXCLUDED.canonical_duplicate_of IS NULL
           THEN CASE WHEN news_sources.validation_status='verified' THEN 'verified' ELSE 'enabled-public-page' END
         WHEN EXCLUDED.active=FALSE THEN EXCLUDED.validation_status
         ELSE news_sources.validation_status
       END,
       robots_allowed=CASE WHEN EXCLUDED.robots_allowed IS TRUE THEN TRUE ELSE news_sources.robots_allowed END,
       active=CASE
         WHEN EXCLUDED.active=TRUE AND EXCLUDED.tier <> 'discovery-only' AND EXCLUDED.canonical_duplicate_of IS NULL THEN TRUE
         WHEN EXCLUDED.active=FALSE THEN FALSE
         ELSE news_sources.active
       END, canonical_duplicate_of=COALESCE(EXCLUDED.canonical_duplicate_of, news_sources.canonical_duplicate_of), notes=COALESCE(EXCLUDED.notes, news_sources.notes), updated_at=NOW()`,
      [id("source"), site.site_id, source.domain, source.name, source.rss_or_api_url, Boolean(source.active), source.source_type || source.type || "trade-media", source.source_trust_score || 0, json(source.allowed_topics || []), json(source.allowed_languages || ["en"]), source.sourceOrdinal || null, source.rawEntry || null, source.requestedUrl || null, source.sourceGroup || null, json(source.discoveryMethod || source.discovery_methods || []), source.tier || "C", source.validationStatus || source.validation_status || "pending", source.robotsAllowed ?? source.robots_allowed ?? null, source.canonicalDuplicateOf || null, source.notes || null]
    );
  }
  // Public-page sources are allowed without a separate RSS approval.  Explicitly blocked,
  // inactive, duplicate and community-only sources remain unavailable to the publisher.
  await connection.query("UPDATE news_sources SET active=FALSE, updated_at=NOW() WHERE site_id=$1 AND (validation_status IN ('inactive','robots-blocked') OR tier='discovery-only' OR canonical_duplicate_of IS NOT NULL) AND active=TRUE", [site.site_id]);
}

export async function listNewsSources(siteId) {
  const connection = await db();
  const result = await connection.query("SELECT * FROM news_sources WHERE site_id=$1 AND allowed=TRUE AND active=TRUE AND validation_status NOT IN ('inactive','robots-blocked') AND tier <> 'discovery-only' AND canonical_duplicate_of IS NULL AND (last_used_at IS NULL OR last_used_at < NOW() - INTERVAL '14 days') ORDER BY (rss_url IS NULL), last_used_at NULLS FIRST, source_trust_score DESC, domain", [siteId]);
  return result.rows;
}

export async function listNewsSourcesForValidation({ siteId, limit = 12 } = {}) {
  const connection = await db();
  const result = await connection.query(
    "SELECT * FROM news_sources WHERE site_id=$1 AND validation_status IN ('pending','needs_review') AND tier <> 'discovery-only' AND canonical_duplicate_of IS NULL ORDER BY next_check_at NULLS FIRST, source_ordinal NULLS LAST, domain LIMIT $2",
    [siteId, Math.max(1, Math.min(Number(limit) || 12, 24))]
  );
  return result.rows;
}

export async function updateNewsSourceValidation({ siteId, domain, validationStatus, robotsAllowed = null, active = false, rssUrl = null, notes = null, retryAfterMinutes = 720 } = {}) {
  const connection = await db();
  await connection.query(
    `UPDATE news_sources SET validation_status=$3, robots_allowed=$4, active=$5, rss_url=COALESCE($6, rss_url), notes=COALESCE($7, notes),
     last_checked_at=NOW(), next_check_at=NOW() + ($8 * INTERVAL '1 minute'), failure_count=CASE WHEN $3='verified' THEN 0 ELSE failure_count+1 END, updated_at=NOW()
     WHERE site_id=$1 AND domain=$2`,
    [siteId, domain, validationStatus, robotsAllowed, active, rssUrl, notes, Math.max(60, Number(retryAfterMinutes) || 720)]
  );
}

export async function markNewsSourceUsed({ siteId, domain } = {}) {
  const connection = await db();
  await connection.query("UPDATE news_sources SET last_used_at=NOW(), use_count=use_count+1, updated_at=NOW() WHERE site_id=$1 AND domain=$2", [siteId, domain]);
}

export async function upsertNewsCandidate(candidate) {
  const connection = await db();
  const result = await connection.query(
    `INSERT INTO news_candidates (id, site_id, source_url, canonical_url, publisher, title, author, published_at, source_published_at, language, industry, credibility_score, novelty_score, relevance_score, image_rights_status, facts_json, duplicate_fingerprint, normalized_url_hash, title_hash, content_fingerprint, candidate_score, source_type, status, rejection_reason)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
     ON CONFLICT (site_id, source_url) DO UPDATE SET canonical_url=EXCLUDED.canonical_url, publisher=EXCLUDED.publisher, title=EXCLUDED.title, author=EXCLUDED.author, source_published_at=EXCLUDED.source_published_at, language=EXCLUDED.language, industry=EXCLUDED.industry, credibility_score=EXCLUDED.credibility_score, novelty_score=EXCLUDED.novelty_score, relevance_score=EXCLUDED.relevance_score, image_rights_status=EXCLUDED.image_rights_status, facts_json=EXCLUDED.facts_json, duplicate_fingerprint=EXCLUDED.duplicate_fingerprint, normalized_url_hash=EXCLUDED.normalized_url_hash, title_hash=EXCLUDED.title_hash, content_fingerprint=EXCLUDED.content_fingerprint, candidate_score=EXCLUDED.candidate_score, source_type=EXCLUDED.source_type, status=CASE WHEN news_candidates.status IN ('used','reserved_for_cycle') THEN news_candidates.status ELSE EXCLUDED.status END, rejection_reason=EXCLUDED.rejection_reason, discovered_at=NOW(), updated_at=NOW()
     RETURNING *`,
    [id("candidate"), candidate.siteId, candidate.sourceUrl, candidate.canonicalUrl, candidate.publisher, candidate.title, candidate.author || null, candidate.publishedAt || null, candidate.language || "en", candidate.industry || null, candidate.credibilityScore || 0, candidate.noveltyScore || 0, candidate.relevanceScore || 0, candidate.imageRightsStatus || "neutral-site-asset", json(candidate.facts || []), candidate.duplicateFingerprint, candidate.normalizedUrlHash, candidate.titleHash, candidate.contentFingerprint, candidate.candidateScore || 0, candidate.sourceType || "trade-media", candidate.status, candidate.rejectionReason || null]
  );
  const saved = asCandidate(result.rows[0]);
  for (const [fingerprint, fingerprintType] of [[saved.normalized_url_hash, "url"], [saved.title_hash, "title"], [saved.content_fingerprint, "content"]]) {
    if (!fingerprint) continue;
    await connection.query("INSERT INTO news_candidate_fingerprints (site_id,fingerprint,candidate_id,fingerprint_type) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING", [candidate.siteId, fingerprint, saved.id, fingerprintType]);
  }
  return saved;
}

export async function listNewsCandidates({ siteId, status, limit = 100 } = {}) {
  const connection = await db();
  const values = [siteId, Math.max(1, Math.min(Number(limit) || 100, 500))];
  const filter = status ? " AND status = $3" : "";
  if (status) values.push(status);
  const result = await connection.query(`SELECT * FROM news_candidates WHERE site_id=$1${filter} ORDER BY candidate_score DESC, source_published_at DESC NULLS LAST LIMIT $2`, values);
  return result.rows.map(asCandidate);
}

export async function findCandidateFingerprint({ siteId, fingerprint, fingerprintType }) {
  const connection = await db();
  const result = await connection.query("SELECT candidate_id FROM news_candidate_fingerprints WHERE site_id=$1 AND fingerprint=$2 AND fingerprint_type=$3 LIMIT 1", [siteId, fingerprint, fingerprintType]);
  return result.rows[0]?.candidate_id || null;
}

export async function startNewsRun({ siteId, runType, cycleStartedAt = null, requestId = null }) {
  const connection = await db();
  const run = { id: id("newsrun"), siteId, runType, cycleStartedAt, requestId };
  await connection.query("INSERT INTO news_publication_runs (id,site_id,run_type,started_at,cycle_started_at,status,request_id) VALUES ($1,$2,$3,NOW(),$4,'running',$5)", [run.id, siteId, runType, cycleStartedAt, requestId]);
  return run;
}

export async function finishNewsRun(run, { status, logs = [], errorSummary = null } = {}) {
  const connection = await db();
  await connection.query("UPDATE news_publication_runs SET finished_at=NOW(),status=$2,logs_json=$3,error_summary=$4 WHERE id=$1", [run.id, status, json(logs), errorSummary]);
}

// A serverless invocation can be terminated before its finally block runs. Recovering
// these rows prevents an expired publish attempt from holding candidates indefinitely.
export async function recoverStaleNewsPublishWork({ siteId, maxAgeMinutes = 10 } = {}) {
  const connection = await db();
  const safeAge = Math.max(5, Math.min(60, Number(maxAgeMinutes) || 10));
  const reason = "publish-attempt-expired-before-completion";
  const [runs, candidates] = await Promise.all([
    connection.query(
      "UPDATE news_publication_runs SET status='retry_pending',finished_at=NOW(),error_summary=$3,logs_json=logs_json || $4::jsonb WHERE site_id=$1 AND run_type IN ('daily-publish','48-hour-publish') AND status='running' AND started_at < NOW() - ($2 * INTERVAL '1 minute') RETURNING id",
      [siteId, safeAge, reason, json([{ status: "recovered", reason }])]
    ),
    connection.query(
      "UPDATE news_candidates SET status='candidate',reserved_at=NULL,rejection_reason=$3,updated_at=NOW() WHERE site_id=$1 AND status='reserved_for_cycle' AND reserved_at < NOW() - ($2 * INTERVAL '1 minute') RETURNING id",
      [siteId, safeAge, reason]
    )
  ]);
  return { recoveredRuns: runs.rowCount || 0, releasedCandidates: candidates.rowCount || 0 };
}

export async function listNewsRuns({ siteId, limit = 30 } = {}) {
  const connection = await db();
  const result = await connection.query("SELECT * FROM news_publication_runs WHERE site_id=$1 ORDER BY started_at DESC LIMIT $2", [siteId, Math.max(1, Math.min(Number(limit) || 30, 100))]);
  return result.rows;
}

export async function getLastSuccessfulNewsPublication(siteId) {
  const connection = await db();
  const result = await connection.query("SELECT * FROM news_publication_runs WHERE site_id=$1 AND run_type IN ('daily-publish','48-hour-publish') AND status='published_success' ORDER BY finished_at DESC LIMIT 1", [siteId]);
  return result.rows[0] || null;
}

export async function reserveNewsCandidate({ siteId, candidateId }) {
  const connection = await db();
  const result = await connection.query("UPDATE news_candidates SET status='reserved_for_cycle',reserved_at=NOW(),updated_at=NOW() WHERE id=$1 AND site_id=$2 AND status='candidate' RETURNING *", [candidateId, siteId]);
  return asCandidate(result.rows[0]);
}

export async function releaseNewsCandidate({ siteId, candidateId, reason }) {
  const connection = await db();
  await connection.query("UPDATE news_candidates SET status='candidate',reserved_at=NULL,rejection_reason=$3,updated_at=NOW() WHERE id=$1 AND site_id=$2 AND status='reserved_for_cycle'", [candidateId, siteId, reason || null]);
}

export async function markNewsCandidateUsed({ siteId, candidateId, articleId }) {
  const connection = await db();
  await connection.query("UPDATE news_candidates SET status='used',used_count=used_count+1,last_used_at=NOW(),used_by_article_id=$3,updated_at=NOW() WHERE id=$1 AND site_id=$2", [candidateId, siteId, articleId]);
}

export async function saveGeneratedNewsArticle(article) {
  const connection = await db();
  const result = await connection.query(
    `INSERT INTO generated_articles (id,site_id,slug,locale,title,meta_title,meta_description,markdown,document_json,content_type,validation_json,status,source_ids,fact_check_json,published_at,canonical_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     ON CONFLICT (slug) DO UPDATE SET site_id=EXCLUDED.site_id,title=EXCLUDED.title,meta_title=EXCLUDED.meta_title,meta_description=EXCLUDED.meta_description,markdown=EXCLUDED.markdown,document_json=EXCLUDED.document_json,content_type=EXCLUDED.content_type,validation_json=EXCLUDED.validation_json,status=EXCLUDED.status,source_ids=EXCLUDED.source_ids,fact_check_json=EXCLUDED.fact_check_json,published_at=EXCLUDED.published_at,canonical_url=EXCLUDED.canonical_url,updated_at=NOW()
     RETURNING *`,
    [article.id || id("newsarticle"), article.siteId, article.slug, article.locale || "en", article.title, article.metaTitle, article.metaDescription, article.markdown || "", json(article.document || {}), article.contentType || "news", json(article.validation || {}), article.status, json(article.sourceIds || []), json(article.factCheck || {}), article.publishedAt || null, article.canonicalUrl || null]
  );
  return result.rows[0];
}

export async function saveNewsDeliveryCheck(check) {
  const connection = await db();
  await connection.query("INSERT INTO news_delivery_checks (id,site_id,article_id,slug,list_http_status,detail_http_status,sitemap_http_status,list_visible,detail_visible,canonical_valid,schema_valid,source_panel_visible,blog_isolated,details_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)", [id("delivery"),check.siteId,check.articleId || null,check.slug,check.listHttpStatus || null,check.detailHttpStatus || null,check.sitemapHttpStatus || null,check.listVisible ?? null,check.detailVisible ?? null,check.canonicalValid ?? null,check.schemaValid ?? null,check.sourcePanelVisible ?? null,check.blogIsolated ?? null,json(check.details || {})]);
}

export async function saveNewsArticleEvidence({ siteId, articleId = null, candidateId = null, productSnapshot = {}, citations = [], media = [], readiness = {} } = {}) {
  const connection = await db();
  const result = await connection.query(
    "INSERT INTO news_article_evidence (id,site_id,article_id,candidate_id,product_snapshot_json,citations_json,media_json,readiness_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [id("evidence"), siteId, articleId, candidateId, json(productSnapshot), json(citations), json(media), json(readiness)]
  );
  return result.rows[0];
}

export async function saveNewsQualityCheck({ siteId, articleId = null, checkType, passed, details = {} } = {}) {
  const connection = await db();
  await connection.query(
    "INSERT INTO news_article_quality_checks (id,site_id,article_id,check_type,passed,details_json) VALUES ($1,$2,$3,$4,$5,$6)",
    [id("quality"), siteId, articleId, checkType, Boolean(passed), json(details)]
  );
}

export async function recordNewsAuditEvent({ siteId, eventType, entityType, entityId = null, details = {} }) {
  const connection = await db();
  await connection.query("INSERT INTO news_audit_events (id,site_id,event_type,entity_type,entity_id,details_json) VALUES ($1,$2,$3,$4,$5,$6)", [id("audit"),siteId,eventType,entityType,entityId,json(details)]);
}

export async function withNewsAutomationLock({ siteId, name, ttlSeconds = 300 }, callback) {
  const connection = await db();
  const ownerId = id("lock");
  const lockName = `news:${name}:${siteId}`;
  const result = await connection.query("INSERT INTO news_operation_locks (lock_name,owner_id,expires_at,updated_at) VALUES ($1,$2,NOW() + ($3 * INTERVAL '1 second'),NOW()) ON CONFLICT (lock_name) DO UPDATE SET owner_id=EXCLUDED.owner_id,expires_at=EXCLUDED.expires_at,updated_at=NOW() WHERE news_operation_locks.expires_at < NOW() RETURNING owner_id", [lockName, ownerId, ttlSeconds]);
  if (result.rows[0]?.owner_id !== ownerId) return { locked: false, reason: "another-run-is-active" };
  try { return await callback(); } finally { await connection.query("DELETE FROM news_operation_locks WHERE lock_name=$1 AND owner_id=$2", [lockName, ownerId]); }
}

export async function getNewsAutomationDashboard(siteId = getNewsSiteConfig().site_id) {
  const [sources, candidates, runs] = await Promise.all([listNewsSources(siteId), listNewsCandidates({ siteId, limit: 20 }), listNewsRuns({ siteId, limit: 20 })]);
  return { siteId, storageMode: newsAutomationStorageMode(), sources, candidates, runs };
}
