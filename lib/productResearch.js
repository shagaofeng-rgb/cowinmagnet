import pg from "pg";
import { databaseSsl, databaseUrl } from "@/lib/databaseUrl";

const { Pool } = pg;
let pool;

function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: 2,
      connectionTimeoutMillis: 5000,
      statement_timeout: 10000,
      query_timeout: 10000
    });
  }
  return pool;
}

function normalizeFacts(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((fact) => ({ label: String(fact?.label || "").trim(), value: String(fact?.value || "").trim() }))
    .filter((fact) => fact.label && fact.value)
    .slice(0, 60);
}

export async function getProductResearchCard(productId) {
  const db = getPool();
  if (!db) return null;
  const result = await db.query("SELECT * FROM product_research_cards WHERE product_id = $1", [productId]);
  return result.rows[0] || null;
}

export async function getProductResearchCards() {
  const db = getPool();
  if (!db) return [];
  const result = await db.query(`
    SELECT product_id, public_name, series, model, product_type, supplier_confirmation,
      fact_status, public_content_status, version, created_at, updated_at,
      jsonb_array_length(factual_sources) AS source_count,
      jsonb_array_length(confirmed_facts) AS confirmed_fact_count
    FROM product_research_cards
    ORDER BY series, public_name
  `);
  return result.rows;
}

export async function getConfirmedProductFacts(productId) {
  const db = getPool();
  if (!db) return [];
  try {
    const result = await db.query(`
      SELECT confirmed_facts
      FROM product_research_cards
      WHERE product_id = $1
        AND public_content_status = 'published'
        AND COALESCE((supplier_confirmation->>'confirmed')::boolean, false) = true
    `, [productId]);
    return normalizeFacts(result.rows[0]?.confirmed_facts);
  } catch (error) {
    console.error("[product-research] confirmed fact lookup failed; withholding technical values", {
      productId,
      message: error?.message || String(error)
    });
    return [];
  }
}

export async function getConfirmedProductFactsMap(productIds) {
  const db = getPool();
  const map = new Map();
  const ids = [...new Set((productIds || []).map(String).filter(Boolean))];
  if (!db || !ids.length) return map;
  try {
    const result = await db.query(`
      SELECT product_id, confirmed_facts
      FROM product_research_cards
      WHERE product_id = ANY($1::text[])
        AND public_content_status = 'published'
        AND COALESCE((supplier_confirmation->>'confirmed')::boolean, false) = true
    `, [ids]);
    for (const row of result.rows) map.set(row.product_id, normalizeFacts(row.confirmed_facts));
  } catch (error) {
    console.error("[product-research] confirmed fact batch lookup failed; withholding technical values", {
      productCount: ids.length,
      message: error?.message || String(error)
    });
  }
  return map;
}

export async function saveProductResearchReview(productId, update) {
  const db = getPool();
  if (!db) throw new Error("Private product research storage requires DATABASE_URL.");
  const status = ["draft", "review", "published"].includes(update.publicContentStatus) ? update.publicContentStatus : "review";
  const facts = normalizeFacts(update.confirmedFacts);
  const proposedFacts = normalizeFacts(update.proposedFacts);
  const confirmation = {
    confirmed: Boolean(update.supplierConfirmed),
    approvedDatasheetUrl: String(update.approvedDatasheetUrl || "").trim(),
    approvedDrawingUrl: String(update.approvedDrawingUrl || "").trim(),
    approvedBy: String(update.approvedBy || "").trim(),
    approvedAt: update.supplierConfirmed ? new Date().toISOString() : ""
  };
  const result = await db.query(`
    UPDATE product_research_cards
    SET supplier_confirmation = $2,
        confirmed_facts = $3,
        public_content_status = $4,
        proposed_facts = CASE WHEN jsonb_array_length($5::jsonb) > 0 THEN $5::jsonb ELSE proposed_facts END,
        version = version + 1,
        updated_at = NOW()
    WHERE product_id = $1
    RETURNING product_id, public_content_status, supplier_confirmation, confirmed_facts, version, updated_at
  `, [productId, JSON.stringify(confirmation), JSON.stringify(facts), status, JSON.stringify(proposedFacts)]);
  if (result.rows[0]) return result.rows[0];

  const created = await db.query(`
    INSERT INTO product_research_cards (product_id, public_name, series, model, product_type, supplier_confirmation, confirmed_facts, proposed_facts, public_content_status)
    VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8)
    RETURNING product_id, public_content_status, supplier_confirmation, confirmed_facts, version, updated_at
  `, [
    productId,
    String(update.publicName || productId),
    String(update.series || "Uploaded Products"),
    String(update.productType || "unclassified"),
    JSON.stringify(confirmation),
    JSON.stringify(facts),
    JSON.stringify(proposedFacts),
    status
  ]);
  return created.rows[0];
}

export function canPublishCmsProduct(researchCard) {
  const confirmed = Boolean(researchCard?.supplier_confirmation?.confirmed || researchCard?.supplier_confirmation?.confirmed === "true");
  return confirmed && researchCard?.public_content_status === "published";
}
