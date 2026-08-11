-- Additive, reversible migration for site-isolated News automation.
-- It does not delete CMS, Blog, News, candidate or audit records.

ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS site_id TEXT;
ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'trade-media';
ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS source_trust_score NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS allowed_topics JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE news_sources ADD COLUMN IF NOT EXISTS allowed_languages JSONB NOT NULL DEFAULT '["en"]'::jsonb;
UPDATE news_sources SET site_id = 'cowinmagnet-production' WHERE site_id IS NULL;
ALTER TABLE news_sources ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE news_sources DROP CONSTRAINT IF EXISTS news_sources_domain_key;
CREATE UNIQUE INDEX IF NOT EXISTS news_sources_site_domain_idx ON news_sources (site_id, domain);

ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS site_id TEXT;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS normalized_url_hash TEXT;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS title_hash TEXT;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS content_fingerprint TEXT;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS candidate_score NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS source_type TEXT;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS source_published_at TIMESTAMPTZ;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS reserved_at TIMESTAMPTZ;
ALTER TABLE news_candidates ADD COLUMN IF NOT EXISTS used_by_article_id TEXT;
UPDATE news_candidates SET site_id = 'cowinmagnet-production' WHERE site_id IS NULL;
UPDATE news_candidates SET source_published_at = published_at WHERE source_published_at IS NULL;
-- Preserve historical candidates but require a fresh, site-scoped ingest before any new publisher can use them.
UPDATE news_candidates
SET status = 'rejected', rejection_reason = 'legacy-candidate-requires-reingest'
WHERE status IN ('verified', 'candidate', 'reserved_for_cycle') AND content_fingerprint IS NULL;
ALTER TABLE news_candidates ALTER COLUMN site_id SET NOT NULL;
ALTER TABLE news_candidates DROP CONSTRAINT IF EXISTS news_candidates_source_url_key;
CREATE UNIQUE INDEX IF NOT EXISTS news_candidates_site_source_url_idx ON news_candidates (site_id, source_url);
CREATE INDEX IF NOT EXISTS news_candidates_site_state_score_idx ON news_candidates (site_id, status, candidate_score DESC, source_published_at DESC);
CREATE INDEX IF NOT EXISTS news_candidates_site_fingerprint_idx ON news_candidates (site_id, content_fingerprint);

ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS site_id TEXT;
UPDATE generated_articles SET site_id = 'cowinmagnet-production' WHERE site_id IS NULL;
ALTER TABLE generated_articles ALTER COLUMN site_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS generated_articles_site_status_date_idx ON generated_articles (site_id, status, published_at DESC);

ALTER TABLE editorial_plans ADD COLUMN IF NOT EXISTS site_id TEXT;
UPDATE editorial_plans SET site_id = 'cowinmagnet-production' WHERE site_id IS NULL;
ALTER TABLE editorial_plans ALTER COLUMN site_id SET NOT NULL;

ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS site_id TEXT;
ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS cycle_started_at TIMESTAMPTZ;
ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS attempt INTEGER NOT NULL DEFAULT 0;
ALTER TABLE news_publication_runs ADD COLUMN IF NOT EXISTS request_id TEXT;
UPDATE news_publication_runs SET site_id = 'cowinmagnet-production' WHERE site_id IS NULL;
ALTER TABLE news_publication_runs ALTER COLUMN site_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS news_publication_runs_site_type_date_idx ON news_publication_runs (site_id, run_type, started_at DESC);

CREATE TABLE IF NOT EXISTS news_candidate_fingerprints (
  site_id TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  candidate_id TEXT REFERENCES news_candidates(id) ON DELETE CASCADE,
  fingerprint_type TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (site_id, fingerprint, fingerprint_type)
);

CREATE TABLE IF NOT EXISTS news_product_theme_windows (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  theme_id TEXT NOT NULL,
  product_url TEXT,
  product_name TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS news_product_theme_windows_site_active_idx ON news_product_theme_windows (site_id, status, starts_at, ends_at);

CREATE TABLE IF NOT EXISTS news_delivery_checks (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  article_id TEXT,
  slug TEXT NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  list_http_status INTEGER,
  detail_http_status INTEGER,
  sitemap_http_status INTEGER,
  list_visible BOOLEAN,
  detail_visible BOOLEAN,
  canonical_valid BOOLEAN,
  schema_valid BOOLEAN,
  source_panel_visible BOOLEAN,
  blog_isolated BOOLEAN,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS news_delivery_checks_site_slug_date_idx ON news_delivery_checks (site_id, slug, checked_at DESC);

CREATE TABLE IF NOT EXISTS news_audit_events (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS news_audit_events_site_date_idx ON news_audit_events (site_id, created_at DESC);

-- Rollback: remove only the newly added indexes/tables/columns after confirming no new automation rows depend on them.
