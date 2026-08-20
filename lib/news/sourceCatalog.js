import catalog from "../../data/news/source-catalog.seed.json" with { type: "json" };

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getSourceCatalogRecords() {
  return toArray(catalog.sources).map((source) => ({ ...source }));
}

export function getCatalogSeedSources() {
  return getSourceCatalogRecords()
    .filter((source) => !source.canonicalDuplicateOf)
    .map((source) => ({
      ...source,
      domain: source.canonicalDomain,
      rss_or_api_url: source.rssOrApiUrl || null,
      allowed_topics: source.industryTags || [],
      allowed_languages: ["en"],
      source_trust_score: source.tier === "A" ? 90 : source.tier === "B" ? 80 : source.tier === "C" ? 60 : 0,
      source_type: source.tier === "A" ? "association-or-standards" : source.tier === "discovery-only" ? "discovery-only" : "trade-media"
    }));
}

export function getCatalogSeedSummary() {
  const records = getSourceCatalogRecords();
  return {
    rawEntries: records.length,
    canonicalDomains: new Set(records.map((source) => source.canonicalDomain)).size,
    verifiedBootstrapSources: records.filter((source) => source.active && source.validationStatus === "verified" && source.robotsAllowed).length,
    pendingValidation: records.filter((source) => source.validationStatus === "pending").length,
    discoveryOnly: records.filter((source) => source.tier === "discovery-only").length
  };
}
