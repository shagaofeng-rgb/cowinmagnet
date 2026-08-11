import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1
});

async function rows(sql) {
  return (await pool.query(sql)).rows;
}

try {
  const result = {
    config: {
      autopublish: process.env.NEWS_AUTOPUBLISH_ENABLED,
      hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.NEWS_LLM_MODEL || null
    },
    runs: await rows(`
      SELECT run_type, status, started_at, finished_at, error_summary, logs_json
      FROM news_publication_runs
      ORDER BY started_at DESC
      LIMIT 12
    `),
    candidateCounts: await rows(`
      SELECT status, COUNT(1)::int AS count
      FROM news_candidates
      GROUP BY status
      ORDER BY status
    `),
    planCounts: await rows(`
      SELECT status, COUNT(1)::int AS count
      FROM editorial_plans
      GROUP BY status
      ORDER BY status
    `),
    articles: await rows(`
      SELECT slug, title, status, published_at, created_at, industry
      FROM generated_articles
      ORDER BY created_at DESC
      LIMIT 8
    `),
    cms: await rows(`
      SELECT slug, title, payload ->> 'status' AS status, published_at, updated_at
      FROM cms_items
      WHERE type = 'news'
      ORDER BY published_at DESC NULLS LAST, updated_at DESC
      LIMIT 5
    `)
  };

  console.log(JSON.stringify(result, null, 2));
} finally {
  await pool.end();
}
