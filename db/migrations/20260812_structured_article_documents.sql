-- Additive, reversible storage for validated public article documents.
ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS document_json JSONB;
ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'news';
ALTER TABLE generated_articles ADD COLUMN IF NOT EXISTS validation_json JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS content_remediation_audits (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  action TEXT NOT NULL,
  defects JSONB NOT NULL DEFAULT '[]'::jsonb,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS content_remediation_audits_content_idx ON content_remediation_audits (content_type, slug, created_at DESC);
