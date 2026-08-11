import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseSsl, databaseUrl } from "../lib/databaseUrl.js";

const { Client } = pg;
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputDir = path.join(process.cwd(), ".backups", `blog-webhook-${timestamp}`);
const client = new Client({ connectionString: databaseUrl(), ssl: databaseSsl(), connectionTimeoutMillis: 10000 });

try {
  await client.connect();
  const blogs = await client.query("SELECT id, type, slug, title, payload, published_at, created_at, updated_at FROM cms_items WHERE type = 'blog' ORDER BY updated_at DESC");
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "cms-blog-items.json"), `${JSON.stringify(blogs.rows, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify({ createdAt: new Date().toISOString(), rowCount: blogs.rowCount, purpose: "Pre-change Blog webhook backup" }, null, 2)}\n`, "utf8");
  console.log(`BLOG_WEBHOOK_BACKUP=${outputDir}`);
} finally {
  await client.end().catch(() => {});
}
