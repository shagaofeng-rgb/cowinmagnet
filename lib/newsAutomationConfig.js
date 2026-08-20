import sites from "../data/news-automation-sites.json" with { type: "json" };

function required(value, label, errors) {
  if (!value || (Array.isArray(value) && !value.length)) errors.push(label);
}

export function validateNewsSiteConfig(site) {
  const errors = [];
  required(site?.site_id, "site_id", errors);
  required(site?.industry_scope, "industry_scope", errors);
  required(site?.site_url, "site_url", errors);
  required(site?.publication_language, "publication_language", errors);
  required(site?.timezone, "timezone", errors);
  required(site?.news?.list_route, "news.list_route", errors);
  required(site?.news?.detail_route_pattern, "news.detail_route_pattern", errors);
  required(site?.product_theme_plan?.source_reference, "product_theme_plan.source_reference", errors);
  required(site?.sources?.primary_whitelist, "sources.primary_whitelist", errors);
  required(site?.sources?.fallback_whitelist, "sources.fallback_whitelist", errors);
  try {
    const parsed = new URL(site?.site_url || "");
    if (parsed.protocol !== "https:") errors.push("site_url must use HTTPS");
  } catch {
    errors.push("site_url must be a URL");
  }
  return { valid: errors.length === 0, errors };
}

export function listNewsSites() {
  return sites.map((site) => ({ ...site, validation: validateNewsSiteConfig(site) }));
}

export function getNewsSiteConfig(siteId = process.env.NEWS_SITE_ID) {
  const configuredSiteId = siteId || sites.find((site) => site.enabled)?.site_id;
  const site = sites.find((item) => item.site_id === configuredSiteId);
  if (!site) throw new Error(`News site configuration is missing for site_id=${configuredSiteId || "(unset)"}`);
  const validation = validateNewsSiteConfig(site);
  if (!validation.valid) throw new Error(`News site configuration is invalid: ${validation.errors.join(", ")}`);
  return site;
}

export function getNewsSiteSources(site, { includeFallback = false } = {}) {
  const sourceGroups = [site.sources?.primary_whitelist || []];
  if (includeFallback) sourceGroups.push(site.sources?.fallback_whitelist || []);
  return sourceGroups.flat().map((source) => ({ ...source, site_id: site.site_id }));
}

export function isNewsProductionEnabled(site) {
  if (process.env.NEWS_AUTO_PUBLISH !== undefined) return String(process.env.NEWS_AUTO_PUBLISH).toLowerCase() === "true";
  return String(process.env.NEWS_AUTOMATION_PRODUCTION_ENABLED || site.publishing?.production_enabled || "false").toLowerCase() === "true";
}
