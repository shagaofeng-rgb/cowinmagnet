-- Additive migration for the autonomous News operations module.
-- The runtime bootstrap in lib/newsOperationsStore.js uses the same idempotent definitions.
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

-- Retain historic candidates while deactivating overly broad legacy feeds.
UPDATE news_sources
SET active = FALSE, allowed = FALSE, updated_at = NOW()
WHERE domain IN ('gov.uk', 'energy.gov');
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
