-- Private product research and document metadata. No public route reads this table.
CREATE TABLE IF NOT EXISTS product_research_cards (
  product_id TEXT PRIMARY KEY,
  public_name TEXT NOT NULL,
  series TEXT NOT NULL DEFAULT '',
  model TEXT,
  product_type TEXT NOT NULL DEFAULT '',
  factual_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
  supplier_confirmation JSONB NOT NULL DEFAULT '{"confirmed": false}'::jsonb,
  fact_status JSONB NOT NULL DEFAULT '{}'::jsonb,
  proposed_facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  confirmed_facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  public_content_status TEXT NOT NULL DEFAULT 'draft'
    CHECK (public_content_status IN ('draft', 'review', 'published')),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE product_research_cards
  ADD COLUMN IF NOT EXISTS proposed_facts JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE product_research_cards
  ADD COLUMN IF NOT EXISTS confirmed_facts JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS product_research_cards_content_status_idx
  ON product_research_cards (public_content_status, updated_at DESC);

CREATE TABLE IF NOT EXISTS product_technical_documents (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES product_research_cards(product_id) ON DELETE RESTRICT,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  document_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  version TEXT NOT NULL DEFAULT 'draft',
  approval_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (approval_status IN ('pending', 'approved', 'archived')),
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_technical_documents_product_idx
  ON product_technical_documents (product_id, approval_status, updated_at DESC);
