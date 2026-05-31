import { newsSystemConfig } from "../../config/news-system.config.mjs";

const matchRules = [
  {
    category: "Permanent Magnetic Separation Equipment",
    products: newsSystemConfig.products.permanent,
    terms: ["conveyor", "tramp iron", "crusher", "aggregate", "quarry", "recycling", "cement", "coal", "belt"]
  },
  {
    category: "Electromagnetic Separation Equipment",
    products: newsSystemConfig.products.electromagnetic,
    terms: ["high capacity", "heavy duty", "deep burden", "port", "mining", "bulk terminal", "large conveyor", "adjustable"]
  },
  {
    category: "Magnetic Rollers, Magnetic Bars & Magnetic Components",
    products: newsSystemConfig.products.components,
    terms: ["food", "powder", "plastic", "granule", "hopper", "filter", "liquid", "fine metal", "packaging"]
  }
];

function countMatches(text, terms) {
  const haystack = text.toLowerCase();
  return terms.reduce((score, term) => score + (haystack.includes(term.toLowerCase()) ? 1 : 0), 0);
}

export function matchCowinmagnetProducts(item) {
  const text = `${item.title || ""} ${item.description || ""} ${item.content || ""} ${item.industry || ""}`;
  const ranked = matchRules
    .map((rule) => ({ ...rule, score: countMatches(text, rule.terms) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0].score > 0 ? ranked[0] : matchRules[0];

  return {
    category: best.category,
    recommendedProducts: best.products.slice(0, 3),
    rationale:
      best.category === "Electromagnetic Separation Equipment"
        ? "The topic suggests heavy-duty or high-capacity material handling where stronger and controllable magnetic force may be required."
        : best.category === "Magnetic Rollers, Magnetic Bars & Magnetic Components"
          ? "The topic relates to fine metal contamination, filtration or in-line protection where magnetic components can support product purity."
          : "The topic relates to conveyor protection, tramp iron removal or recycling recovery where permanent overband separators are often used."
  };
}
