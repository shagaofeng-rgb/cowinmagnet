import { newsSystemConfig } from "../../config/news-system.config.mjs";

const painPointTerms = [
  "contamination",
  "tramp iron",
  "metal",
  "conveyor",
  "crusher",
  "downtime",
  "damage",
  "safety",
  "sorting",
  "recycling",
  "maintenance",
  "belt",
  "purity",
  "failure",
  "coal",
  "critical minerals",
  "rare earth",
  "lithium",
  "waste streams",
  "processing plant",
  "beneficiation",
  "tailings",
  "residue"
];

const contextualIndustryTerms = [
  "mining",
  "mine",
  "coal",
  "recycling",
  "waste",
  "scrap",
  "rare earth",
  "critical minerals",
  "lithium",
  "battery",
  "mineral processing",
  "processing plant",
  "ore",
  "beneficiation",
  "aggregate",
  "quarry",
  "bulk material",
  "coal handling",
  "material recovery"
];

const authoritySources = [
  "Reuters",
  "AP",
  "BBC",
  "Mining.com",
  "Global Mining Review",
  "Recycling Today",
  "Waste Management World",
  "World Cement",
  "International Cement Review",
  "Agg-Net",
  "Quarry Magazine",
  "Australian Mining",
  "Engineering News",
  "World Coal",
  "Food Safety News"
];

function includesAny(text, terms) {
  const haystack = text.toLowerCase();
  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

function scoreByMatches(text, terms, maxScore = 100) {
  const haystack = text.toLowerCase();
  const matches = terms.filter((term) => haystack.includes(term.toLowerCase())).length;
  return Math.min(maxScore, Math.round((matches / Math.max(1, Math.min(8, terms.length))) * 100));
}

function freshnessScore(publishedDate) {
  if (!publishedDate) return 45;
  const ageMs = Date.now() - new Date(publishedDate).getTime();
  const ageHours = ageMs / 36e5;
  if (ageHours <= 24) return 100;
  if (ageHours <= 72) return 85;
  if (ageHours <= 168) return 70;
  if (ageHours <= 720) return 45;
  return 25;
}

function marketValueScore(country = "") {
  if (!country) return 50;
  return includesAny(country, newsSystemConfig.targetCountries) ? 95 : 58;
}

function authorityScore(sourceName = "") {
  if (!sourceName) return 45;
  if (includesAny(sourceName, authoritySources)) return 92;
  return 62;
}

export function scoreNewsItem(item) {
  const text = `${item.title || ""} ${item.description || ""} ${item.content || ""} ${item.industry || ""}`;
  const directRelevance = scoreByMatches(text, newsSystemConfig.keywords);
  const contextualRelevance = scoreByMatches(text, contextualIndustryTerms, 82);
  const relevance = Math.max(35, directRelevance, contextualRelevance);
  const painPoint = Math.max(25, scoreByMatches(text, painPointTerms));
  const industryValue = includesAny(text, [
    "mining",
    "recycling",
    "cement",
    "coal",
    "quarry",
    "aggregate",
    "food",
    "plastic",
    "bulk material",
    "waste"
  ])
    ? 88
    : 54;
  const marketValue = marketValueScore(item.country);
  const freshness = freshnessScore(item.publishedDate);
  const authority = authorityScore(item.sourceName);
  const contentOpportunity = Math.round((relevance + painPoint + industryValue) / 3);

  const { weights } = newsSystemConfig.scoring;
  const finalScore = Math.round(
    relevance * weights.relevance +
      painPoint * weights.painPoint +
      industryValue * weights.industryValue +
      marketValue * weights.marketValue +
      freshness * weights.freshness +
      authority * weights.authority +
      contentOpportunity * weights.contentOpportunity
  );

  return {
    relevance_score: relevance,
    pain_point_score: painPoint,
    industry_value_score: industryValue,
    market_value_score: marketValue,
    freshness_score: freshness,
    authority_score: authority,
    content_opportunity_score: contentOpportunity,
    final_score: finalScore
  };
}

export function passesScoreThreshold(scoredItem) {
  return scoredItem.final_score >= newsSystemConfig.scoring.minimumFinalScore;
}
