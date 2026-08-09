import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationPath = path.join(root, "db", "migrations", "20260809_product_research_cards.sql");
const importPath = path.join(root, ".data", "product-research-import.json");

function parseEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith("#")) return [];
    return [[match[1], match[2].replace(/^['"]|['"]$/g, "")]];
  }));
}

if (!process.env.DATABASE_URL) {
  const env = parseEnv(await fs.readFile(path.join(root, ".env.production.local"), "utf8"));
  process.env.DATABASE_URL = env.DATABASE_URL || "";
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to import private ProductResearchCards.");

const cards = JSON.parse(await fs.readFile(importPath, "utf8"));
const migration = await fs.readFile(migrationPath, "utf8");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 1, connectionTimeoutMillis: 10000 });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query(migration);
  for (const card of cards) {
    await client.query(
      `INSERT INTO product_research_cards (product_id, public_name, series, model, product_type, factual_sources, supplier_confirmation, fact_status, public_content_status, version)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (product_id) DO UPDATE SET
         public_name = EXCLUDED.public_name,
         series = EXCLUDED.series,
         model = COALESCE(product_research_cards.model, EXCLUDED.model),
         product_type = EXCLUDED.product_type,
         factual_sources = EXCLUDED.factual_sources,
         public_content_status = CASE WHEN product_research_cards.public_content_status = 'published' THEN 'published' ELSE EXCLUDED.public_content_status END,
         updated_at = NOW()`,
      [card.productId, card.publicName, card.series, card.model, card.productType, JSON.stringify(card.factualSources), JSON.stringify(card.supplierConfirmation), JSON.stringify(card.factStatus), card.publicContentStatus, card.version]
    );
  }
  await client.query("COMMIT");
  console.log(JSON.stringify({ imported: cards.length, table: "product_research_cards" }, null, 2));
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
