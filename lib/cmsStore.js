import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import cmsFallbackItems from "../data/cmsFallback.json" with { type: "json" };
import { databasePoolMax, databaseSsl, databaseUrl, withDatabaseRetry } from "./databaseUrl.js";
import { markSitemapDirty } from "./sitemap/storage.js";
import { sanitizeArticleContent } from "./articleContent.js";

const { Pool } = pg;

const DATA_DIR = process.env.VERCEL ? path.join("/tmp", "cowinmagnet-cms") : path.join(process.cwd(), ".data");
const CMS_FILE = path.join(DATA_DIR, "cms-items.json");
const CMS_DB_CONNECTION_TIMEOUT_MS = Number(process.env.CMS_DB_CONNECTION_TIMEOUT_MS || 5000);
const CMS_DB_STATEMENT_TIMEOUT_MS = Number(process.env.CMS_DB_STATEMENT_TIMEOUT_MS || 15000);
const CMS_DB_QUERY_TIMEOUT_MS = Number(process.env.CMS_DB_QUERY_TIMEOUT_MS || 15000);
const CMS_DB_READ_TIMEOUT_MS = Number(process.env.CMS_DB_READ_TIMEOUT_MS || 8000);
const CMS_READ_CACHE_MS = Math.max(0, Number(process.env.CMS_READ_CACHE_MS || 30000));

let pool;
let schemaPromise;
const cmsReadCache = new Map();

function invalidateCmsReadCache(type) {
  for (const key of cmsReadCache.keys()) {
    if (key.startsWith(`${type}:`)) cmsReadCache.delete(key);
  }
}

function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!isDatabaseConfigured()) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      ssl: databaseSsl(),
      max: databasePoolMax(),
      connectionTimeoutMillis: CMS_DB_CONNECTION_TIMEOUT_MS,
      idleTimeoutMillis: 10000,
      statement_timeout: CMS_DB_STATEMENT_TIMEOUT_MS,
      query_timeout: CMS_DB_QUERY_TIMEOUT_MS
    });
  }
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  if (!db) return;
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS cms_items (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          slug TEXT NOT NULL,
          title TEXT NOT NULL,
          category_id TEXT,
          category_title TEXT,
          payload JSONB NOT NULL,
          published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await db.query("CREATE UNIQUE INDEX IF NOT EXISTS cms_items_type_slug_idx ON cms_items (type, slug)");
      await db.query("CREATE INDEX IF NOT EXISTS cms_items_type_date_idx ON cms_items (type, published_at DESC)");
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }
  return schemaPromise;
}

async function notifySitemapChange(item, action) {
  try {
    await markSitemapDirty({ type: item.type, slug: item.slug, action });
  } catch (error) {
    console.warn("[cmsStore] Sitemap dirty marker failed", {
      type: item.type,
      slug: item.slug,
      action,
      message: error?.message || String(error)
    });
  }
}

async function readFileItems() {
  try {
    const text = await fs.readFile(CMS_FILE, "utf8");
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function readBundledFallbackItems(type) {
  return Array.isArray(cmsFallbackItems) ? cmsFallbackItems.filter((item) => item.type === type) : [];
}

async function writeFileItems(items) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CMS_FILE, JSON.stringify(items, null, 2), "utf8");
}

export function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function parseLines(value = "") {
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseSpecifications(value = "") {
  return parseLines(value).map((line) => {
    const parts = line.split(/[:：]/);
    if (parts.length < 2) return ["Specification", line.trim()];
    return [parts.shift().trim(), parts.join(":").trim()];
  });
}

export function textToSections(value = "") {
  return sanitizeArticleContent(value)
    .split(/\n\s*\n/)
    .map((block, index) => {
      const lines = block
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return null;
      if (lines.length === 1) {
        return { heading: index === 0 ? "Industry Update" : `Update Note ${index + 1}`, body: lines[0] };
      }
      return { heading: lines[0].replace(/^#{1,6}\s+/, ""), body: lines.slice(1).join("\n") };
    })
    .filter(Boolean);
}

export async function fileToDataUrl(file) {
  if (!file || !file.size) return "";
  const bytes = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${bytes.toString("base64")}`;
}

export async function saveCmsItem(item) {
  const now = new Date().toISOString();
  const privateProductFields = item.type === "product"
    ? { sourceUrls: undefined, sourceSite: undefined, factualSources: undefined, supplierConfirmation: undefined, factStatus: undefined, proposedFacts: undefined }
    : {};
  const normalized = {
    ...item,
    ...privateProductFields,
    id: item.id || `${item.type}-${item.slug}`,
    status: item.status || "published",
    createdAt: item.createdAt || now,
    updatedAt: now
  };
  invalidateCmsReadCache(normalized.type);

  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query(
      `
        INSERT INTO cms_items (id, type, slug, title, category_id, category_title, payload, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (type, slug) DO UPDATE SET
          title = EXCLUDED.title,
          category_id = EXCLUDED.category_id,
          category_title = EXCLUDED.category_title,
          payload = EXCLUDED.payload,
          published_at = EXCLUDED.published_at,
          updated_at = EXCLUDED.updated_at
      `,
      [
        normalized.id,
        normalized.type,
        normalized.slug,
        normalized.title,
        normalized.categoryId || "",
        normalized.categoryTitle || "",
        normalized,
        normalized.publishedAt || now,
        normalized.createdAt,
        normalized.updatedAt
      ]
    );
    await notifySitemapChange(normalized, "save");
    return normalized;
  }

  const items = await readFileItems();
  const nextItems = items.filter((existing) => !(existing.type === normalized.type && existing.slug === normalized.slug));
  nextItems.push(normalized);
  await writeFileItems(nextItems);
  await notifySitemapChange(normalized, "save");
  return normalized;
}

export async function getCmsItemBySlug(type, slug, { includeInactive = false } = {}) {
  const items = await getCmsItems(type, { includeInactive });
  return items.find((item) => item.slug === slug) || null;
}

function visibleItems(items, includeInactive) {
  return includeInactive ? items : items.filter((item) => !["offline", "draft", "archived"].includes(item.status));
}

async function withTimeout(promise, timeoutMs, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function readDatabaseItems(type) {
  const db = getPool();
  if (!db) return null;

  const result = await db.query(
    `
      SELECT payload
      FROM cms_items
      WHERE type = $1
      ORDER BY published_at DESC, created_at DESC
    `,
    [type]
  );
  return result.rows.map((row) => row.payload);
}

export async function getCmsItems(type, { includeInactive = false } = {}) {
  const cacheKey = `${type}:${includeInactive ? "all" : "public"}`;
  const cached = cmsReadCache.get(cacheKey);
  if (cached?.value && cached.expiresAt > Date.now()) return cached.value;
  if (cached?.promise) return cached.promise;

  const promise = loadCmsItems(type, includeInactive);
  cmsReadCache.set(cacheKey, { promise });
  try {
    const value = await promise;
    cmsReadCache.set(cacheKey, { value, expiresAt: Date.now() + CMS_READ_CACHE_MS });
    return value;
  } catch (error) {
    cmsReadCache.delete(cacheKey);
    throw error;
  }
}

async function loadCmsItems(type, includeInactive) {
  if (getPool()) {
    try {
      const databaseItems = await withTimeout(
        withDatabaseRetry(() => readDatabaseItems(type), { attempts: 2, delayMs: 120 }),
        CMS_DB_READ_TIMEOUT_MS,
        `cms_items ${type} read`
      );
      return visibleItems(databaseItems || [], includeInactive);
    } catch (error) {
      console.warn(`[cmsStore] Falling back to local CMS items for ${type}: ${error?.message || error}`);
    }
  }

  const items = await readFileItems();
  const localItems = items.filter((item) => item.type === type);
  const fallbackItems = localItems.length ? localItems : readBundledFallbackItems(type);
  return visibleItems(fallbackItems, includeInactive)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
}

export async function updateCmsItemStatus(type, slug, status) {
  invalidateCmsReadCache(type);
  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query(
      `
        UPDATE cms_items
        SET payload = jsonb_set(payload, '{status}', to_jsonb($3::text), true),
            updated_at = NOW()
        WHERE type = $1 AND slug = $2
      `,
      [type, slug, status]
    );
    await notifySitemapChange({ type, slug }, status);
    return;
  }

  const items = await readFileItems();
  const nextItems = items.map((item) =>
    item.type === type && item.slug === slug ? { ...item, status, updatedAt: new Date().toISOString() } : item
  );
  await writeFileItems(nextItems);
  await notifySitemapChange({ type, slug }, status);
}

export async function deleteCmsItem(type, slug) {
  invalidateCmsReadCache(type);
  const db = getPool();
  if (db) {
    await ensureSchema();
    await db.query("DELETE FROM cms_items WHERE type = $1 AND slug = $2", [type, slug]);
    await notifySitemapChange({ type, slug }, "delete");
    return;
  }

  const items = await readFileItems();
  await writeFileItems(items.filter((item) => !(item.type === type && item.slug === slug)));
  await notifySitemapChange({ type, slug }, "delete");
}

export async function getCmsProductCategories(staticCategories = []) {
  const products = await getCmsItems("product");
  const map = new Map(staticCategories.map((category) => [category.id, { ...category, products: [...category.products] }]));

  products.forEach((product) => {
    const categoryId = product.categoryId || "uploaded-products";
    if (!map.has(categoryId)) {
      map.set(categoryId, {
        id: categoryId,
        title: product.categoryTitle || "Uploaded Products",
        description: product.categoryDescription || "Products uploaded from the Cowinmagnet admin backend.",
        products: []
      });
    }
    const category = map.get(categoryId);
    category.products.push(product);
  });

  return [...map.values()];
}

export function cmsStorageMode() {
  return isDatabaseConfigured() ? "database" : "local-file";
}
