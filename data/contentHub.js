import { getCmsItems } from "../lib/cmsStore.js";
import { generatedNewsPosts } from "./generatedNews.js";

export const blogPosts = [
  {
    slug: "how-to-choose-overband-magnetic-separator",
    title: "How to Choose an Overband Magnetic Separator",
    excerpt: "A buyer-focused guide for belt width, burden depth, iron size, installation height and cleaning method.",
    publishedAt: "2026-05-20",
    views: 1280,
    category: "Buying Guide",
    href: "/blog/how-to-choose-overband-magnetic-separator",
    coverImage: "/assets/content/blog-overband-selection.svg",
    coverAlt: "Overband magnetic separator selection guide for conveyor belt applications",
    imageCaption: "Selection starts with material flow, installation height and cleaning method.",
    sections: [
      {
        heading: "Start From the Working Condition",
        body:
          "A good separator recommendation should not start from a model number. It should start from material type, belt width, burden depth, iron size and whether the line runs continuously. These details tell us whether a manual suspended magnet, a self-cleaning overband magnet or an electromagnetic separator is more practical."
      },
      {
        heading: "Why Installation Height Matters",
        body:
          "Many quotation mistakes happen because the buyer only sends conveyor width. The distance from the magnet surface to the material layer changes magnetic reach dramatically, so drawings, site photos and the planned suspension height are useful before final selection."
      },
      {
        heading: "Cowinmagnet Viewpoint",
        body:
          "When we review an inquiry, we prefer to ask one more site question before giving a model. It may feel slower at the beginning, but it usually saves time later during installation, testing and export communication."
      }
    ]
  },
  {
    slug: "magnetic-separator-for-waste-recycling-lines",
    title: "Magnetic Separator for Waste Recycling Lines",
    excerpt: "Application notes for ferrous recovery, conveyor protection and recycling plant equipment stability.",
    publishedAt: "2026-05-22",
    views: 964,
    category: "Application",
    href: "/blog/magnetic-separator-for-waste-recycling-lines",
    coverImage: "/assets/content/blog-recycling-line.svg",
    coverAlt: "Magnetic separator used in a waste recycling conveyor line",
    imageCaption: "Waste recycling lines often need both ferrous recovery and equipment protection.",
    sections: [
      {
        heading: "Two Goals: Recovery and Protection",
        body:
          "In recycling plants, magnetic separation is rarely only about one task. The same separator may recover saleable ferrous material and also stop tramp iron from damaging crushers, shredders, screens or downstream sorting equipment."
      },
      {
        heading: "Self-Cleaning Is Usually Worth Discussing",
        body:
          "If iron appears frequently, a self-cleaning separator keeps the line moving and reduces manual cleaning pressure. Manual cleaning can still be suitable for low contamination, but it should be chosen deliberately rather than by price alone."
      },
      {
        heading: "Cowinmagnet Viewpoint",
        body:
          "For overseas buyers, the most helpful inquiry photos are often simple: conveyor layout, material on the belt, available space above the belt and where the discharged iron can safely fall."
      }
    ]
  },
  {
    slug: "permanent-vs-electromagnetic-separator",
    title: "Permanent vs Electromagnetic Separator",
    excerpt: "A practical decision guide for magnetic force, power consumption, cleaning method and site conditions.",
    publishedAt: "2026-05-24",
    views: 1136,
    category: "Product Comparison",
    href: "/blog/permanent-vs-electromagnetic-separator",
    coverImage: "/assets/content/blog-permanent-vs-electromagnetic.svg",
    coverAlt: "Permanent magnetic separator compared with electromagnetic separator",
    imageCaption: "Permanent and electromagnetic separators solve different site problems.",
    sections: [
      {
        heading: "Permanent Magnets Reduce Daily Power Demand",
        body:
          "Permanent separators do not need power to create the magnetic field, so they are attractive for many recycling, quarrying, coal and cement applications. The drive motor is only needed when a self-cleaning discharge belt is used."
      },
      {
        heading: "Electromagnets Fit Deeper or Heavier Burdens",
        body:
          "Electromagnetic separators are usually considered when the burden depth is larger, the tramp iron is buried deeper, or the site needs adjustable magnetic force. The tradeoff is higher power and a more careful electrical configuration."
      },
      {
        heading: "Cowinmagnet Viewpoint",
        body:
          "There is no universal winner. We normally compare burden depth, iron size, line continuity and maintenance resources before suggesting a permanent or electromagnetic direction."
      }
    ]
  }
];

export const newsCategories = [
  {
    slug: "industry-news",
    title: "Industry News",
    description: "Industry updates related to magnetic separation, recycling, mining and bulk material handling."
  },
  {
    slug: "market-trends",
    title: "Market Trends",
    description: "Market observations for recycling, quarrying, cement, coal and industrial equipment buyers."
  },
  {
    slug: "technology-updates",
    title: "Technology Updates",
    description: "Technology trends, product-selection signals and process updates related to magnetic separation."
  },
  {
    slug: "company-insights",
    title: "Company Insights",
    description: "Cowinmagnet viewpoints, sourcing observations, service notes and project communication updates."
  },
  {
    slug: "global-updates",
    title: "Global Updates",
    description: "International policy, trade and regional market signals for global industrial buyers."
  }
];

export const newsPosts = [
  {
    slug: "ai-metal-recovery-platforms-recycling",
    title: "AI Metal Recovery Platforms Put More Pressure on Upstream Ferrous Removal",
    excerpt:
      "Recent recycling technology news shows AI sorting moving quickly, but upstream magnetic protection still matters before material reaches expensive equipment.",
    publishedAt: "2026-05-31",
    views: 921,
    category: "technology-updates",
    categoryTitle: "Technology Updates",
    seoTitle: "AI Metal Recovery Platforms and Upstream Ferrous Removal | Cowinmagnet News",
    seoDescription:
      "Industry news and Cowinmagnet viewpoint on AI metal recovery platforms and why upstream magnetic separation still matters in recycling lines.",
    href: "/news/ai-metal-recovery-platforms-recycling",
    coverImage: "/images/industries/recycling-magnetic-separation-solution.webp",
    coverAlt: "AI metal recovery and magnetic separation in a recycling plant",
    imageCaption: "Local Cowinmagnet cover image based on AI sorting and metal recovery news.",
    sections: [
      {
        heading: "What Happened",
        body:
          "TOMRA Recycling announced new AI-enabled metal recovery platforms around IFAT 2026, positioning sensor sorting as a stronger decision layer for mixed metal streams. Axios also reported on a large AI-powered recycling center in Ohio, showing how automated decisions on fast conveyors are becoming normal in modern MRFs."
      },
      {
        heading: "Why Buyers Should Care",
        body:
          "AI sorting can improve classification, but it does not remove the need for earlier ferrous capture. In many plants, tramp iron should be controlled before crushers, shredders and transfer points so the downstream sorting system can work with a more stable material stream."
      },
      {
        heading: "Cowinmagnet Viewpoint",
        body:
          "Our feeling is simple: AI is exciting, but a recycling line still has to survive the rough material at the front end. A well-placed overband magnet is not a glamorous device, yet it often protects the expensive machines that make the smarter process possible."
      }
    ],
    sources: [
      {
        name: "TOMRA Recycling",
        date: "May 7, 2026",
        title: "GAINnext next-generation AI sorting platform",
        url: "https://www.tomra.com/waste-metal-recycling/media-center/news/2026/tomra-launches-next-generation-ai-platform-and-expands-gainnext-ecosystem"
      },
      {
        name: "TOMRA Recycling",
        date: "May 2026",
        title: "FINDER AI metal recovery platform",
        url: "https://www.tomra.com/waste-metal-recycling/media-center/news/2026/tomra-recycling-launches-the-new-finder"
      },
      {
        name: "Axios Columbus",
        date: "April 23, 2026",
        title: "AI-powered recycling center in Ohio",
        url: "https://www.axios.com/local/columbus/2026/04/23/ai-rumpke-recycling-center-ohio-ai"
      }
    ]
  },
  {
    slug: "tramp-metal-control-conexpo-aggregates",
    title: "Tramp Metal Control Gets Fresh Attention for Aggregates and Quarry Conveyors",
    excerpt:
      "CONEXPO-focused equipment news again highlights a familiar problem: ferrous tramp metal can damage crushers, belts and downstream machinery.",
    publishedAt: "2026-05-30",
    views: 804,
    category: "industry-news",
    categoryTitle: "Industry News",
    seoTitle: "Tramp Metal Control for Aggregates and Quarry Conveyors | Cowinmagnet News",
    seoDescription:
      "News analysis on tramp metal control for aggregate and quarry conveyors, with Cowinmagnet notes on magnetic separator selection.",
    href: "/news/tramp-metal-control-conexpo-aggregates",
    coverImage: "/images/industries/cement-aggregate-magnetic-separation.webp",
    coverAlt: "Tramp metal control above an aggregate conveyor before a crusher",
    imageCaption: "Local Cowinmagnet cover image for quarry conveyor protection news.",
    sections: [
      {
        heading: "What Happened",
        body:
          "Eriez said it would highlight tramp metal control and feeding solutions at CONEXPO-CON/AGG 2026. The message is very close to what quarry and cement buyers tell suppliers every day: higher tonnage is useful only when crushers and conveyors stay protected."
      },
      {
        heading: "Why Buyers Should Care",
        body:
          "A suspended permanent magnet, suspended electromagnet, magnetic head pulley or metal detector can each play a different role. The right choice depends on belt width, burden depth, particle size, tramp metal frequency and where the plant can safely discharge captured material."
      },
      {
        heading: "Cowinmagnet Viewpoint",
        body:
          "When a buyer sends only the belt width, we can give a rough direction. When they send the crusher position, burden depth and installation photos, the recommendation becomes much more useful. Protection is not just a product. It is a layout decision."
      }
    ],
    sources: [
      {
        name: "Eriez",
        date: "CONEXPO-CON/AGG 2026, March 3-7, 2026",
        title: "Tramp metal control and feeding solutions",
        url: "https://www.eriez.com/Eriez-News/Eriez-to-Highlight-Tramp-Metal-Control-and-Feeding-Solutions-at-CONEXPO-CONAGG.htm"
      },
      {
        name: "Geomechanics.io",
        date: "March 2, 2026",
        title: "Design and uptime notes for plant engineers",
        url: "https://www.geomechanics.io/news/article/eriez-tramp-metal-control-at-conexpo-design-and-uptime-notes-for-plant-engineers?category=mining"
      }
    ]
  },
  {
    slug: "rare-earth-magnet-recycling-supply-chain",
    title: "Rare Earth Magnet Recycling News Points to a More Practical Magnet Supply Chain",
    excerpt:
      "Research and business updates in May 2026 show more attention on recovering rare earths and building recycled magnet supply chains.",
    publishedAt: "2026-05-29",
    views: 877,
    category: "market-trends",
    categoryTitle: "Market Trends",
    seoTitle: "Rare Earth Magnet Recycling and Magnet Supply Chain Trends | Cowinmagnet News",
    seoDescription:
      "Market trend analysis on rare earth magnet recycling and what it means for permanent magnet equipment buyers.",
    href: "/news/rare-earth-magnet-recycling-supply-chain",
    coverImage: "/images/industries/mining-industry-magnetic-separation-cover.png",
    coverAlt: "Rare earth magnet recycling and permanent magnet supply chain",
    imageCaption: "Local Cowinmagnet cover image for rare earth magnet recycling news.",
    sections: [
      {
        heading: "What Happened",
        body:
          "Phys.org reported on research into greener rare earth recovery from permanent magnets, while EurekAlert covered an EU-funded HARMONY project milestone for recycled rare earth magnet components. Later in May, business news around Mkango and Heraeus Remloy pointed to more commercial activity in magnet recycling."
      },
      {
        heading: "Why Buyers Should Care",
        body:
          "Permanent magnet equipment buyers do not need to become raw-material traders, but they should understand that magnet quality, material grade and supply stability affect delivery discussions. Stronger recycling routes may make the wider magnet supply chain more resilient over time."
      },
      {
        heading: "Cowinmagnet Viewpoint",
        body:
          "For us, this topic feels close to the workshop floor. A magnetic separator looks simple from the outside, but the magnet system inside is the heart of the product. Better recycling and supply chain planning are good news for buyers who care about stable quality and long-term availability."
      }
    ],
    sources: [
      {
        name: "Phys.org",
        date: "May 5, 2026",
        title: "Rare earth recovery from permanent magnets",
        url: "https://phys.org/news/2026-05-greener-recovers-rare-earths-permanent.html"
      },
      {
        name: "EurekAlert",
        date: "May 6, 2026",
        title: "Recycled rare earth magnets milestone in HARMONY project",
        url: "https://www.eurekalert.org/news-releases/1126921"
      },
      {
        name: "Baker McKenzie",
        date: "May 26, 2026",
        title: "Mkango agreement with Heraeus Remloy",
        url: "https://www.bakermckenzie.com/en/newsroom/2026/05/mkango-agreement-with-heraeus"
      }
    ]
  }
];

function isRemoteImage(value = "") {
  return /^https?:\/\//i.test(String(value));
}

function processedNewsImageUrl(imageUrl = "", sourcePageUrl = "", width = 980) {
  if (!isRemoteImage(imageUrl)) return "";
  const query = new URLSearchParams({ src: imageUrl, ref: sourcePageUrl || "", w: String(width) });
  return `/api/news-image?${query.toString()}`;
}

function stableAutomationImages(post = {}) {
  const sourcePageUrl = post.canonicalSourceUrl || post.automation?.originalUrl || post.sourceImage?.sourcePageUrl || "";
  const sourceImageUrl =
    post.sourceImage?.originalImageUrl ||
    post.sourceImage?.imageUrl ||
    (isRemoteImage(post.coverImage) ? post.coverImage : "");
  const coverImage = processedNewsImageUrl(sourceImageUrl, sourcePageUrl);
  return {
    coverImage,
    coverAlt: post.sourceImage?.imageAlt || post.coverAlt || post.title || "",
    imageCaption:
      post.sourceImage?.imageCaption ||
      post.imageCaption ||
      (post.source || post.sources?.[0]?.name ? `Article image. Image source: ${post.source || post.sources?.[0]?.name}.` : ""),
    imageSourceName: post.sourceImage?.sourceName || post.source || post.sources?.[0]?.name || "",
    imageSourceUrl: sourcePageUrl,
    imageLicenseNote: post.imageLicenseNote || (post.source || post.sources?.[0]?.name ? `Image source: ${post.source || post.sources?.[0]?.name}.` : ""),
    bodyImages: []
  };
}

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

async function getGeneratedNewsPosts() {
  return generatedNewsPosts
    .filter((post) => post.status === "published" && post.quality?.passed !== false)
    .map((post) => {
      const stableImages = stableAutomationImages(post);
      return {
        ...post,
        ...stableImages,
        type: "news",
        href: post.href || `/news/${post.slug}`,
        views: Number(post.views || 0),
        category: post.category || "industry-news",
        categoryTitle: post.categoryTitle || post.category || "Industry News",
        seoTitle: post.seoTitle || post.title,
        seoDescription: post.seoDescription || post.excerpt
      };
    });
}

export async function getNewsPosts() {
  const [uploadedNews, generatedNews] = await Promise.all([getCmsItems("news"), getGeneratedNewsPosts()]);
  const merged = [
    ...uploadedNews.map((post) => ({
      ...post,
      ...(post.automation ? stableAutomationImages(post) : {}),
      href: post.href || `/news/${post.slug}`,
      views: Number(post.views || 0),
      categoryTitle: post.categoryTitle || post.category,
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.excerpt
    })),
    ...generatedNews,
    ...newsPosts
  ];
  const bySlug = new Map();
  merged.forEach((post) => {
    if (!post?.slug || bySlug.has(post.slug)) return;
    bySlug.set(post.slug, post);
  });
  return [...bySlug.values()].sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
}

export async function getNewsPost(slug) {
  const posts = await getNewsPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getNewsCategories() {
  const [uploadedNews, generatedNews] = await Promise.all([getCmsItems("news"), getGeneratedNewsPosts()]);
  const map = new Map(newsCategories.map((category) => [category.slug, category]));

  [...uploadedNews, ...generatedNews].forEach((post) => {
    if (!post.category || map.has(post.category)) return;
    map.set(post.category, {
      slug: post.category,
      title: post.categoryTitle || post.category,
      description: post.categoryDescription || "Industry news uploaded from the Cowinmagnet admin backend."
    });
  });

  return [...map.values()];
}
