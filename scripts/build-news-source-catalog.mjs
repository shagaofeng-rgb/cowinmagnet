import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const rawPath = path.join(root, "data", "news", "cowinmagnet-source-list.raw.md");
const outputDir = path.join(root, "data", "news");

const groupForHeading = (heading = "") => {
  if (heading.includes("矿山")) return "mining";
  if (heading.includes("固废")) return "recycling";
  if (heading.includes("散料")) return "bulk-chemical";
  if (heading.includes("食品")) return "food-pharma";
  if (heading.includes("稀土")) return "magnetics-engineering";
  return null;
};

const sourceOverrides = new Map([
  ["im-mining.com", { name: "International Mining", rss: "https://im-mining.com/feed/", tier: "B" }],
  ["mining-technology.com", { name: "Mining Technology", rss: "https://www.mining-technology.com/feed/", tier: "B" }],
  ["recyclingtoday.com", { name: "Recycling Today", rss: "https://www.recyclingtoday.com/rss", tier: "B" }],
  ["wastetodaymagazine.com", { name: "Waste Today", rss: "https://www.wastetodaymagazine.com/rss", tier: "B" }],
  ["foodengineeringmag.com", { name: "Food Engineering", rss: "https://www.foodengineeringmag.com/rss", tier: "B" }],
  ["globalcement.com", { name: "Global Cement", rss: "https://www.globalcement.com/news/itemlist?format=feed&type=rss", tier: "B" }]
]);

const authorityDomains = new Set([
  "saimm.co.za", "smenet.org", "ausimm.com", "iom3.org", "mineralproducts.org", "copper.org",
  "scrap.org", "isri.org", "euric-recycling.org", "bir.org", "weee-forum.org", "gfsi.com",
  "ieee-magnetics.org", "magnetism.org", "magneticsociety.org", "permanentmagnets.org", "cement.org"
]);

function normalizeRequestedUrl(value) {
  const input = value.trim();
  const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  url.hash = "";
  url.search = "";
  url.hostname = url.hostname.toLowerCase();
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  return url;
}

function isDiscoveryOnly(domain) {
  return /(?:^|\.)(reddit\.com|quora\.com|eng-tips\.com|physicsforums\.com)$/.test(domain)
    || /forum|board|community|rocktumbling|gold-prospecting|merchandise/.test(domain);
}

function csv(value = "") {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const raw = await fs.readFile(rawPath, "utf8");
const lines = raw.replace(/\r/g, "").split("\n");
let sourceGroup = null;
let ordinal = 0;
const seenCanonical = new Map();
const sources = [];

for (const line of lines) {
  const nextGroup = groupForHeading(line);
  if (nextGroup) {
    sourceGroup = nextGroup;
    continue;
  }
  if (!sourceGroup || !/^((https?:\/\/)?(?:www\.)?[a-z0-9][a-z0-9.-]+\.[a-z]{2,}(?:\/[^\s]*)?)$/i.test(line.trim())) continue;
  const requestedUrl = normalizeRequestedUrl(line);
  const canonicalDomain = requestedUrl.hostname.replace(/^www\./, "");
  const override = sourceOverrides.get(canonicalDomain);
  const discoveryOnly = isDiscoveryOnly(canonicalDomain);
  ordinal += 1;
  const first = seenCanonical.get(canonicalDomain);
  const record = {
    id: `cowin-source-${String(ordinal).padStart(3, "0")}`,
    sourceOrdinal: ordinal,
    rawEntry: line.trim(),
    name: override?.name || canonicalDomain,
    requestedDomain: requestedUrl.hostname,
    requestedUrl: requestedUrl.toString(),
    canonicalDomain,
    sourceGroup,
    industryTags: [sourceGroup],
    discoveryMethod: [override?.rss ? "rss" : "public-page"],
    rssOrApiUrl: override?.rss || null,
    tier: discoveryOnly ? "discovery-only" : (override?.tier || (authorityDomains.has(canonicalDomain) ? "A" : "C")),
    active: Boolean(override) && !first && !discoveryOnly,
    validationStatus: Boolean(override) && !first && !discoveryOnly ? "verified" : "pending",
    robotsAllowed: Boolean(override) && !first && !discoveryOnly ? true : null,
    lastCheckedAt: null,
    lastUsedAt: null,
    useCount: 0,
    canonicalDuplicateOf: first || null,
    notes: discoveryOnly ? "Discovery-only: never an independent factual source." : (first ? `Canonical duplicate of ${first}.` : "Requires DNS, HTTP, robots, and content-health validation before activation.")
  };
  sources.push(record);
  if (!first) seenCanonical.set(canonicalDomain, record.id);
}

if (sources.length !== 300) throw new Error(`Expected 300 raw source entries, found ${sources.length}`);

const activeCatalog = sources.filter((source) => source.active && source.validationStatus === "verified" && source.robotsAllowed);
const groupCounts = Object.fromEntries([...new Set(sources.map((source) => source.sourceGroup))].map((group) => [group, sources.filter((source) => source.sourceGroup === group).length]));
const statusCounts = Object.fromEntries(["verified", "pending"].map((status) => [status, sources.filter((source) => source.validationStatus === status).length]));
const duplicateCount = sources.filter((source) => source.canonicalDuplicateOf).length;
const headers = ["id", "sourceOrdinal", "rawEntry", "name", "requestedDomain", "requestedUrl", "canonicalDomain", "sourceGroup", "industryTags", "discoveryMethod", "rssOrApiUrl", "tier", "active", "validationStatus", "robotsAllowed", "lastCheckedAt", "lastUsedAt", "useCount", "canonicalDuplicateOf", "notes"];
const groupBullets = Object.entries(groupCounts).map(([group, count]) => `- ${group}: ${count}`).join("\n");

await fs.mkdir(outputDir, { recursive: true });
const summary = { rawEntries: sources.length, canonicalDomains: seenCanonical.size, verifiedBootstrapSources: activeCatalog.length, pending: statusCounts.pending, duplicateCount, groupCounts };
await fs.writeFile(path.join(outputDir, "source-catalog.seed.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), summary, sources, activeCatalog }, null, 2)}\n`);
await fs.writeFile(path.join(outputDir, "source-catalog.seed.csv"), `${headers.join(",")}\n${sources.map((source) => headers.map((header) => csv(Array.isArray(source[header]) ? source[header].join("|") : source[header])).join(",")).join("\n")}\n`);
await fs.writeFile(path.join(outputDir, "source-catalog.normalization-report.md"), `# CowinMagnet source catalog normalization\n\nGenerated: ${new Date().toISOString()}\n\n- Raw entries preserved: ${sources.length}\n- Canonical domains: ${seenCanonical.size}\n- Canonical duplicate records: ${duplicateCount}\n- Verified bootstrap sources: ${activeCatalog.length}\n- Pending validation: ${statusCounts.pending}\n\n## Group counts\n\n${groupBullets}\n\n## Activation rule\n\nOnly entries with \`active=true\`, \`validationStatus=verified\`, and \`robotsAllowed=true\` may be used to discover or cite a News article. Forum, Reddit, Quora, and similar entries remain preserved as discovery-only records and cannot be an article's sole factual source.\n`);

console.log(JSON.stringify(summary, null, 2));
