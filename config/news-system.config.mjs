export const newsSystemConfig = {
  siteUrl: process.env.SITE_URL || "https://www.cowinmagnet.com",
  defaultLanguage: "en",
  publishMode: String(process.env.NEWS_PUBLISH_MODE || "published").trim(),
  publishInterval: "every-3-hours",
  maxPostsPerRun: Number(process.env.NEWS_MAX_PUBLISH_PER_RUN || process.env.NEWS_MAX_POSTS_PER_RUN || 1),
  maxPostsPerDay: Number(process.env.NEWS_MAX_PUBLISH_PER_DAY || process.env.NEWS_MAX_POSTS_PER_DAY || 4),
  minRelevanceScore: Number(process.env.NEWS_MIN_RELEVANCE_SCORE || 35),
  timezone: process.env.NEWS_TIMEZONE || "Asia/Shanghai",
  outputImageSize: { width: 1200, height: 630 },
  brand: {
    name: "Cowinmagnet",
    company: "Quzhou Qiying Import & Export Co., Ltd",
    chineseCompanyName: "Quzhou Qiying Import & Export Co., Ltd",
    website: "https://www.cowinmagnet.com",
    positioning: "magnetic separation equipment sourcing and export service partner",
    forbiddenClaims: [
      "own factory",
      "source manufacturer",
      "factory direct",
      "direct factory",
      "factory-direct manufacturer",
      "production base",
      "industry-leading manufacturer",
      "No.1 manufacturer",
      "world-leading factory",
      "official partner of this project",
      "guaranteed to solve"
    ]
  },
  products: {
    permanent: [
      "Suspended Permanent Magnetic Iron Separator",
      "Suspended Permanent Self-Unloading Magnetic Separator",
      "Self-Cleaning Overband Magnetic Separator"
    ],
    electromagnetic: [
      "Suspended Electromagnetic Iron Separator",
      "Air-Cooled Electromagnetic Separator",
      "Oil-Cooled Electromagnetic Separator",
      "Self-Cooled Electromagnetic Separator",
      "Suspended Electromagnetic Self-Unloading Magnetic Separator"
    ],
    components: [
      "Magnetic Roller",
      "Magnetic Bar",
      "Magnetic Grid",
      "Magnetic Plate",
      "Magnetic Drum",
      "Magnetic Pulley",
      "Magnetic Filter"
    ]
  },
  targetCountries: [
    "USA",
    "Australia",
    "India",
    "Germany",
    "UK",
    "South Africa",
    "UAE",
    "Brazil",
    "Canada",
    "Chile",
    "Indonesia",
    "Vietnam",
    "Malaysia",
    "Thailand",
    "Saudi Arabia"
  ],
  keywords: [
    "magnetic separator",
    "magnetic separation equipment",
    "overband magnetic separator",
    "suspended magnetic separator",
    "tramp iron removal",
    "metal contamination",
    "conveyor belt protection",
    "mining equipment",
    "mining accident",
    "recycling plant",
    "waste sorting",
    "scrap recycling",
    "cement plant",
    "coal handling",
    "aggregate processing",
    "quarry equipment",
    "bulk material handling",
    "food metal contamination",
    "plastic recycling",
    "battery recycling",
    "industrial material handling",
    "mineral processing",
    "construction waste recycling",
    "port bulk terminal",
    "power plant coal handling",
    "steel plant material handling"
  ],
  keywordTaxonomy: {
    core: [
      "magnetic separator supplier",
      "industrial magnetic separator",
      "magnetic separation equipment",
      "magnetic separator systems",
      "custom magnetic separation solution",
      "magnetic separator for conveyor belt",
      "tramp iron removal equipment",
      "industrial iron separator",
      "ferrous metal separator",
      "magnetic separation equipment supplier"
    ],
    permanent: [
      "permanent magnetic separator",
      "suspended permanent magnetic separator",
      "permanent suspended magnet",
      "overhead magnetic separator",
      "overband magnetic separator",
      "permanent overband magnet",
      "cross belt magnetic separator",
      "cross belt magnet",
      "self-cleaning magnetic separator",
      "self-cleaning overband magnet",
      "manual-cleaning suspended magnet",
      "conveyor belt magnetic separator",
      "tramp iron separator",
      "magnetic iron remover"
    ],
    electromagnetic: [
      "electromagnetic separator",
      "suspended electromagnetic separator",
      "electromagnetic overband separator",
      "self-cleaning electromagnetic separator",
      "air-cooled electromagnetic separator",
      "oil-cooled electromagnetic separator",
      "self-cooled electromagnetic separator",
      "electromagnetic iron separator",
      "conveyor electromagnetic separator",
      "high-intensity electromagnetic separator"
    ],
    drumsAndMineral: [
      "magnetic drum separator",
      "wet drum magnetic separator",
      "dry drum magnetic separator",
      "permanent magnetic drum",
      "magnetic pulley",
      "head pulley magnet",
      "wet magnetic separator",
      "dry magnetic separator",
      "drum magnetic separator for mining",
      "magnetic separator for mineral processing",
      "magnetic separator for iron ore",
      "dense media magnetic separator",
      "coal washing magnetic separator",
      "tailings recovery magnetic separator"
    ],
    components: [
      "magnetic bar",
      "magnetic rod",
      "magnetic grate",
      "magnetic grid separator",
      "magnetic filter",
      "pipeline magnetic separator",
      "magnetic tube",
      "magnetic roller"
    ]
  },
  newsSources: [
    {
      sourceName: "Recycling Today",
      sourceType: "rss",
      sourceUrl: "https://www.recyclingtoday.com/rss/",
      sourceGroup: "trade-publications",
      enabled: true,
      language: "en",
      region: "global",
      category: "recycling",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Recycling Today / original article"
    },
    {
      sourceName: "Mining.com",
      sourceType: "rss",
      sourceUrl: "https://www.mining.com/feed/",
      sourceGroup: "industry-news",
      enabled: true,
      language: "en",
      region: "global",
      category: "mining",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Mining.com / original article"
    },
    {
      sourceName: "Food Safety News",
      sourceType: "rss",
      sourceUrl: "https://www.foodsafetynews.com/feed/",
      sourceGroup: "trade-publications",
      enabled: true,
      language: "en",
      region: "global",
      category: "food-processing",
      fetchInterval: "daily",
      allowedUseImage: true,
      defaultAttributionText: "Food Safety News / original article"
    },
    {
      sourceName: "Waste360",
      sourceType: "rss",
      sourceUrl: "https://www.waste360.com/rss.xml",
      sourceGroup: "trade-publications",
      enabled: true,
      language: "en",
      region: "United States",
      category: "recycling",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Waste360 / original article"
    },
    {
      sourceName: "Powder & Bulk Solids",
      sourceType: "rss",
      sourceUrl: "https://www.powderbulksolids.com/rss.xml",
      sourceGroup: "engineering-forums",
      enabled: true,
      language: "en",
      region: "global",
      category: "bulk-material-handling",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Powder & Bulk Solids / original article"
    },
    {
      sourceName: "Australian Mining",
      sourceType: "rss",
      sourceUrl: "https://www.australianmining.com.au/feed/",
      sourceGroup: "industry-news",
      enabled: true,
      language: "en",
      region: "Australia",
      category: "mining",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Australian Mining / original article"
    },
    {
      sourceName: "NIST News",
      sourceType: "rss",
      sourceUrl: "https://www.nist.gov/news-events/news/rss.xml",
      sourceGroup: "government-standards",
      enabled: true,
      language: "en",
      region: "United States",
      category: "standards",
      fetchInterval: "daily",
      allowedUseImage: true,
      defaultAttributionText: "NIST / original article"
    },
    {
      sourceName: "OSHA News Releases",
      sourceType: "rss",
      sourceUrl: "https://www.osha.gov/news/newsreleases.xml",
      sourceGroup: "government-standards",
      enabled: true,
      language: "en",
      region: "United States",
      category: "industrial-safety",
      fetchInterval: "daily",
      allowedUseImage: true,
      defaultAttributionText: "OSHA / original article"
    },
    {
      sourceName: "Google News RSS - Magnetic Separator",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=magnetic%20separator%20OR%20magnetic%20separation%20equipment&hl=en-US&gl=US&ceid=US:en",
      sourceGroup: "industry-news",
      enabled: true,
      language: "en",
      region: "United States",
      category: "magnetic-separation",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Google News RSS result / original publisher"
    },
    {
      sourceName: "Google News RSS - Recycling Equipment",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=recycling%20equipment%20metal%20separation%20OR%20waste%20sorting&hl=en-US&gl=US&ceid=US:en",
      sourceGroup: "trade-publications",
      enabled: true,
      language: "en",
      region: "global",
      category: "recycling",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Google News RSS result / original publisher"
    },
    {
      sourceName: "Google News RSS - Critical Minerals Processing",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=critical%20minerals%20processing%20OR%20rare%20earth%20processing%20plant%20OR%20lithium%20extraction%20plant&hl=en-US&gl=US&ceid=US:en",
      sourceGroup: "government-standards",
      enabled: true,
      language: "en",
      region: "global",
      category: "mining",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Google News RSS result / original publisher"
    },
    {
      sourceName: "Google News RSS - Conveyor Protection",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=conveyor%20belt%20mining%20crusher%20OR%20quarry%20conveyor%20aggregate%20processing%20OR%20bulk%20material%20handling%20equipment&hl=en-US&gl=US&ceid=US:en",
      sourceGroup: "engineering-forums",
      enabled: true,
      language: "en",
      region: "global",
      category: "bulk-material-handling",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Google News RSS result / original publisher"
    },
    {
      sourceName: "Google News RSS - Metal Contamination Control",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=metal%20contamination%20food%20processing%20OR%20foreign%20material%20contamination%20food%20plant%20OR%20magnetic%20trap%20food%20processing&hl=en-US&gl=US&ceid=US:en",
      sourceGroup: "manufacturer-blogs",
      enabled: true,
      language: "en",
      region: "global",
      category: "food-processing",
      fetchInterval: "hourly",
      allowedUseImage: true,
      defaultAttributionText: "Google News RSS result / original publisher"
    }
  ],
  sourcePool: {
    requiredGroupsPerRun: Number(process.env.NEWS_REQUIRED_SOURCE_GROUPS || 1),
    requiredNewDomainsPerRun: Number(process.env.NEWS_REQUIRED_NEW_DOMAINS || 0),
    groups: [
      "industry-news",
      "manufacturer-blogs",
      "trade-publications",
      "government-standards",
      "engineering-forums"
    ]
  },
  diversity: {
    semanticSimilarityRejectThreshold: Number(process.env.NEWS_SEMANTIC_REJECT_THRESHOLD || 0.85),
    minimumInformationGainScore: Number(process.env.NEWS_MIN_INFORMATION_GAIN_SCORE || -5),
    maxSameDomainInRecent10: Number(process.env.NEWS_MAX_SAME_DOMAIN_RECENT_10 || 8),
    preferUnusedSourceHours: 72,
    topicLimits: {
      per24h: Number(process.env.NEWS_TOPIC_LIMIT_24H || 8),
      per7d: Number(process.env.NEWS_TOPIC_LIMIT_7D || 40)
    }
  },
  sources: {
    rss: [
      "https://www.recyclingtoday.com/rss/",
      "https://www.mining.com/feed/",
      "https://www.foodsafetynews.com/feed/"
    ],
    apiProviders: ["bing-news", "newsapi", "google-custom-search"]
  },
  excludedKeywords: ["election", "war", "celebrity", "sports", "stock price rumor", "crypto", "entertainment"],
  scoring: {
    minimumFinalScore: Number(process.env.NEWS_MIN_RELEVANCE_SCORE || 35),
    weights: {
      relevance: 0.24,
      painPoint: 0.22,
      industryValue: 0.18,
      marketValue: 0.14,
      freshness: 0.1,
      authority: 0.07,
      contentOpportunity: 0.05
    }
  },
  output: {
    directory: "data/news-opportunities",
    maxItemsPerRun: Number(process.env.NEWS_RUN_LIMIT || 60),
    generatedArticlesDirectory: "data/news-generated"
  },
  imagePolicy: {
    enableImageFromSource: process.env.NEWS_ENABLE_SOURCE_IMAGES !== "false",
    enableAiGeneratedImage: false,
    minInlineImages: Number(process.env.NEWS_MIN_INLINE_IMAGES || 0),
    maxInlineImages: Number(process.env.NEWS_MAX_INLINE_IMAGES || 5),
    preferRealLibraryImages: true,
    allowSourceImages: process.env.NEWS_ENABLE_SOURCE_IMAGES !== "false",
    allowAiGeneratedPhotorealisticImages: false,
    imageStyle: "photorealistic-industrial",
    avoidIllustrationStyle: true,
    enableCompanyImageFallback: false,
    defaultCoverTemplate: "source-article-image-or-none"
  },
  workflow: {
    statuses: ["fetched", "scored", "generated", "reviewed", "approved", "rejected", "published"],
    defaultStatus: "generated"
  }
};
