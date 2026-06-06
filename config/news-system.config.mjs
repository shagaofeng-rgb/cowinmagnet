export const newsSystemConfig = {
  siteUrl: process.env.SITE_URL || "https://www.cowinmagnet.com",
  defaultLanguage: "en",
  publishMode: process.env.NEWS_PUBLISH_MODE || "published",
  publishInterval: "hourly",
  maxPostsPerDay: Number(process.env.NEWS_MAX_POSTS_PER_DAY || 24),
  minRelevanceScore: Number(process.env.NEWS_MIN_RELEVANCE_SCORE || 60),
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
      "production base",
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
  newsSources: [
    {
      sourceName: "Recycling Today",
      sourceType: "rss",
      sourceUrl: "https://www.recyclingtoday.com/rss/",
      enabled: true,
      language: "en",
      region: "global",
      category: "recycling",
      fetchInterval: "hourly",
      allowedUseImage: false,
      defaultAttributionText: "Recycling Today / original article"
    },
    {
      sourceName: "Mining.com",
      sourceType: "rss",
      sourceUrl: "https://www.mining.com/feed/",
      enabled: true,
      language: "en",
      region: "global",
      category: "mining",
      fetchInterval: "hourly",
      allowedUseImage: false,
      defaultAttributionText: "Mining.com / original article"
    },
    {
      sourceName: "Food Safety News",
      sourceType: "rss",
      sourceUrl: "https://www.foodsafetynews.com/feed/",
      enabled: true,
      language: "en",
      region: "global",
      category: "food-processing",
      fetchInterval: "daily",
      allowedUseImage: false,
      defaultAttributionText: "Food Safety News / original article"
    },
    {
      sourceName: "Google News RSS - Magnetic Separator",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=magnetic%20separator%20OR%20magnetic%20separation%20equipment&hl=en-US&gl=US&ceid=US:en",
      enabled: true,
      language: "en",
      region: "United States",
      category: "magnetic-separation",
      fetchInterval: "hourly",
      allowedUseImage: false,
      defaultAttributionText: "Google News RSS result / original publisher"
    },
    {
      sourceName: "Google News RSS - Recycling Equipment",
      sourceType: "rss",
      sourceUrl: "https://news.google.com/rss/search?q=recycling%20equipment%20metal%20separation%20OR%20waste%20sorting&hl=en-US&gl=US&ceid=US:en",
      enabled: true,
      language: "en",
      region: "global",
      category: "recycling",
      fetchInterval: "hourly",
      allowedUseImage: false,
      defaultAttributionText: "Google News RSS result / original publisher"
    }
  ],
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
    minimumFinalScore: Number(process.env.NEWS_MIN_RELEVANCE_SCORE || 60),
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
    maxItemsPerRun: 8,
    generatedArticlesDirectory: "data/news-generated"
  },
  imagePolicy: {
    enableImageFromSource: process.env.NEWS_ENABLE_SOURCE_IMAGES !== "false",
    enableAiGeneratedImage: false,
    minInlineImages: Number(process.env.NEWS_MIN_INLINE_IMAGES || 3),
    maxInlineImages: Number(process.env.NEWS_MAX_INLINE_IMAGES || 5),
    preferRealLibraryImages: true,
    allowSourceImages: process.env.NEWS_ENABLE_SOURCE_IMAGES !== "false",
    allowAiGeneratedPhotorealisticImages: process.env.NEWS_ALLOW_AI_PHOTO_IMAGES !== "false",
    imageStyle: "photorealistic-industrial",
    avoidIllustrationStyle: true,
    enableCompanyImageFallback: true,
    defaultCoverTemplate: "company-library-real-industrial-photo"
  },
  workflow: {
    statuses: ["fetched", "scored", "generated", "reviewed", "approved", "rejected", "published"],
    defaultStatus: "generated"
  }
};
