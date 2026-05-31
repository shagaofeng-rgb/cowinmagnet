export const blogPosts = [
  {
    slug: "how-to-choose-overband-magnetic-separator",
    title: "How to Choose an Overband Magnetic Separator",
    excerpt: "A buyer-focused guide for belt width, burden depth, iron size, installation height and cleaning method.",
    publishedAt: "2026-05-20",
    views: 1280,
    category: "Buying Guide",
    href: "/blog/how-to-choose-overband-magnetic-separator"
  },
  {
    slug: "magnetic-separator-for-waste-recycling-lines",
    title: "Magnetic Separator for Waste Recycling Lines",
    excerpt: "Application notes for ferrous recovery, conveyor protection and recycling plant equipment stability.",
    publishedAt: "2026-05-22",
    views: 964,
    category: "Application",
    href: "/blog/magnetic-separator-for-waste-recycling-lines"
  },
  {
    slug: "permanent-vs-electromagnetic-separator",
    title: "Permanent vs Electromagnetic Separator",
    excerpt: "A practical decision guide for magnetic force, power consumption, cleaning method and site conditions.",
    publishedAt: "2026-05-24",
    views: 1136,
    category: "Product Comparison",
    href: "/blog/permanent-vs-electromagnetic-separator"
  }
];

export const newsCategories = [
  {
    slug: "recycling-industry-trends",
    title: "Recycling Industry Trends",
    description: "Market updates related to ferrous recovery, waste sorting and recycling plant efficiency."
  },
  {
    slug: "mining-quarry-equipment-news",
    title: "Mining & Quarry Equipment News",
    description: "Industry notes about conveyor protection, crusher safety and material handling operations."
  },
  {
    slug: "magnetic-separation-technology-updates",
    title: "Magnetic Separation Technology Updates",
    description: "News and observations about magnetic separation applications and equipment selection trends."
  }
];

export const newsPosts = [
  {
    slug: "recycling-metal-contamination-costs",
    title: "Recycling Operators Review Metal Contamination Costs in Sorting Lines",
    excerpt:
      "A Cowinmagnet viewpoint on why ferrous contamination remains a practical equipment selection issue for recycling plants.",
    publishedAt: "2026-05-31",
    views: 732,
    category: "recycling-industry-trends",
    href: "/news/recycling-metal-contamination-costs"
  },
  {
    slug: "conveyor-protection-mining-cement",
    title: "Conveyor Belt Protection Becomes a Bigger Topic in Mining and Cement Handling",
    excerpt:
      "Industry-focused notes on belt width, burden depth and tramp iron removal before crushers and transfer points.",
    publishedAt: "2026-05-31",
    views: 689,
    category: "mining-quarry-equipment-news",
    href: "/news/conveyor-protection-mining-cement"
  },
  {
    slug: "magnetic-separator-selection-trends",
    title: "Magnetic Separator Selection Trends for Bulk Material Handling Buyers",
    excerpt:
      "Technology observations on choosing permanent, self-cleaning and electromagnetic separators for different site conditions.",
    publishedAt: "2026-05-29",
    views: 846,
    category: "magnetic-separation-technology-updates",
    href: "/news/magnetic-separator-selection-trends"
  }
];

export function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatViews(views) {
  return new Intl.NumberFormat("en", { notation: views >= 10000 ? "compact" : "standard" }).format(views);
}
