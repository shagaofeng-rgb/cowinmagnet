export const newsSystemConfig = {
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
  sources: {
    rss: [
      "https://www.recyclingtoday.com/rss/",
      "https://www.mining.com/feed/",
      "https://www.foodsafetynews.com/feed/"
    ],
    apiProviders: ["bing-news", "newsapi", "google-custom-search"]
  },
  scoring: {
    minimumFinalScore: 68,
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
    maxItemsPerRun: 8
  },
  workflow: {
    statuses: ["fetched", "scored", "generated", "reviewed", "approved", "rejected", "published"],
    defaultStatus: "generated"
  }
};
