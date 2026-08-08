import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "products.ts");
const outputDir = path.join(root, "docs", "product-content");
const source = fs.readFileSync(sourcePath, "utf8");
const declaration = source.indexOf("export const products");
const start = source.indexOf("[", source.indexOf("=", declaration));
const end = source.lastIndexOf("];");
const products = JSON.parse(source.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1"));

const samples = new Set([
  "rcyd-type-permanent-magnet-self-dumping-iron-remover",
  "rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover",
  "wet-drum-magnetic-separator",
  "belt-high-gradient-magnetic-separator",
  "eccentric-eddy-current-separator",
  "drawer-magnet",
  "rotary-pipe-magnet",
  "gjt-type-window-metal-detector"
]);

function family(product) {
  const text = `${product.name} ${product.category}`.toLowerCase();
  if (/(metal detector|window metal|channel metal)/.test(text)) return "metal-detection";
  if (/(eddy current|stainless steel separation)/.test(text)) return "recycling-sorting";
  if (/(control box|rectifier|explosion-proof|explosion proof|rbcdb|rbcdd|rbcyd|kgla|kxb|qjz)/.test(text)) return "explosion-control";
  if (/(lifting magnet|lifting)/.test(text)) return "lifting";
  if (/(drawer|grid|grate|magnetic rod|magnetic trap|pipe magnet|pipeline|filter|hump magnet|permanent filter bar|rotary)/.test(text)) return "filtering";
  if (/(wet|dry|drum|gradient|tailing|desliming|ore|coal washing|pre-selection|concentrated)/.test(text)) return "mineral-processing";
  return "suspended";
}

function csv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function existingSpecs(product) {
  return (product.specs || []).map((item) => `${item.label}: ${item.value}`).join(" | ");
}

function missingFields(product) {
  const modelOnly = (product.specs || []).every((item) => String(item.label).toLowerCase() === "model");
  if (!modelOnly) return "Technical source review required before display";
  return "Technical values beyond model reference: confirm from current datasheet or supplier record";
}

const confirmationFields = {
  suspended: ["Belt width", "Belt speed", "Material layer", "Suspension height", "Largest expected tramp iron", "Cleaning arrangement", "Power or cooling where applicable"],
  "mineral-processing": ["Mineral and target", "Feed size", "Feed condition", "Throughput", "Magnetic and non-magnetic product streams", "Water or slurry requirement where applicable"],
  filtering: ["Flow type", "Flow rate", "Temperature", "Viscosity or flowability", "Connection size", "Cleaning method", "Contact material requirement"],
  "recycling-sorting": ["Feed size range", "Material mix", "Throughput", "Ferrous pre-separation", "Target fraction", "Downstream discharge arrangement"],
  "metal-detection": ["Window size", "Material condition", "Detection target", "Belt speed", "Alarm or reject interface"],
  "explosion-control": ["Connected equipment", "Electrical supply", "Control mode", "Interlocks", "Installation environment", "Verified project documents"],
  lifting: ["Load shape and condition", "Lifting duty", "Power and control", "Suspension arrangement", "Site safety and inspection requirement"]
};

const names = new Map();
for (const product of products) {
  const key = product.name.toLowerCase().replaceAll("separation", "separator").replaceAll("type ", "");
  names.set(key, [...(names.get(key) || []), product.slug]);
}

const rows = products.map((product) => ({
  productId: product.slug,
  existingUrl: `/en/products/${product.slug}`,
  slug: product.slug,
  currentTitle: product.name,
  productFamily: family(product),
  exactModel: (product.specs || []).filter((item) => String(item.label).toLowerCase() === "model").map((item) => item.value).join(" | "),
  productType: product.category,
  currentImages: [product.image, ...(product.imageGallery || [])].filter(Boolean).join(" | "),
  existingSpecs: existingSpecs(product),
  existingDescription: product.summary || "",
  availableDocuments: "None found in static product record",
  primaryIndustries: (product.applications || []).join(" | "),
  materials: "To be confirmed from project material and current technical record",
  installationPositions: "To be confirmed from process layout",
  realFeatures: "Existing source content requires technical review before use",
  missingTechnicalFields: missingFields(product),
  competitorResearchUrls: "docs/product-content/competitor-research.md",
  contentStatus: samples.has(product.slug) ? "sample-approved / ready for deployment" : "detail-template-live / technical review needed",
  pageStatus: product.status || "published"
}));

fs.mkdirSync(outputDir, { recursive: true });
const headers = Object.keys(rows[0]);
fs.writeFileSync(path.join(outputDir, "product-content-audit.csv"), [headers.join(","), ...rows.map((row) => headers.map((key) => csv(row[key])).join(","))].join("\n") + "\n");
fs.writeFileSync(path.join(outputDir, "missing-technical-fields.csv"), ["productId,productName,productFamily,missingTechnicalFields", ...rows.map((row) => [row.productId, row.currentTitle, row.productFamily, row.missingTechnicalFields].map(csv).join(","))].join("\n") + "\n");

const truthCards = products.map((product) => {
  const productFamily = family(product);
  const verifiedSpecs = (product.specs || [])
    .filter((item) => String(item.label).toLowerCase() === "model")
    .map((item) => ({ label: item.label, value: item.value }));
  return {
    productName: product.name,
    model: verifiedSpecs.map((item) => item.value).join(" | "),
    family: productFamily,
    verifiedSpecs,
    specsToConfirm: confirmationFields[productFamily],
    materials: [],
    industries: product.applications || [],
    installationPositions: [],
    realAdvantages: [],
    limitations: ["No performance, certification, capacity or configuration commitment without a current technical source-of-truth."],
    options: [],
    allowedClaims: ["Product name and model reference from the current static product record.", "Existing primary product image pending media review."],
    forbiddenClaims: ["Unverified dimensions, weight, power, magnetic intensity, capacity, certification, food-grade status, project result or customer case."],
    sourceOfTruth: ["data/products.ts", ...(product.sourceUrls || [])],
    contentStatus: samples.has(product.slug) ? "sample-approved / ready for deployment" : "detail-template-live / technical-review-needed"
  };
});
fs.writeFileSync(path.join(outputDir, "product-truth-cards.json"), `${JSON.stringify(truthCards, null, 2)}\n`);

const duplicateGroups = [...names.values()].filter((group) => group.length > 1);
const byFamily = rows.reduce((all, row) => ({ ...all, [row.productFamily]: (all[row.productFamily] || 0) + 1 }), {});
const markdown = `# Product Content Audit\n\nGenerated: ${new Date().toISOString()}\n\n## Scope\n\n- Static product records audited: ${rows.length}\n- Sample pages planned: ${samples.size}\n- Static product images missing: ${rows.filter((row) => !row.currentImages).length}\n- Potential duplicate title groups: ${duplicateGroups.length}\n\n## Product Families\n\n${Object.entries(byFamily).map(([name, count]) => `- ${name}: ${count}`).join("\n")}\n\n## Data Handling\n\nThis inventory preserves the existing product URLs and records. Only model references and validated source fields may be displayed as numeric or technical facts. Fields listed in \`missing-technical-fields.csv\` must be confirmed from current COWIN technical records, not inferred from third-party pages.\n\n## Potential URL Compatibility Review\n\n${duplicateGroups.length ? duplicateGroups.map((group) => `- ${group.join(" | ")}: review canonical or 301 only after confirming that both entries represent the same real model.`).join("\n") : "- No duplicate groups detected by the normalized title check."}\n\n## Sample Page Set\n\n${rows.filter((row) => samples.has(row.productId)).map((row) => `- [${row.currentTitle}](${row.existingUrl}) - ${row.productFamily}`).join("\n")}\n`;
fs.writeFileSync(path.join(outputDir, "product-content-audit.md"), markdown);
console.log(JSON.stringify({ products: rows.length, samples: samples.size, duplicateGroups: duplicateGroups.length, outputDir }, null, 2));
