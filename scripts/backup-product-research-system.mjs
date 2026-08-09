import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(root, ".backups", "product-research-system", timestamp);

function parseEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).flatMap((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || match[1].startsWith("#")) return [];
    return [[match[1], match[2].replace(/^['"]|['"]$/g, "")]];
  }));
}

async function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const env = parseEnv(await fs.readFile(path.join(root, ".env.production.local"), "utf8"));
    return env.DATABASE_URL || "";
  } catch {
    return "";
  }
}

await fs.mkdir(backupDir, { recursive: true });
for (const file of ["data/products.ts", "data/productCatalog.js", ".data/cms-items.json"]) {
  try {
    await fs.copyFile(path.join(root, file), path.join(backupDir, path.basename(file)));
  } catch {
    // The fallback CMS file is optional in database-backed environments.
  }
}

const url = await databaseUrl();
let databaseExported = false;
if (url) {
  const pool = new pg.Pool({ connectionString: url, ssl: { rejectUnauthorized: false }, max: 1, connectionTimeoutMillis: 8000 });
  try {
    const result = await pool.query("SELECT id, type, slug, title, category_id, category_title, payload, published_at, created_at, updated_at FROM cms_items WHERE type = $1 ORDER BY created_at", ["product"]);
    await fs.writeFile(path.join(backupDir, "cms-products.json"), `${JSON.stringify(result.rows, null, 2)}\n`, "utf8");
    databaseExported = true;
  } finally {
    await pool.end();
  }
}

await fs.writeFile(path.join(backupDir, "manifest.json"), `${JSON.stringify({ createdAt: new Date().toISOString(), databaseExported, purpose: "Pre-product-research migration backup" }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ backupDir, databaseExported }, null, 2));
