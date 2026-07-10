import { newsSystemConfig } from "../../config/news-system.config.mjs";
import { jaccardSimilarity, normalizeUrl, textTokens } from "./dedupe.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;
const RECENT_SOURCE_WINDOW = 10;
const SOURCE_72H_MS = 72 * 60 * 60 * 1000;
const SEMANTIC_REJECT_THRESHOLD = Number(newsSystemConfig.diversity?.semanticSimilarityRejectThreshold || 0.9);
const MIN_INFORMATION_GAIN_SCORE = Number(newsSystemConfig.diversity?.minimumInformationGainScore || 1);
const MAX_SAME_DOMAIN_RECENT_10 = Number(newsSystemConfig.diversity?.maxSameDomainInRecent10 || 4);
const TOPIC_24H_LIMIT = Number(newsSystemConfig.diversity?.topicLimits?.per24h || 2);
const TOPIC_7D_LIMIT = Number(newsSystemConfig.diversity?.topicLimits?.per7d || 6);

function safeDate(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? null : date;
}

function hostFromUrl(value = "") {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function rootDomainFromUrl(value = "") {
  const host = hostFromUrl(value);
  if (!host) return "";
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;
  const secondLevelSuffixes = new Set(["co.uk", "com.au", "com.br", "com.cn", "co.za", "com.sg", "com.mx"]);
  const suffix = parts.slice(-2).join(".");
  if (secondLevelSuffixes.has(suffix) && parts.length >= 3) return parts.slice(-3).join(".");
  return parts.slice(-2).join(".");
}

function sourceDomain(item) {
  return rootDomainFromUrl(item.publisherUrl || item.resolvedSourceUrl || item.url || item.canonicalUrl || item.sourceUrl || "");
}

function feedDomain(item) {
  return rootDomainFromUrl(item.sourceFeedUrl || item.sourceUrl || item.url || "");
}

export function sourceGroupForItem(item) {
  if (item.sourceGroup) return item.sourceGroup;
  const text = `${item.sourceName || ""} ${item.sourceUrl || ""} ${item.category || ""}`.toLowerCase();
  if (/gov|agency|standard|osha|epa|department|commission|iso|astm/.test(text)) return "government-standards";
  if (/forum|stack|reddit|engineering|technical/.test(text)) return "engineering-forums";
  if (/blog|manufacturer|supplier|equipment/.test(text)) return "manufacturer-blogs";
  if (/mining|recycling|cement|food safety|trade|review|today|world/.test(text)) return "industry-news";
  return item.provider === "rss" ? "trade-publications" : "industry-news";
}

function semanticText(item = {}) {
  return [
    item.title,
    item.description,
    item.summary,
    item.category,
    item.country,
    item.region
  ]
    .filter(Boolean)
    .join(" ");
}

function entityTokens(value = "") {
  const generic = new Set([
    "magnetic",
    "separator",
    "separation",
    "equipment",
    "industry",
    "news",
    "update",
    "buyers",
    "review",
    "mining",
    "recycling",
    "market",
    "material",
    "materials"
  ]);
  return textTokens(value)
    .filter((token) => token.length > 3 && !generic.has(token))
    .slice(0, 12);
}

export function topicClusterId(item = {}) {
  const text = semanticText(item).toLowerCase();
  if (/\b(e-?waste|electronic waste|circuit board|printed circuit|pcb)\b/.test(text)) return "electronics-e-waste-recovery";
  if (/\b(battery recycling|black mass|hydrometallurg|battery material)\b/.test(text)) return "battery-recycling-hydrometallurgy";
  if (/\b(rare earth|neodymium|dysprosium|permanent magnet recycling)\b/.test(text)) return "rare-earth-processing";
  if (/\b(lithium|critical mineral|nickel|cobalt|brine)\b/.test(text)) return "critical-minerals-processing";
  if (/\b(plastic|polymer|packaging|pcr|pet bottle|resin)\b/.test(text)) return "plastics-packaging-circularity";
  if (/\b(scrap metal|metals recycling|steel scrap|aluminum scrap|copper scrap|ferrous|nonferrous)\b/.test(text)) {
    return "metals-scrap-recovery";
  }
  if (/\b(tire|rubber|textile|mattress|bulky waste)\b/.test(text)) return "durable-material-recovery";
  if (/\b(construction waste|demolition|c&d|wood waste|building material reuse)\b/.test(text)) {
    return "construction-demolition-recycling";
  }
  if (/\b(epr|extended producer responsibility|deposit return|recycling law|recycling regulation|certification program)\b/.test(text)) {
    return "recycling-policy-standards";
  }
  if (/\b(mrf|material recovery facility|sorting line|shredder|optical sorter|recycling equipment)\b/.test(text)) {
    return "recycling-sorting-equipment";
  }
  if (/wet|dry|drum|beneficiation|tailings|ore grade|mineral processing/.test(text)) return "wet-dry-mineral-processing";
  if (/electromagnetic|cooling|oil-cooled|air-cooled|self-cooled|high-intensity/.test(text)) return "electromagnetic-cooling-technology";
  if (/\b(cement|aggregates?|quarry|limestone|crusher|concrete)\b/.test(text)) return "cement-aggregate-iron-removal";
  if (/food|powder|granule|foreign material|contamination/.test(text)) return "food-metal-contamination-control";
  if (/\b(recycling|recyclables|waste recovery|circular economy)\b/.test(text)) return "recycling-market-operations";
  if (/conveyor|belt|bulk material|tramp iron|coal handling/.test(text)) return "conveyor-protection";
  if (/\b(safety|osha|worker protection|injury|hazard)\b/.test(text)) return "industrial-safety-compliance";
  if (/\b(standard|nist|astm|iso|test method|measurement)\b/.test(text)) return "industrial-standards-measurement";
  if (/mining|mine|ore|bauxite|gold|copper|nickel/.test(text)) return "mining-application";
  return "magnetic-separator-industry-news";
}

export function eventClusterId(item = {}) {
  const date = safeDate(item.publishedDate || item.retrievedDate);
  const window = date ? date.toISOString().slice(0, 7) : "unknown-date";
  const entities = entityTokens(`${item.title || ""} ${item.description || ""}`).slice(0, 6);
  return `${window}:${entities.sort().join("-") || topicClusterId(item)}`;
}

function keywordCoverageScore(item = {}) {
  const text = semanticText(item).toLowerCase();
  const groups = newsSystemConfig.keywordTaxonomy || {};
  const matches = Object.values(groups)
    .flat()
    .filter((keyword) => text.includes(String(keyword).toLowerCase()));
  if (matches.length >= 4) return 2;
  if (matches.length >= 1 || newsSystemConfig.keywords.some((keyword) => text.includes(String(keyword).toLowerCase()))) return 1;
  return 0;
}

function angleId(item = {}) {
  const text = semanticText(item).toLowerCase();
  if (/regulation|standard|policy|government|permit|safety rule/.test(text)) return "policy";
  if (/technology|cooling|sensor|automation|ai|process|engineering/.test(text)) return "technology";
  if (/market|investment|capacity|demand|price|supply|deal|merger|funding/.test(text)) return "market";
  if (/application|plant|project|site|operation|maintenance|downtime/.test(text)) return "application";
  return "buyer-selection";
}

function similarity(a, b) {
  const aText = typeof a === "string" ? a : semanticText(a);
  const bText = typeof b === "string" ? b : semanticText(b);
  return Math.max(jaccardSimilarity(aText, bText), jaccardSimilarity((a.title || aText), (b.title || bText)));
}

function publishedText(post = {}) {
  return [
    post.title,
    post.excerpt,
    post.content,
    post.automation?.originalTitle,
    post.automation?.originalUrl,
    post.category,
    post.categoryTitle
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildDiversityContext({ state = {}, publishedPosts = [] } = {}) {
  const now = Date.now();
  const published = [...publishedPosts]
    .filter((post) => post.status === "published")
    .map((post) => {
      const originalUrl = post.automation?.originalUrl || post.canonicalSourceUrl || post.sources?.[0]?.url || "";
      const publishedAt = post.publishedAt || post.createdAt || post.updatedAt || "";
      const topic = post.automation?.topicClusterId || post.topicClusterId || topicClusterId({
        title: post.title,
        description: post.excerpt,
        category: post.category
      });
      const event = post.automation?.eventClusterId || eventClusterId({
        title: post.automation?.originalTitle || post.title,
        description: post.excerpt,
        publishedDate: publishedAt
      });
      return {
        title: post.title,
        text: publishedText(post),
        sourceDomain: post.automation?.sourceDomain || rootDomainFromUrl(originalUrl),
        sourceGroup: post.automation?.sourceGroup || sourceGroupForItem({ sourceName: post.source, sourceUrl: originalUrl, category: post.category }),
        topicClusterId: topic,
        eventClusterId: event,
        angleId: post.automation?.angleId || angleId({ title: post.title, description: post.excerpt }),
        publishedAt
      };
    })
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  const stateHistory = Array.isArray(state.sourceHistory) ? state.sourceHistory : [];
  const sourceHistory = [
    ...stateHistory.map((entry) => ({
      sourceDomain: entry.sourceDomain,
      sourceGroup: entry.sourceGroup,
      topicClusterId: entry.topicClusterId,
      eventClusterId: entry.eventClusterId,
      angleId: entry.angleId,
      publishedAt: entry.publishedAt
    })),
    ...published
  ]
    .filter((entry) => entry.sourceDomain || entry.topicClusterId)
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  const lastTenSources = sourceHistory.slice(0, RECENT_SOURCE_WINDOW);
  const recent72h = sourceHistory.filter((entry) => {
    const date = safeDate(entry.publishedAt);
    return date && now - date.getTime() <= SOURCE_72H_MS;
  });
  const recent24h = sourceHistory.filter((entry) => {
    const date = safeDate(entry.publishedAt);
    return date && now - date.getTime() <= DAY_MS;
  });
  const recent7d = sourceHistory.filter((entry) => {
    const date = safeDate(entry.publishedAt);
    return date && now - date.getTime() <= 7 * DAY_MS;
  });

  return {
    published,
    sourceHistory,
    lastTenSources,
    recent72h,
    recent24h,
    recent7d
  };
}

function countBy(list, key, value) {
  return list.filter((entry) => entry?.[key] && entry[key] === value).length;
}

function bestSemanticMatch(item, context, selected = []) {
  const pool = [
    ...context.published.map((entry) => ({ title: entry.title, text: entry.text })),
    ...selected.map((entry) => ({ title: entry.title, text: semanticText(entry) }))
  ];
  let best = { score: 0, title: "" };
  for (const entry of pool) {
    const score = similarity(item, entry.text || entry.title || "");
    if (score > best.score) best = { score, title: entry.title || "" };
  }
  return best;
}

export function evaluateNewsDiversity(item, context, selected = []) {
  const sourceDomainValue = sourceDomain(item);
  const sourceGroup = sourceGroupForItem(item);
  const sourceFeedDomain = feedDomain(item);
  const topic = topicClusterId(item);
  const event = eventClusterId(item);
  const angle = angleId(item);
  const semantic = bestSemanticMatch(item, context, selected);
  const selectedEventDuplicate = selected.find((candidate) => candidate.diversity?.eventClusterId === event);
  const selectedFeedDuplicate = selected.find((candidate) => feedDomain(candidate) === sourceFeedDomain);
  const lastTenSourceCount = countBy(context.lastTenSources, "sourceDomain", sourceDomainValue);
  const usedSource72h = countBy(context.recent72h, "sourceDomain", sourceDomainValue) > 0;
  const topic24hCount = countBy(context.recent24h, "topicClusterId", topic);
  const topic7dCount = countBy(context.recent7d, "topicClusterId", topic);
  const eventSeen = countBy(context.recent7d, "eventClusterId", event) > 0;
  const recentAngleSeen = countBy(context.recent7d, "angleId", angle) > 0;

  const newSourceWeight = usedSource72h ? 0 : lastTenSourceCount === 0 ? 3 : lastTenSourceCount < 2 ? 1 : 0;
  const newEventWeight = eventSeen || selectedEventDuplicate ? 0 : semantic.score < 0.35 ? 3 : semantic.score < 0.6 ? 2 : 1;
  const newAngleWeight = recentAngleSeen ? 1 : 2;
  const seoKeywordValue = keywordCoverageScore(item);
  const duplicateTopicPenalty = Math.min(5, Math.max(0, topic24hCount * 3 + Math.max(0, topic7dCount - 1)));
  const sameSourcePenalty = usedSource72h || lastTenSourceCount >= MAX_SAME_DOMAIN_RECENT_10 ? 2 : 0;
  const informationGainScore =
    newSourceWeight + newEventWeight + newAngleWeight + seoKeywordValue - duplicateTopicPenalty - sameSourcePenalty;

  const rejectedReasons = [];
  if (lastTenSourceCount >= MAX_SAME_DOMAIN_RECENT_10) rejectedReasons.push("source-domain-limit-last-10");
  if (semantic.score > SEMANTIC_REJECT_THRESHOLD) rejectedReasons.push("semantic-duplication-over-0.85");
  if (topic24hCount >= TOPIC_24H_LIMIT) rejectedReasons.push("topic-cluster-24h-limit");
  if (topic7dCount >= TOPIC_7D_LIMIT) rejectedReasons.push("topic-cluster-7d-limit");
  if (selectedEventDuplicate || eventSeen) rejectedReasons.push("multi-source-same-event");
  if (selectedFeedDuplicate) rejectedReasons.push("consecutive-rss-feed");
  if (informationGainScore < MIN_INFORMATION_GAIN_SCORE) rejectedReasons.push("information-gain-below-5");

  return {
    selected_source: {
      name: item.sourceName || sourceDomainValue || "unknown",
      domain: sourceDomainValue,
      feedDomain: sourceFeedDomain,
      group: sourceGroup,
      url: item.url
    },
    sourceDomain: sourceDomainValue,
    sourceGroup,
    sourceFeedDomain,
    duplication_score: Number(semantic.score.toFixed(3)),
    duplication_match_title: semantic.title,
    topic_cluster_id: topic,
    eventClusterId: event,
    angleId: angle,
    information_gain_score: informationGainScore,
    information_gain_breakdown: {
      new_source_weight: newSourceWeight,
      new_event_weight: newEventWeight,
      new_angle_weight: newAngleWeight,
      seo_keyword_value: seoKeywordValue,
      duplicate_topic_penalty: -duplicateTopicPenalty,
      same_source_penalty: -sameSourcePenalty
    },
    rejected: rejectedReasons.length > 0,
    rejected_reasons: rejectedReasons
  };
}

export function compactRejectedSource(item, diversity, extraReason = "") {
  return {
    source: item.sourceName || diversity?.selected_source?.name || "unknown",
    domain: diversity?.sourceDomain || sourceDomain(item),
    url: item.url,
    reason: extraReason || diversity?.rejected_reasons?.join("; ") || "rejected",
    duplication_score: diversity?.duplication_score ?? null,
    topic_cluster_id: diversity?.topic_cluster_id || topicClusterId(item),
    information_gain_score: diversity?.information_gain_score ?? null
  };
}

export function registerDiversityUsage(state, item, article) {
  const diversity = item.diversity || {};
  const publishedAt = article?.publishedAt || new Date().toISOString();
  const entry = {
    sourceDomain: diversity.sourceDomain || sourceDomain(item),
    sourceGroup: diversity.sourceGroup || sourceGroupForItem(item),
    topicClusterId: diversity.topic_cluster_id || topicClusterId(item),
    eventClusterId: diversity.eventClusterId || eventClusterId(item),
    angleId: diversity.angleId || angleId(item),
    title: article?.title || item.title || "",
    url: item.url || "",
    publishedAt
  };

  return {
    ...state,
    sourceHistory: [entry, ...(state?.sourceHistory || [])].slice(0, 300),
    topicHistory: [
      {
        topicClusterId: entry.topicClusterId,
        eventClusterId: entry.eventClusterId,
        title: entry.title,
        publishedAt
      },
      ...(state?.topicHistory || [])
    ].slice(0, 500)
  };
}
