import crypto from "node:crypto";
import pg from "pg";
import sourceSeed from "../data/news-source-whitelist.json" with { type: "json" };
import { databaseSsl, databaseUrl } from "./databaseUrl.js";

const { Pool } = pg;
const NEWS_DB_TIMEOUT_MS = Number(process.env.NEWS_DB_TIMEOUT_MS || 15000);
let pool;
let schemaPromise;

function configured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!configured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: 3,
      connectionTimeoutMillis: 5000,
      statement_timeout: NEWS_DB_TIMEOUT_MS,
      query_timeout: NEWS_DB_TIMEOUT_MS
    });
  }
  return pool;
}

export function newsOperationsStorageMode() {
  return configured() ? "postgres" : "not-configured";
}

function id(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function json(value) {
  return JSON.stringify(value ?? null);
}

function row(value) {
  return value ? { ...value, facts: value.facts_json, productIds: value.product_ids, secondaryProductIds: value.secondary_product_ids, candidateIds: value.candidate_ids, sourceIds: value.source_ids, secondaryKeywords: value.secondary_keywords_json, factCheck: value.fact_check_json, logs: value.logs_json, queries: value.queries_json } : null;
}

export async function ensureNewsOperationsSchema() {
  const db = getPool();
  if (!db) throw new Error("DATABASE_URL is required for the News operations module.");
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS news_sources (
          id TEXT PRIMARY KEY, domain TEXT NOT NULL UNIQUE, name TEXT NOT NULL, priority SMALLINT NOT NULL,
          rss_url TEXT, allowed BOOLEAN NOT NULL DEFAULT TRUE, active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS news_candidates (
          id TEXT PRIMARY KEY, source_url TEXT NOT NULL UNIQUE, canonical_url TEXT NOT NULL, publisher TEXT NOT NULL,
          title TEXT NOT NULL, author TEXT, published_at TIMESTAMPTZ, discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          language TEXT, country TEXT, industry TEXT, materials JSONB NOT NULL DEFAULT '[]'::jsonb,
          process_stage TEXT, product_families JSONB NOT NULL DEFAULT '[]'::jsonb, credibility_score NUMERIC NOT NULL DEFAULT 0,
          novelty_score NUMERIC NOT NULL DEFAULT 0, relevance_score NUMERIC NOT NULL DEFAULT 0,
          image_rights_status TEXT NOT NULL DEFAULT 'unknown', facts_json JSONB NOT NULL DEFAULT '[]'::jsonb,
          duplicate_fingerprint TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'discovered', used_count INTEGER NOT NULL DEFAULT 0,
          last_used_at TIMESTAMPTZ, rejection_reason TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS news_candidates_status_date_idx ON news_candidates (status, published_at DESC);
        CREATE INDEX IF NOT EXISTS news_candidates_fingerprint_idx ON news_candidates (duplicate_fingerprint);
        CREATE TABLE IF NOT EXISTS editorial_plans (
          id TEXT PRIMARY KEY, scheduled_for TIMESTAMPTZ, industry TEXT, country TEXT, angle TEXT NOT NULL,
          primary_product_id TEXT, secondary_product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
          candidate_ids JSONB NOT NULL DEFAULT '[]'::jsonb, status TEXT NOT NULL DEFAULT 'planned', reason TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS generated_articles (
          id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, locale TEXT NOT NULL DEFAULT 'en', title TEXT NOT NULL,
          meta_title TEXT NOT NULL, meta_description TEXT NOT NULL, html TEXT NOT NULL DEFAULT '', markdown TEXT NOT NULL DEFAULT '',
          primary_keyword TEXT, secondary_keywords_json JSONB NOT NULL DEFAULT '[]'::jsonb, product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
          industry TEXT, country TEXT, source_ids JSONB NOT NULL DEFAULT '[]'::jsonb, hero_media_id TEXT,
          status TEXT NOT NULL DEFAULT 'draft', similarity_score NUMERIC NOT NULL DEFAULT 0,
          fact_check_json JSONB NOT NULL DEFAULT '{}'::jsonb, published_at TIMESTAMPTZ, canonical_url TEXT,
          rollback_snapshot JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS generated_articles_status_date_idx ON generated_articles (status, published_at DESC);
        CREATE TABLE IF NOT EXISTS article_sources (
          article_id TEXT NOT NULL REFERENCES generated_articles(id) ON DELETE CASCADE,
          candidate_id TEXT REFERENCES news_candidates(id) ON DELETE SET NULL, source_url TEXT NOT NULL,
          publisher TEXT NOT NULL, published_at TIMESTAMPTZ, usage_note TEXT NOT NULL, PRIMARY KEY (article_id, source_url)
        );
        CREATE TABLE IF NOT EXISTS news_publication_runs (
          id TEXT PRIMARY KEY, run_type TEXT NOT NULL, started_at TIMESTAMPTZ NOT NULL, finished_at TIMESTAMPTZ,
          status TEXT NOT NULL, logs_json JSONB NOT NULL DEFAULT '[]'::jsonb, error_summary TEXT
        );
        CREATE TABLE IF NOT EXISTS news_indexing_observations (
          id TEXT PRIMARY KEY, article_id TEXT NOT NULL REFERENCES generated_articles(id) ON DELETE CASCADE,
          checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), sitemap_present BOOLEAN, http_status INTEGER,
          robots_indexable BOOLEAN, canonical_valid BOOLEAN, structured_data_valid BOOLEAN,
          search_console_state TEXT NOT NULL DEFAULT 'unknown', impressions INTEGER, clicks INTEGER, queries_json JSONB NOT NULL DEFAULT '[]'::jsonb
        );
      `);
      for (const source of sourceSeed) {
        await db.query(
          `INSERT INTO news_sources (id, domain, name, priority, rss_url, allowed, active)
           VALUES ($1, $2, $3, $4, $5, TRUE, TRUE)
           ON CONFLICT (domain) DO UPDATE SET name = EXCLUDED.name, priority = EXCLUDED.priority, rss_url = EXCLUDED.rss_url, updated_at = NOW()`,
          [id("source"), source.domain, source.name, source.priority, source.rssUrl]
        );
      }
      // Generic government feeds create a high volume of unrelated items. Keep their
      // historic records, but do not treat them as an active research source.
      await db.query("UPDATE news_sources SET active = FALSE, allowed = FALSE, updated_at = NOW() WHERE domain = ANY($1::text[])", [["gov.uk", "energy.gov"]]);
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  await schemaPromise;
}

async function dbOrThrow() {
  await ensureNewsOperationsSchema();
  return getPool();
}

export async function listNewsSources() {
  const db = await dbOrThrow();
  const result = await db.query("SELECT id, domain, name, priority, rss_url, allowed, active, updated_at FROM news_sources ORDER BY priority, domain");
  return result.rows.map((item) => ({ ...item, rssUrl: item.rss_url }));
}

export async function upsertNewsCandidate(candidate) {
  const db = await dbOrThrow();
  const result = await db.query(
    `INSERT INTO news_candidates (id, source_url, canonical_url, publisher, title, author, published_at, language, country, industry, materials, process_stage, product_families, credibility_score, novelty_score, relevance_score, image_rights_status, facts_json, duplicate_fingerprint, status, rejection_reason)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
     ON CONFLICT (source_url) DO UPDATE SET discovered_at = NOW(), updated_at = NOW(), canonical_url = EXCLUDED.canonical_url,
       publisher = EXCLUDED.publisher, title = EXCLUDED.title, author = EXCLUDED.author, published_at = EXCLUDED.published_at,
       language = EXCLUDED.language, country = EXCLUDED.country, industry = EXCLUDED.industry, materials = EXCLUDED.materials,
       process_stage = EXCLUDED.process_stage, product_families = EXCLUDED.product_families,
       credibility_score = EXCLUDED.credibility_score, novelty_score = EXCLUDED.novelty_score, relevance_score = EXCLUDED.relevance_score,
       image_rights_status = EXCLUDED.image_rights_status, facts_json = EXCLUDED.facts_json,
       duplicate_fingerprint = EXCLUDED.duplicate_fingerprint, status = EXCLUDED.status, rejection_reason = EXCLUDED.rejection_reason
     RETURNING *`,
    [id("candidate"), candidate.sourceUrl, candidate.canonicalUrl || candidate.sourceUrl, candidate.publisher, candidate.title, candidate.author || "", candidate.publishedAt || null, candidate.language || "en", candidate.country || "", candidate.industry || "", json(candidate.materials || []), candidate.processStage || "", json(candidate.productFamilies || []), candidate.credibilityScore || 0, candidate.noveltyScore || 0, candidate.relevanceScore || 0, candidate.imageRightsStatus || "unknown", json(candidate.facts || []), candidate.duplicateFingerprint, candidate.status || "discovered", candidate.rejectionReason || null]
  );
  return row(result.rows[0]);
}

export async function listNewsCandidates({ status, limit = 100 } = {}) {
  const db = await dbOrThrow();
  const result = await db.query(
    `SELECT * FROM news_candidates ${status ? "WHERE status = $1" : ""} ORDER BY published_at DESC NULLS LAST, discovered_at DESC LIMIT $${status ? 2 : 1}`,
    status ? [status, limit] : [limit]
  );
  return result.rows.map(row);
}

export async function saveEditorialPlan(plan) {
  const db = await dbOrThrow();
  const result = await db.query(
    `INSERT INTO editorial_plans (id, scheduled_for, industry, country, angle, primary_product_id, secondary_product_ids, candidate_ids, status, reason)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (id) DO UPDATE SET scheduled_for=EXCLUDED.scheduled_for, industry=EXCLUDED.industry, country=EXCLUDED.country, angle=EXCLUDED.angle, primary_product_id=EXCLUDED.primary_product_id, secondary_product_ids=EXCLUDED.secondary_product_ids, candidate_ids=EXCLUDED.candidate_ids, status=EXCLUDED.status, reason=EXCLUDED.reason, updated_at=NOW()
     RETURNING *`,
    [plan.id || id("plan"), plan.scheduledFor || null, plan.industry || "", plan.country || "", plan.angle, plan.primaryProductId || "", json(plan.secondaryProductIds || []), json(plan.candidateIds || []), plan.status || "planned", plan.reason || ""]
  );
  return row(result.rows[0]);
}

export async function listEditorialPlans(limit = 50) {
  const db = await dbOrThrow();
  const result = await db.query("SELECT * FROM editorial_plans ORDER BY scheduled_for NULLS LAST, created_at DESC LIMIT $1", [limit]);
  return result.rows.map(row);
}

export async function saveGeneratedArticle(article) {
  const db = await dbOrThrow();
  const result = await db.query(
    `INSERT INTO generated_articles (id, slug, locale, title, meta_title, meta_description, html, markdown, primary_keyword, secondary_keywords_json, product_ids, industry, country, source_ids, hero_media_id, status, similarity_score, fact_check_json, published_at, canonical_url, rollback_snapshot)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
     ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, meta_title=EXCLUDED.meta_title, meta_description=EXCLUDED.meta_description, html=EXCLUDED.html, markdown=EXCLUDED.markdown, primary_keyword=EXCLUDED.primary_keyword, secondary_keywords_json=EXCLUDED.secondary_keywords_json, product_ids=EXCLUDED.product_ids, industry=EXCLUDED.industry, country=EXCLUDED.country, source_ids=EXCLUDED.source_ids, hero_media_id=EXCLUDED.hero_media_id, status=EXCLUDED.status, similarity_score=EXCLUDED.similarity_score, fact_check_json=EXCLUDED.fact_check_json, published_at=EXCLUDED.published_at, canonical_url=EXCLUDED.canonical_url, rollback_snapshot=EXCLUDED.rollback_snapshot, updated_at=NOW()
     RETURNING *`,
    [article.id || id("article"), article.slug, article.locale || "en", article.title, article.metaTitle || article.title, article.metaDescription || "", article.html || "", article.markdown || "", article.primaryKeyword || "", json(article.secondaryKeywords || []), json(article.productIds || []), article.industry || "", article.country || "", json(article.sourceIds || []), article.heroMediaId || "", article.status || "draft", article.similarityScore || 0, json(article.factCheck || {}), article.publishedAt || null, article.canonicalUrl || "", json(article.rollbackSnapshot || null)]
  );
  return row(result.rows[0]);
}

export async function listGeneratedArticles({ status, limit = 100 } = {}) {
  const db = await dbOrThrow();
  const result = await db.query(
    `SELECT * FROM generated_articles ${status ? "WHERE status = $1" : ""} ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $${status ? 2 : 1}`,
    status ? [status, limit] : [limit]
  );
  return result.rows.map(row);
}

export async function saveArticleSources(articleId, sources = []) {
  const db = await dbOrThrow();
  for (const source of sources) {
    if (!source?.sourceUrl) continue;
    await db.query(
      `INSERT INTO article_sources (article_id, candidate_id, source_url, publisher, published_at, usage_note)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (article_id, source_url) DO UPDATE SET publisher=EXCLUDED.publisher, published_at=EXCLUDED.published_at, usage_note=EXCLUDED.usage_note`,
      [articleId, source.candidateId || null, source.sourceUrl, source.publisher || "Source", source.publishedAt || null, source.usageNote || "Fact source"]
    );
  }
}

export async function startNewsPublicationRun(runType) {
  const db = await dbOrThrow();
  const run = { id: id("run"), runType, startedAt: new Date().toISOString() };
  await db.query("INSERT INTO news_publication_runs (id, run_type, started_at, status) VALUES ($1,$2,$3,'running')", [run.id, run.runType, run.startedAt]);
  return run;
}

export async function finishNewsPublicationRun(run, { status, logs = [], errorSummary = null } = {}) {
  const db = await dbOrThrow();
  await db.query("UPDATE news_publication_runs SET finished_at = NOW(), status = $2, logs_json = $3, error_summary = $4 WHERE id = $1", [run.id, status, json(logs), errorSummary]);
}

export async function listNewsPublicationRuns(limit = 30) {
  const db = await dbOrThrow();
  const result = await db.query("SELECT * FROM news_publication_runs ORDER BY started_at DESC LIMIT $1", [limit]);
  return result.rows.map(row);
}

export async function withNewsPublicationLock(callback) {
  const db = await dbOrThrow();
  const client = await db.connect();
  try {
    const locked = await client.query("SELECT pg_try_advisory_lock(hashtext('cowinmagnet-news-operations')) AS locked");
    if (!locked.rows[0]?.locked) return { locked: false };
    try {
      return await callback(client);
    } finally {
      await client.query("SELECT pg_advisory_unlock(hashtext('cowinmagnet-news-operations'))");
    }
  } finally {
    client.release();
  }
}

export async function saveIndexingObservation(observation) {
  const db = await dbOrThrow();
  await db.query(
    `INSERT INTO news_indexing_observations (id, article_id, sitemap_present, http_status, robots_indexable, canonical_valid, structured_data_valid, search_console_state, impressions, clicks, queries_json)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
    [id("index"), observation.articleId, observation.sitemapPresent ?? null, observation.httpStatus ?? null, observation.robotsIndexable ?? null, observation.canonicalValid ?? null, observation.structuredDataValid ?? null, observation.searchConsoleState || "unknown", observation.impressions ?? null, observation.clicks ?? null, json(observation.queries || [])]
  );
}
