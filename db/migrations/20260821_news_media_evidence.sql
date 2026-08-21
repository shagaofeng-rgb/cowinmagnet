BEGIN;

CREATE TABLE IF NOT EXISTS news_article_evidence (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  article_id TEXT,
  candidate_id TEXT,
  product_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  citations_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  media_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  readiness_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_media_assets (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  article_id TEXT,
  content_hash TEXT,
  storage_key TEXT,
  public_url TEXT,
  source_url TEXT,
  publisher TEXT,
  license_basis TEXT,
  rights_verified_at TIMESTAMPTZ,
  status TEXT NOT NULL,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_article_quality_checks (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  article_id TEXT,
  check_type TEXT NOT NULL,
  passed BOOLEAN NOT NULL,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS news_article_evidence_site_article_idx
  ON news_article_evidence (site_id, article_id, updated_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS news_media_assets_site_hash_idx
  ON news_media_assets (site_id, content_hash) WHERE content_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS news_article_quality_checks_article_idx
  ON news_article_quality_checks (site_id, article_id, created_at DESC);

COMMIT;
