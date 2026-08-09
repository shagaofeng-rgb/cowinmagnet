import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = path.join(root, "reports", "catalog");
const privateImportPath = path.join(root, ".data", "product-research-import.json");
const sanitize = process.argv.includes("--sanitize");

function extractJsonArray(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Missing marker: ${marker}`);
  const assignmentIndex = source.indexOf("=", markerIndex);
  if (assignmentIndex === -1) throw new Error(`Missing assignment after marker: ${marker}`);
  const start = source.indexOf("[", assignmentIndex);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        const json = source.slice(start, index + 1).replace(/,\s*([}\]])/g, "$1");
        return { start, end: index, value: JSON.parse(json) };
      }
    }
  }
  throw new Error(`Unterminated array after marker: ${marker}`);
}

function csv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function writeCsv(name, rows) {
  const headers = Object.keys(rows[0] || {});
  fs.writeFileSync(path.join(reportsDir, name), `${headers.join(",")}\n${rows.map((row) => headers.map((key) => csv(row[key])).join(",")).join("\n")}\n`);
}

function modelValues(product) {
  return (product.specs || product.specifications || [])
    .filter((spec) => String(spec.label || spec[0] || "").toLowerCase() === "model")
    .map((spec) => String(spec.value || spec[1] || ""))
    .filter(Boolean);
}

function inferredFamily(product) {
  const text = `${product.name || product.title || ""} ${product.category || product.categoryTitle || ""}`.toLowerCase();
  if (/(metal detector|window metal|channel metal)/.test(text)) return "metal-detection";
  if (/(eddy current|stainless steel separation)/.test(text)) return "recycling-sorting";
  if (/(control box|rectifier|explosion-proof|explosion proof|rbcdb|rbcdd|rbcyd|kgla|kxb|qjz)/.test(text)) return "explosion-control";
  if (/(lifting magnet|lifting)/.test(text)) return "lifting";
  if (/(drawer|grid|grate|magnetic rod|magnetic trap|pipe magnet|pipeline|filter|hump magnet|permanent filter bar|rotary)/.test(text)) return "filtering";
  if (/(wet|dry|drum|gradient|tailing|desliming|ore|coal washing|pre-selection|concentrated)/.test(text)) return "mineral-processing";
  return "suspended";
}

function sourceRecords(product) {
  const urls = [...new Set(product.sourceUrls || [])].filter(Boolean);
  const fallback = String(product.sourceSite || "").trim();
  return urls.map((sourceUrl) => ({
    sourceName: new URL(sourceUrl).hostname,
    sourceUrl,
    sourceType: "industry_reference",
    checkedAt: new Date().toISOString(),
    factsUsed: ["Legacy catalogue reference requiring supplier confirmation before public specification use."],
    allowedForPublicUse: false
  })).concat(!urls.length && fallback ? [{
    sourceName: fallback,
    sourceUrl: "",
    sourceType: "industry_reference",
    checkedAt: new Date().toISOString(),
    factsUsed: ["Legacy catalogue source label requiring review."],
    allowedForPublicUse: false
  }] : []);
}

function cleanPublicProduct(product) {
  const { sourceUrls, sourceSite, ...safe } = product;
  const name = String(safe.name || safe.title || safe.shortTitle || safe.slug || "Industrial magnetic equipment");
  const category = String(safe.category || safe.categoryTitle || "industrial material handling equipment");
  const summary = `${name} is presented by COWIN MAGNET as a ${category.toLowerCase()} option. Final configuration is reviewed against the material flow, installation conditions and supplier-approved technical information for the project.`;

  // Legacy imports are retained only in the private backup and research card.
  // Do not leave scraped claims, raw markup or unconfirmed model values in public catalogue data.
  return {
    ...safe,
    imageAlt: String(safe.imageAlt || `${name} product image`),
    application: "Industrial material handling",
    summary,
    overview: summary,
    principle: "The working arrangement and final configuration are confirmed from the requested material, process position and site conditions.",
    features: [
      "Configuration review based on the actual process duty",
      "Technical information released after supplier confirmation",
      "OEM/ODM coordination and export follow-up for industrial buyers"
    ],
    keywords: [name, category, "COWIN MAGNET"],
    specifications: [],
    specificationTables: [],
    specs: [],
    applications: ["Industrial material handling"],
    installation: "Installation position and access requirements are confirmed with the site layout.",
    customization: ["Configuration confirmed for the requested project"],
    faqs: []
  };
}

const productPath = path.join(root, "data", "products.ts");
const catalogPath = path.join(root, "data", "productCatalog.js");
const productSource = fs.readFileSync(productPath, "utf8");
const catalogSource = fs.readFileSync(catalogPath, "utf8");
const productsBlock = extractJsonArray(productSource, "export const products");
const categoriesBlock = extractJsonArray(catalogSource, "export const productCategories");
const products = productsBlock.value;
const catalogueProducts = categoriesBlock.value.flatMap((category) => category.products || []);
const catalogueBySlug = new Map(catalogueProducts.map((product) => [product.slug, product]));
const now = new Date().toISOString();
const cards = products.map((product) => {
  const catalogue = catalogueBySlug.get(product.slug) || {};
  const sources = [...sourceRecords(product), ...sourceRecords(catalogue)];
  const uniqueSources = [...new Map(sources.map((source) => [`${source.sourceName}|${source.sourceUrl}`, source])).values()];
  const model = modelValues(product).join(" | ") || null;
  return {
    productId: product.slug,
    publicName: product.name,
    series: product.category,
    model,
    productType: inferredFamily(product),
    factualSources: uniqueSources,
    supplierConfirmation: { confirmed: false },
    factStatus: { productIdentity: "pending", model: "pending", technicalSpecifications: "pending", mediaRights: "pending" },
    publicContentStatus: "review",
    version: 1,
    generatedAt: now
  };
});

fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(path.dirname(privateImportPath), { recursive: true });
fs.writeFileSync(privateImportPath, `${JSON.stringify(cards, null, 2)}\n`);

const masterRows = products.map((product) => ({
  productName: product.name,
  productFamily: inferredFamily(product),
  model: modelValues(product).join(" | "),
  currentUrl: `/en/products/${product.slug}`,
  category: product.category,
  supplyStatus: "review-required",
  workingPrinciple: product.principle ? "legacy text requires editorial review" : "missing",
  cleaningMethod: "to be confirmed",
  equipmentMode: inferredFamily(product),
  materials: (product.applications || []).join(" | "),
  industries: (product.applications || []).join(" | "),
  publicPageStatus: product.status || "published",
  imageCount: [product.image, ...(product.imageGallery || [])].filter(Boolean).length
}));
const sourceRows = cards.flatMap((card) => card.factualSources.map((source) => ({
  productId: card.productId,
  publicName: card.publicName,
  sourceName: source.sourceName,
  sourceUrl: source.sourceUrl,
  sourceType: source.sourceType,
  allowedForPublicUse: source.allowedForPublicUse,
  supplierConfirmed: card.supplierConfirmation.confirmed
})));
const contentRows = cards.map((card) => ({
  productId: card.productId,
  publicName: card.publicName,
  productType: card.productType,
  publicContentStatus: card.publicContentStatus,
  productIdentity: card.factStatus.productIdentity,
  model: card.factStatus.model,
  technicalSpecifications: card.factStatus.technicalSpecifications,
  mediaRights: card.factStatus.mediaRights
}));
const missingRows = products.filter((product) => !product.image || !modelValues(product).length || !(product.specs || []).some((item) => String(item.label).toLowerCase() !== "model")).map((product) => ({
  productId: product.slug,
  publicName: product.name,
  missingImage: product.image ? "no" : "yes",
  missingModel: modelValues(product).length ? "no" : "yes",
  missingConfirmedTechnicalData: "yes",
  missingSupplierConfirmation: "yes",
  requiredNextStep: "Obtain current supplier-approved datasheet, media authorization, and configuration confirmation."
}));
const duplicateNames = new Map();
for (const product of products) {
  const key = String(product.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  duplicateNames.set(key, [...(duplicateNames.get(key) || []), product.slug]);
}
const leakRows = cards.flatMap((card) => card.factualSources.map((source) => ({
  productId: card.productId,
  findingType: "legacy-private-source",
  value: source.sourceName,
  recommendedAction: "Moved to private ProductResearchCard import; remove from public catalogue source files."
}))).concat([...duplicateNames.values()].filter((group) => group.length > 1).map((group) => ({
  productId: group.join(" | "),
  findingType: "potential-duplicate-name",
  value: group.length,
  recommendedAction: "Confirm actual model identity before any redirect or merge."
})));

writeCsv("product-master-list.csv", masterRows);
writeCsv("product-source-map.csv", sourceRows.length ? sourceRows : [{ productId: "", publicName: "", sourceName: "", sourceUrl: "", sourceType: "", allowedForPublicUse: "", supplierConfirmed: "" }]);
writeCsv("product-content-status.csv", contentRows);
writeCsv("missing-asset-and-data-list.csv", missingRows.length ? missingRows : [{ productId: "", publicName: "", missingImage: "", missingModel: "", missingConfirmedTechnicalData: "", missingSupplierConfirmation: "", requiredNextStep: "" }]);
writeCsv("duplicate-and-leak-scan.csv", leakRows.length ? leakRows : [{ productId: "", findingType: "", value: "", recommendedAction: "" }]);

if (sanitize) {
  const safeProducts = products.map(cleanPublicProduct);
  const safeCategories = categoriesBlock.value.map((category) => ({ ...category, products: (category.products || []).map(cleanPublicProduct) }));
  fs.writeFileSync(productPath, `${productSource.slice(0, productsBlock.start)}${JSON.stringify(safeProducts, null, 2)}${productSource.slice(productsBlock.end + 1)}`);
  fs.writeFileSync(catalogPath, `${catalogSource.slice(0, categoriesBlock.start)}${JSON.stringify(safeCategories, null, 2)}${catalogSource.slice(categoriesBlock.end + 1)}`);
}

console.log(JSON.stringify({ products: products.length, privateCards: cards.length, sourceRows: sourceRows.length, missingRows: missingRows.length, sanitized: sanitize, reportsDir }, null, 2));
