import fs from "node:fs/promises";
import path from "node:path";

const input = path.join(process.cwd(), ".tmp-content-remediation-audit.json");
const output = path.join(process.cwd(), "docs", "content-remediation", "content-audit-before.csv");
const payload = JSON.parse((await fs.readFile(input, "utf8")).replace(/^\uFEFF/, ""));
const rows = payload.data?.rows || [];
if (!rows.length) throw new Error("Captured production audit does not contain rows.");
const keys = ["id", "storeType", "slug", "locale", "url", "contentType", "title", "publishedAt", "modifiedAt", "canonical", "robots", "metaTitle", "metaDescription", "ogTitle", "ogDescription", "h1Count", "h2Count", "faqCount", "sourceCount", "wordCount", "imageCount", "jsonLdTypes", "defects", "action"];
const csv = (value = "") => `"${String(Array.isArray(value) ? value.join(";") : value ?? "").replaceAll('"', '""')}"`;
await fs.writeFile(output, `${keys.join(",")}\n${rows.map((row) => keys.map((key) => csv(row[key])).join(",")).join("\n")}\n`);
console.log(JSON.stringify({ rows: rows.length, output }));
