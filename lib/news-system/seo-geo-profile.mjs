import { newsSystemConfig } from "../../config/news-system.config.mjs";

function unique(values = []) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function taxonomyForCategory(category = "") {
  const taxonomy = newsSystemConfig.keywordTaxonomy || {};
  if (/electromagnetic/i.test(category)) return unique([...(taxonomy.core || []), ...(taxonomy.electromagnetic || [])]);
  if (/component|bar|grid|filter|roller/i.test(category)) return unique([...(taxonomy.core || []), ...(taxonomy.components || [])]);
  if (/drum|mineral|ore|coal|tailing/i.test(category)) return unique([...(taxonomy.core || []), ...(taxonomy.drumsAndMineral || [])]);
  return unique([...(taxonomy.core || []), ...(taxonomy.permanent || [])]);
}

function industryFromText(text = "") {
  const lower = text.toLowerCase();
  if (/recycling|scrap|waste|plastic|battery/.test(lower)) return "recycling and material recovery";
  if (/rare earth|critical mineral|lithium|ore|mining|tailings|beneficiation/.test(lower)) return "mining and mineral processing";
  if (/quarry|aggregate|cement|limestone|crusher/.test(lower)) return "cement, aggregate and quarry processing";
  if (/food|powder|granule|foreign material|contamination/.test(lower)) return "food, powder and granular material processing";
  if (/coal|power plant|bulk terminal|port/.test(lower)) return "coal handling and bulk material handling";
  return "industrial bulk material handling";
}

function buyerIntentForIndustry(industry = "") {
  if (/recycling/i.test(industry)) {
    return "compare magnetic separator options for ferrous recovery, cleaner recycled output, conveyor protection and reduced manual sorting";
  }
  if (/mining|mineral/i.test(industry)) {
    return "review magnetic separation equipment for ore handling, tramp iron removal, crusher protection and mineral processing reliability";
  }
  if (/cement|aggregate|quarry/i.test(industry)) {
    return "select conveyor belt magnetic separators for crusher protection, tramp iron control and aggregate plant uptime";
  }
  if (/food|powder|granular/i.test(industry)) {
    return "evaluate magnetic bars, grids and filters for foreign metal contamination control in powder or granule processing";
  }
  return "identify suitable industrial magnetic separator systems for material flow, equipment protection and contamination control";
}

function selectionParameters(industry = "") {
  const common = ["material type", "throughput", "installation space", "cleaning method", "maintenance access"];
  if (/food|powder|granular/i.test(industry)) {
    return unique([...common, "particle size", "moisture", "temperature", "contact surface requirement", "cleaning frequency"]);
  }
  if (/mining|mineral|cement|aggregate|quarry|coal|bulk/i.test(industry)) {
    return unique([...common, "belt width", "belt speed", "burden depth", "iron size", "installation height", "discharge space"]);
  }
  if (/recycling/i.test(industry)) {
    return unique([...common, "waste stream composition", "target metal size", "belt speed", "sorting layout", "discharge direction"]);
  }
  return common;
}

export function buildNewsSeoGeoProfile({ item = {}, productMatch = {} } = {}) {
  const text = `${item.title || ""} ${item.description || ""} ${productMatch.category || ""}`;
  const industry = industryFromText(text);
  const productCategory = productMatch.category || "Permanent Magnetic Equipment";
  const primaryProducts = unique(productMatch.recommendedProducts || []).slice(0, 4);
  const keywords = taxonomyForCategory(productCategory).slice(0, 16);
  const parameters = selectionParameters(industry);

  return {
    brandPositioning:
      "Cowinmagnet is a B2B magnetic separation equipment solution and export service brand, not an asserted factory owner.",
    serviceScope: [
      "product selection",
      "supplier resource coordination",
      "OEM/ODM communication coordination",
      "quality inspection coordination",
      "export and logistics support",
      "installation document coordination",
      "after-sales communication support"
    ],
    productCategory,
    primaryProducts,
    industry,
    buyerIntent: buyerIntentForIndustry(industry),
    searchKeywords: keywords,
    selectionParameters: parameters,
    aiSearchSummary: `${newsSystemConfig.brand.name} connects the cited news event with ${productCategory} selection questions for ${industry}, focusing on ${parameters.slice(0, 5).join(", ")}.`,
    entityGraph: {
      brand: newsSystemConfig.brand.name,
      company: newsSystemConfig.brand.company,
      industry,
      productCategory,
      products: primaryProducts,
      sourceName: item.sourceName || "",
      sourceUrl: item.url || "",
      buyerIntent: buyerIntentForIndustry(industry)
    }
  };
}

