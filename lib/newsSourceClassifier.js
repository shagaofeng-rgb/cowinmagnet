import catalog from "../data/product-application-catalog.json" with { type: "json" };
import { normalizeNewsText } from "./newsOperationsRules.js";

const SOURCE_FAMILY_HINTS = {
  "aggregatesbusiness.com": "suspended-iron-removal",
  "foodengineeringmag.com": "magnetic-filters",
  "globalcement.com": "suspended-iron-removal",
  "internationalmining.com": "mineral-processing",
  "mining-technology.com": "mineral-processing",
  "recyclingtoday.com": "recycling-sorting",
  "wastetodaymagazine.com": "recycling-sorting"
};

const FAMILY_TOPIC_SIGNALS = {
  "suspended-iron-removal": ["aggregate", "cement", "coal", "conveyor", "crusher", "ferrous", "quarry", "tramp metal"],
  "mineral-processing": ["beneficiation", "concentrate", "magnetite", "mine", "mineral", "mining", "ore", "tailings"],
  "recycling-sorting": ["aluminum", "copper", "metal recovery", "nonferrous", "recyclable", "recycling", "scrap", "waste"],
  "magnetic-filters": ["ceramic", "chemical", "food processing", "granule", "liquid", "powder", "slurry"],
  "metal-detection": ["contamination", "detector", "inspection", "metal detection", "product safety"]
};

export function classifyNewsFamily(text, sourceDomain = "") {
  const haystack = normalizeNewsText(text);
  const hintedFamily = SOURCE_FAMILY_HINTS[sourceDomain];
  const ranked = catalog.families.map((family) => {
    const keywordScore = family.keywords.reduce(
      (score, keyword) => score + (haystack.includes(normalizeNewsText(keyword)) ? 4 : 0),
      0
    );
    const signalScore = (FAMILY_TOPIC_SIGNALS[family.id] || []).reduce(
      (score, signal) => score + (haystack.includes(normalizeNewsText(signal)) ? 1 : 0),
      0
    );
    const sourceScore = hintedFamily === family.id ? 3 : 0;
    return { family, score: keywordScore + signalScore + sourceScore };
  }).sort((a, b) => b.score - a.score);

  return ranked[0]?.score >= 2 ? ranked[0].family : null;
}
