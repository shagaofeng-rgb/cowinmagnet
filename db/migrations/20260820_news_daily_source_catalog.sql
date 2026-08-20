-- Adds catalog provenance and health state without removing any existing News data.
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

CREATE INDEX IF NOT EXISTS news_sources_validation_idx
  ON news_sources (site_id, validation_status, active, robots_allowed, last_used_at);

-- The old 48-hour records are intentionally retained for audit and interval checks.
-- New code writes daily-discovery and daily-publish run types from the deployed cron.
