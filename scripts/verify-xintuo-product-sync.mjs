import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const baseUrl = (process.argv.find((argument) => argument.startsWith("--base-url="))?.slice("--base-url=".length) || "http://127.0.0.1:3105").replace(/\/$/, "");
const resultPath = path.join(root, "reports", "xintuo-product-sync", "matched-product-import-result.json");
const productsPath = path.join(root, "data", "products.ts");

async function loadProducts() {
  const source = await readFile(productsPath, "utf8");
  const declaration = source.indexOf("export const products");
  const start = source.indexOf("[", source.indexOf("=", declaration));
  const end = source.lastIndexOf("]; ");
  const safeEnd = end === -1 ? source.lastIndexOf("]; ".trim()) : end;
  return JSON.parse(source.slice(start, safeEnd + 1).replace(/,\s*([}\]])/g, "$1"));
}

async function status(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.status;
  } catch {
    return 0;
  }
}

const [result, products] = await Promise.all([
  readFile(resultPath, "utf8").then(JSON.parse),
  loadProducts()
]);
const failures = [];
let assetChecks = 0;
const importedSlugs = [...new Set([
  "rcyb-type-permanent-magnet-manual-iron-remover",
  ...result.changes.map((change) => change.targetSlug)
])];

for (const targetSlug of importedSlugs) {
  const product = products.find((item) => item.slug === targetSlug);
  if (!product) {
    failures.push({ slug: targetSlug, error: "missing imported product" });
    continue;
  }
  if (!product.specificationTable?.rows?.length) failures.push({ slug: product.slug, error: "missing model reference table" });
  if (!product.engineeringDiagrams?.length) failures.push({ slug: product.slug, error: "missing engineering diagrams" });
  if (/product overview|�|JB\/T8711/i.test(`${product.summary} ${product.principle}`)) failures.push({ slug: product.slug, error: "legacy or malformed public copy remains" });
  const pageStatus = await status(`${baseUrl}/en/products/${product.slug}`);
  if (pageStatus !== 200) failures.push({ slug: product.slug, error: `page HTTP ${pageStatus}` });
  for (const asset of [product.image, ...(product.engineeringDiagrams || []).map((diagram) => diagram.src)]) {
    assetChecks += 1;
    const assetStatus = await status(`${baseUrl}${asset}`);
    if (assetStatus !== 200) failures.push({ slug: product.slug, asset, error: `asset HTTP ${assetStatus}` });
  }
}

if (failures.length) {
  console.error(JSON.stringify({ verifiedProducts: importedSlugs.length, assetChecks, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ verifiedProducts: importedSlugs.length, assetChecks, baseUrl }, null, 2));
