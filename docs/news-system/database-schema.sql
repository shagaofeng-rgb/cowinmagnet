-- Optional PostgreSQL schema for the Cowinmagnet news opportunity system.
-- The current local preview stores JSON/Markdown files under data/news-opportunities.

create table news_sources (
  id bigserial primary key,
  name text not null,
  url text not null unique,
  source_type text not null default 'rss',
  authority_score integer not null default 60,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table news_items (
  id bigserial primary key,
  source_id bigint references news_sources(id),
  title text not null,
  url text not null unique,
  description text,
  author text,
  country text,
  published_at timestamptz,
  retrieved_at timestamptz not null default now(),
  provider text,
  raw_payload jsonb not null default '{}'::jsonb
);

create table news_scores (
  id bigserial primary key,
  news_item_id bigint not null references news_items(id) on delete cascade,
  relevance_score integer not null,
  pain_point_score integer not null,
  industry_value_score integer not null,
  market_value_score integer not null,
  freshness_score integer not null,
  authority_score integer not null,
  content_opportunity_score integer not null,
  final_score integer not null,
  created_at timestamptz not null default now()
);

create table generated_contents (
  id bigserial primary key,
  news_item_id bigint not null references news_items(id) on delete cascade,
  content_title text not null,
  news_summary text not null,
  industry_pain_point_analysis text not null,
  cowinmagnet_viewpoint text not null,
  product_category text not null,
  recommended_products text[] not null default '{}',
  application_scenario text,
  suggested_cta text,
  seo_keywords text[] not null default '{}',
  compliance_note text not null,
  workflow_status text not null default 'generated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table content_images (
  id bigserial primary key,
  generated_content_id bigint not null references generated_contents(id) on delete cascade,
  purpose text not null,
  placement text not null,
  caption text,
  alt_text text,
  source_url text,
  copyright_note text,
  ai_prompt text,
  created_at timestamptz not null default now()
);

create table workflow_events (
  id bigserial primary key,
  generated_content_id bigint not null references generated_contents(id) on delete cascade,
  status text not null,
  actor text not null default 'system',
  note text,
  created_at timestamptz not null default now()
);

create table exports (
  id bigserial primary key,
  generated_content_id bigint references generated_contents(id) on delete set null,
  export_type text not null,
  destination text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
