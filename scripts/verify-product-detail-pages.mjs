import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "data", "products.ts"), "utf8");
const declaration = source.indexOf("export const products");
const start = source.indexOf("[", source.indexOf("=", declaration));
const end = source.lastIndexOf("]; ");
const safeEnd = end === -1 ? source.lastIndexOf("];") : end;
const products = JSON.parse(source.slice(start, safeEnd + 1).replace(/,\s*([}\]])/g, "$1"));
const baseUrlArgument = process.argv.find((argument) => argument.startsWith("--base-url="));
const baseUrl = (baseUrlArgument?.slice("--base-url=".length) || process.env.PRODUCT_VERIFY_BASE_URL || "http://127.0.0.1:3103").replace(/\/$/, "");
const locale = process.env.PRODUCT_VERIFY_LOCALE || "en";
const failures = [];

for (const product of products) {
  const url = `${baseUrl}/${locale}/products/${product.slug}`;
  try {
    const response = await fetch(url, { redirect: "manual" });
    const html = await response.text();
    const h1Matches = html.match(/<h1(?:\s[^>]*)?>/g) || [];
    const checks = [
      [response.status === 200, `status ${response.status}`],
      [h1Matches.length === 1, `expected one H1, found ${h1Matches.length}`],
      [html.includes('"@type":"Product"'), "missing Product schema"],
      [html.includes('"@type":"BreadcrumbList"'), "missing BreadcrumbList schema"],
      [html.includes('name="productName"'), "missing inquiry product context"]
    ];
    const errors = checks.filter(([passed]) => !passed).map(([, message]) => message);
    if (errors.length) failures.push({ slug: product.slug, url, errors });
  } catch (error) {
    failures.push({ slug: product.slug, url, errors: [error.message] });
  }
}

if (failures.length) {
  console.error(JSON.stringify({ checked: products.length, passed: products.length - failures.length, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ checked: products.length, passed: products.length, baseUrl, locale }, null, 2));
