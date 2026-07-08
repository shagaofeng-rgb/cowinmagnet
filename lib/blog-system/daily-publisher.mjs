import crypto from "node:crypto";
import { getCmsItems, saveCmsItem, slugify } from "../cmsStore.js";

const STATIC_BLOG_FINGERPRINTS = [
  "wet-drum-magnetic-separator-iron-ore-processing-brazil",
  "how-to-choose-overband-magnetic-separator",
  "permanent-vs-electromagnetic-separator",
  "magnetic-separator-solutions-mining-recycling-cement-aggregate"
];

const BLOG_TOPICS = [
  {
    title: "Magnetic Separators for Crusher Protection in African Quarries",
    region: "Africa",
    buyer: "Quarry operators, aggregate producers, crusher plant managers and EPC contractors",
    primaryKeyword: "magnetic separator for crusher protection in African quarries",
    secondaryKeywords: ["crusher protection magnetic separator", "quarry conveyor magnet", "tramp iron removal for stone crusher"],
    category: "Regional Application",
    image: "/images/industries/mining-magnetic-separator-conveyor.webp",
    productLinks: [
      ["/products/permanent-overband-magnetic-separator", "Permanent Overband Magnetic Separator"],
      ["/products/suspended-electromagnetic-conveyor-belt-separator", "Suspended Electromagnetic Conveyor Belt Separator"],
      ["/products/magnetic-head-pulley", "Magnetic Head Pulley"]
    ],
    industryLink: ["/industries/mining", "Mining magnetic separation solutions"],
    application: "crusher protection before jaw crushers, cone crushers, impact crushers and screening lines",
    material: "limestone, granite, basalt, river stone, mixed aggregate and quarry overburden",
    risk: "tramp iron can damage crusher liners, belts, feeders and screens",
    unsuitable: "the target contamination is non-ferrous metal only, the material layer is too deep for the selected magnet, or the plant cannot provide a safe discharge area"
  },
  {
    title: "How to Remove Tramp Iron from Conveyor Belts in Cement Plants",
    region: "Africa and Asia",
    buyer: "Cement plant engineers, bulk material handling teams and maintenance managers",
    primaryKeyword: "remove tramp iron from conveyor belts in cement plants",
    secondaryKeywords: ["cement plant magnetic separator", "conveyor belt tramp iron removal", "magnetic separator for cement raw material"],
    category: "Industry Application",
    image: "/images/industries/cement-aggregate-magnetic-separation.webp",
    productLinks: [
      ["/products/rcyd-type-permanent-magnet-self-dumping-iron-remover", "RCYD permanent magnet self dumping iron remover"],
      ["/products/rcdd-type-self-cooling-self-dumping-electromagnetic-iron-remover", "RCDD self cooling electromagnetic iron remover"],
      ["/products/gjt-type-window-metal-detector", "GJT window metal detector"]
    ],
    industryLink: ["/industries/cement-aggregate", "Cement and aggregate magnetic separation"],
    application: "iron removal from limestone, clay, gypsum, clinker additives and coal conveying lines",
    material: "cement raw material, limestone, coal, additives and mixed bulk solids",
    risk: "unremoved tramp iron can damage crushers, vertical mills, belt conveyors and dosing equipment",
    unsuitable: "material is enclosed in a chute where a suspended magnet cannot reach the burden or the contamination is stainless steel and non-ferrous metal only"
  },
  {
    title: "Magnetic Separator Selection for Gold Mining Operations",
    region: "Africa",
    buyer: "Gold mining plants, mineral processing engineers and mining equipment distributors",
    primaryKeyword: "magnetic separator selection for gold mining operations",
    secondaryKeywords: ["gold mining magnetic separator", "tramp iron removal for gold ore", "magnetic separation in gold processing"],
    category: "Mining Guide",
    image: "/images/industries/mining-industry-magnetic-separation-cover.png",
    productLinks: [
      ["/products/suspended-permanent-magnetic-separator", "Suspended Permanent Magnetic Separator"],
      ["/products/electromagnet-separator", "Electromagnet Separator"],
      ["/products/dry-drum-magnetic-separator", "Dry Drum Magnetic Separator"]
    ],
    industryLink: ["/industries/mining", "Mining magnetic separation solutions"],
    application: "crusher protection, conveyor iron removal and selected magnetic mineral separation around gold ore circuits",
    material: "gold ore, waste rock, crushed ore and mined bulk material",
    risk: "steel pieces from buckets, liners, bolts or tools can enter crushers and mills",
    unsuitable: "the buyer expects magnetic separation to recover gold directly or replace gravity, flotation or leaching steps"
  },
  {
    title: "Conveyor Belt Magnetic Separator for Coal Handling Plants",
    region: "Asia and Africa",
    buyer: "Coal handling plants, power plants, cement plants and conveyor system integrators",
    primaryKeyword: "conveyor belt magnetic separator for coal handling plants",
    secondaryKeywords: ["coal conveyor magnetic separator", "tramp iron removal coal handling", "coal belt magnet"],
    category: "Industry Application",
    image: "/images/industries/mining-scenarios/coal.jpg",
    productLinks: [
      ["/products/rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover", "Explosion-proof permanent self dumping iron remover"],
      ["/products/rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover", "Explosion-proof electromagnetic self dumping iron remover"],
      ["/products/hmdn-coal-washing-special-magnetic-separator", "Coal washing special magnetic separator"]
    ],
    industryLink: ["/industries/mining", "Mining magnetic separation solutions"],
    application: "iron removal from coal conveyors before crushers, bunkers, pulverizers and transfer points",
    material: "raw coal, washed coal, coal gangue and mixed coal handling streams",
    risk: "ferrous metal can damage crushers, mills and conveyor transfer equipment",
    unsuitable: "explosion-proof requirements are not clarified or the installation point lacks enough clearance for safe maintenance"
  },
  {
    title: "Magnetic Separators for Mining Conveyors in Chile and Peru",
    region: "South America",
    buyer: "Copper and iron ore mines, EPC contractors and conveyor equipment suppliers",
    primaryKeyword: "magnetic separators for mining conveyors in Chile and Peru",
    secondaryKeywords: ["mining conveyor magnetic separator", "copper mine tramp iron removal", "South America mining magnet"],
    category: "Regional Application",
    image: "/images/industries/mining-magnetic-separator-conveyor.webp",
    productLinks: [
      ["/products/permanent-overband-magnetic-separator", "Permanent Overband Magnetic Separator"],
      ["/products/suspended-electromagnetic-conveyor-belt-separator", "Suspended Electromagnetic Conveyor Belt Separator"],
      ["/products/gjt-type-window-metal-detector", "GJT window metal detector"]
    ],
    industryLink: ["/industries/mining", "Mining magnetic separation solutions"],
    application: "tramp iron removal from high-capacity mine conveyors before crushers, mills and transfer stations",
    material: "copper ore, iron ore, mixed rock, crushed ore and mine waste",
    risk: "large ferrous pieces can damage crushers and cause unplanned shutdowns",
    unsuitable: "the line requires non-ferrous metal detection only or the burden depth exceeds the selected magnetic reach"
  },
  {
    title: "Eddy Current Separators for Recycling Plants in Asia",
    region: "Asia",
    buyer: "Recycling plant owners, MRF operators, waste sorting integrators and equipment distributors",
    primaryKeyword: "eddy current separator for recycling plants in Asia",
    secondaryKeywords: ["eddy current separator recycling", "non-ferrous metal sorting machine", "aluminum separation recycling"],
    category: "Recycling Guide",
    image: "/images/industries/recycling-magnetic-separation-solution.webp",
    productLinks: [
      ["/products/eccentric-eddy-current-separator", "Eccentric Eddy Current Separator"],
      ["/products/hecp-eddy-current-metal-sorting-machine", "HECP eddy current metal sorting machine"],
      ["/products/permanent-overband-magnetic-separator", "Permanent Overband Magnetic Separator"]
    ],
    industryLink: ["/industries/recycling", "Recycling magnetic separation solutions"],
    application: "separation of aluminum and other non-ferrous metals after upstream ferrous removal",
    material: "mixed recyclables, shredded waste, construction waste, plastic flakes and non-ferrous scrap streams",
    risk: "poor upstream ferrous removal can reduce sorting stability and increase wear",
    unsuitable: "the main target is ferrous iron, wet sticky waste blocks the conveyor, or particle size is outside the sorting range"
  },
  {
    title: "Food Grade Magnetic Separators for Grain and Powder Processing",
    region: "Asia",
    buyer: "Food processors, grain mills, powder plants and packaging line integrators",
    primaryKeyword: "food grade magnetic separators for grain and powder processing",
    secondaryKeywords: ["magnetic separator for grain", "magnetic trap food processing", "magnetic grid powder processing"],
    category: "Food Processing Guide",
    image: "/images/industries/food-processing-magnetic-separator.webp",
    productLinks: [
      ["/products/magnetic-grid", "Magnetic Grid"],
      ["/products/magnetic-trap", "Magnetic Trap"],
      ["/products/drawer-magnet", "Drawer Magnet"]
    ],
    industryLink: ["/industries/food", "Food processing magnetic separation"],
    application: "removal of fine ferrous contamination from grains, flour, sugar, starch, spices and powders",
    material: "rice, wheat, corn, flour, sugar, starch, spices, tea, coffee and dry food ingredients",
    risk: "fine iron contamination can affect product safety and downstream equipment reliability",
    unsuitable: "large tramp iron is carried on an open conveyor or the product requires a metal detector for non-ferrous contamination"
  },
  {
    title: "Magnetic Filters for Plastic and Chemical Processing Lines",
    region: "Asia and South America",
    buyer: "Plastic processors, chemical plants, powder producers and OEM line builders",
    primaryKeyword: "magnetic filters for plastic and chemical processing lines",
    secondaryKeywords: ["magnetic filter for plastic pellets", "magnetic separator chemical powder", "pipeline magnetic filter"],
    category: "Industry Application",
    image: "/images/industries/recycling-scenarios/plastic-recycling-sorting-line.jpg",
    productLinks: [
      ["/products/rcyz-type-pipeline-magnetic-filter", "Pipeline magnetic filter"],
      ["/products/cbs-drawer-type-magnetic-filter", "Drawer type magnetic filter"],
      ["/products/rotary-pipe-magnet", "Rotary Pipe Magnet"]
    ],
    industryLink: ["/applications/recycling", "Recycling application solutions"],
    application: "fine ferrous removal from plastic pellets, chemical powders and free-flowing granules",
    material: "plastic pellets, resin, additives, chemical powders and granular bulk materials",
    risk: "fine iron can contaminate product batches and damage downstream processing equipment",
    unsuitable: "the material is very sticky, bridges easily, or contains large metal pieces better handled by upstream equipment"
  }
];

function todayInTimezone(timeZone = "Asia/Shanghai") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function readingTime(content) {
  const words = String(content || "").split(/\s+/).filter(Boolean).length;
  return Math.max(6, Math.ceil(words / 230));
}

function buildContent(topic, publishedAt) {
  const productList = topic.productLinks.map(([, label]) => label).join(", ");
  const secondary = topic.secondaryKeywords.join(", ");

  return `## Introduction

Buyers searching for ${topic.primaryKeyword} usually want a practical answer, not a generic product description. The right magnetic separator depends on the material, conveyor layout, burden depth, contamination type, installation height, cleaning method and maintenance access.

This guide is written for ${topic.buyer}. It explains where magnetic separation fits, what parameters matter before quotation, common mistakes to avoid and when the equipment may not be the right solution. Cowin Magnet can review your working conditions and suggest a practical equipment direction before you request a formal quotation.

## Key Takeaways

- The target application is ${topic.application}.
- Typical materials include ${topic.material}.
- The main risk is that ${topic.risk}.
- Buyers should prepare belt width, material layer depth, capacity, particle size, contamination details and site photos before RFQ.
- Recommended product directions may include ${productList}, depending on working conditions.
- This topic is especially relevant for buyers in ${topic.region}.

## Where This Equipment Fits

In many plants, magnetic separation is used for both product quality and equipment protection. A separator installed at the correct point can remove ferrous contamination before it reaches expensive downstream machinery. The best location is usually before crushers, shredders, mills, screens, packing machines or other sensitive equipment.

For ${topic.region} buyers, the challenge is often not only product selection. It is also export communication, installation space, local maintenance capability and the need to avoid downtime after shipment. A clear technical inquiry helps the supplier recommend the correct model instead of guessing from a product name.

## Main Selection Parameters

The most important parameters are material type, particle size, material layer depth, belt width or pipe diameter, capacity, moisture level and the expected size of ferrous contamination. For conveyor applications, belt speed and installation height are also critical because they affect how long the metal stays in the magnetic field.

For chute, grid, drawer or pipeline applications, buyers should describe the flow direction, opening size, product temperature, cleaning frequency and whether the material is free-flowing or sticky. A magnetic separator that works well for dry granules may not work well for wet or bridging powder.

Useful RFQ data includes:

- Material name and particle size.
- Capacity per hour.
- Moisture level and flow behavior.
- Belt width, pipe diameter or chute opening.
- Material layer depth or product flow thickness.
- Iron size, frequency and contamination source.
- Installation height and available space.
- Required cleaning method.
- Voltage, working hours and site environment.

## Product Direction and Configuration

For this topic, Cowin Magnet may discuss ${productList}. The final choice depends on whether the buyer needs continuous self-cleaning, manual cleaning, deeper magnetic penetration, fine ferrous capture or non-ferrous metal sorting.

Self-cleaning conveyor magnets are useful when ferrous contamination appears frequently. Manual-cleaning magnets can be suitable when contamination is occasional and the plant can stop for cleaning. Magnetic grids, drawers and traps are better for fine ferrous contamination in powder or granular flow. Eddy current separators are different: they are used for selected non-ferrous metal separation after ferrous metals have already been removed.

## Common Mistakes to Avoid

The first mistake is selecting only by product name. Two plants can ask for the same separator type but need different sizes because their material burden, contamination size and installation height are different.

The second mistake is ignoring cleaning frequency. A low-cost manual-cleaning unit can become expensive if workers need to stop the line too often. For continuous production, automatic discharge may be more practical.

The third mistake is forgetting the discharge path. Captured metal must fall into a safe collection area. If the plant does not plan side space, chute space or maintenance access, installation can become difficult after delivery.

The fourth mistake is expecting one separator to solve every metal problem. Magnetic separators remove ferrous metals. If the plant also needs to detect stainless steel, copper or aluminum, a metal detector or eddy current separator may be required.

## Installation and Maintenance Notes

Before ordering, buyers should check whether the support structure can hold the equipment, whether operators can safely clean and inspect it, and whether dust, moisture, vibration or corrosion need special attention.

Maintenance planning should include periodic inspection of magnet surfaces, belts, bearings, reducers, seals, fasteners and electrical components where applicable. In remote mining, quarrying or recycling sites, spare parts and simple inspection procedures can reduce downtime.

For export buyers, drawings and photos are especially useful. A supplier can often identify installation conflicts from a simple conveyor photo, chute sketch or video of the material flow.

## When This Equipment May Not Be Suitable

This equipment may not be suitable when ${topic.unsuitable}. It may also be the wrong choice if the buyer has not confirmed whether the target metal is ferrous or non-ferrous.

If the material condition is uncertain, Cowin Magnet may recommend sample testing, photos, videos or a process review before final model selection. This avoids unsupported performance claims and helps the buyer choose a solution that matches the real plant.

## Selection Checklist

| Parameter | What to Prepare |
|---|---|
| Material | ${topic.material} |
| Application goal | ${topic.application} |
| Capacity | Tons per hour or kilograms per hour |
| Material size | Minimum, average and maximum particle size |
| Moisture | Dry, wet, sticky, dusty or abrasive |
| Installation | Conveyor, chute, pipe, hopper or sorting line |
| Contamination | Iron size, quantity and frequency |
| Cleaning | Manual, semi-automatic or self-cleaning |
| Environment | Dust, water, vibration, corrosion, temperature |
| Documents | Photos, drawings, flow sheet or short video |

## FAQ

### How do I choose the right magnetic separator for this application?

Start with the material, process goal and contamination type. Then confirm capacity, particle size, moisture, belt width or pipe size, layer depth, installation height and cleaning method. A supplier can recommend a more suitable model when these details are available.

### Is a stronger magnetic field always better?

Not always. Stronger magnetism may help in some conditions, but the real result depends on magnetic reach, material layer depth, metal size and flow stability. Oversizing can increase cost without solving the actual installation problem.

### What affects the price of a magnetic separator?

Price is affected by equipment size, magnetic system, cleaning method, structure, motor and reducer configuration, control requirements, material contact parts, export packaging and customization. Accurate working-condition data helps avoid both undersizing and unnecessary oversizing.

### Can Cowin Magnet customize the equipment?

Customization can be discussed for size, frame, discharge direction, magnetic configuration, voltage, cleaning method, color, labeling and installation support. The final design should be based on site conditions and confirmed drawings.

### What information should I send before requesting a quote?

Send material type, capacity, particle size, moisture, belt width or pipe size, layer depth, installation height, contamination size, cleaning preference, voltage and site photos. A short video of the material flow is also helpful.

### When should I use a metal detector instead?

Use a metal detector when the plant must detect non-ferrous metals, stainless steel or mixed conductive contaminants that a magnetic separator cannot remove. In many lines, a magnetic separator and metal detector work together.

## AI Citation Ready Summary

- Product category: Industrial magnetic separation equipment.
- Best use cases: ${topic.application}.
- Main buyer concerns: Selection parameters, installation height, cleaning method, contamination size, maintenance and quotation accuracy.
- Required selection parameters: Material, capacity, particle size, moisture, belt width or pipe size, burden depth, iron size, installation space and working environment.
- Recommended Cowin Magnet products: ${productList}.
- Relevant regions: ${topic.region}.
- Short answer in 50 words: Buyers should choose equipment for ${topic.primaryKeyword} by material condition, capacity, contamination size, installation layout and cleaning method. A complete RFQ should include photos, drawings and operating parameters so the supplier can avoid a generic recommendation.
- Published date: ${publishedAt}.

## Internal Linking Suggestions

${topic.productLinks
  .map(([href, label]) => `- Anchor text: ${label}\n  Suggested target page: ${href}\n  Why it matters: Connects this buying guide to a relevant Cowin Magnet product page.`)
  .join("\n")}
- Anchor text: ${topic.industryLink[1]}
  Suggested target page: ${topic.industryLink[0]}
  Why it matters: Helps buyers continue from product selection to industry application context.
- Anchor text: Request a magnetic separator quote
  Suggested target page: /request-quote
  Why it matters: Gives procurement buyers a direct conversion path.

## Conclusion

Selecting equipment for ${topic.primaryKeyword} should begin with working conditions, not only a catalog model. Buyers should define the material, contamination risk, capacity, installation layout and cleaning requirement before quotation.

Send Cowin Magnet your material data, site photos and target application. Our team can help review the conditions and suggest a practical magnetic separation direction for your project.`;
}

function buildBlogPost(topic, publishedAt) {
  const content = buildContent(topic, publishedAt);
  const slug = slugify(topic.title);
  return {
    id: `blog-${slug}`,
    type: "blog",
    slug,
    title: topic.title,
    seoTitle: topic.title.length > 65 ? topic.title.slice(0, 62).replace(/\s+\S*$/, "") : topic.title,
    metaDescription: `Learn how to choose equipment for ${topic.primaryKeyword} by material, capacity, contamination, installation and RFQ parameters.`,
    h1: topic.title,
    category: topic.category,
    categoryTitle: topic.category,
    keywords: [topic.primaryKeyword, ...topic.secondaryKeywords],
    tags: [topic.primaryKeyword, ...topic.secondaryKeywords],
    excerpt: `A practical Cowin Magnet guide for ${topic.buyer.toLowerCase()} choosing magnetic separation equipment by material, capacity, contamination and installation conditions.`,
    readingTime: readingTime(content),
    publishedAt,
    updatedAt: publishedAt,
    image: topic.image,
    coverImage: topic.image,
    content,
    status: "published",
    automation: {
      system: "blog-daily-publisher",
      topicTitle: topic.title,
      region: topic.region,
      generatedAt: new Date().toISOString(),
      fingerprint: crypto.createHash("sha256").update(topic.title).digest("hex")
    }
  };
}

const FALLBACK_REGIONS = ["Africa", "South America", "Asia", "Southeast Asia", "Brazil", "Chile and Peru", "Indonesia", "Vietnam", "Nigeria", "South Africa"];
const FALLBACK_APPLICATIONS = [
  {
    equipment: "Overband Magnetic Separator",
    application: "mining conveyor crusher protection",
    material: "ore, aggregate, limestone, coal and mixed bulk material",
    products: [
      ["/products/permanent-overband-magnetic-separator", "Permanent Overband Magnetic Separator"],
      ["/products/suspended-electromagnetic-conveyor-belt-separator", "Suspended Electromagnetic Conveyor Belt Separator"]
    ],
    industry: ["/industries/mining", "Mining magnetic separation solutions"],
    image: "/images/industries/mining-magnetic-separator-conveyor.webp"
  },
  {
    equipment: "Wet Drum Magnetic Separator",
    application: "iron ore beneficiation and tailings recovery",
    material: "magnetite, iron ore slurry, tailings and mineral processing streams",
    products: [
      ["/products/wet-drum-magnetic-separator", "Wet Drum Magnetic Separator"],
      ["/products/ctb-wet-semi-countercurrent-magnetic-separator", "CTB Wet Semi Countercurrent Magnetic Separator"]
    ],
    industry: ["/industries/mining", "Mining magnetic separation solutions"],
    image: "/assets/products/wet-drum-magnetic-separator/wet-drum-magnetic-separator-01.jpg"
  },
  {
    equipment: "Eddy Current Separator",
    application: "recycling plant non-ferrous metal recovery",
    material: "mixed recyclables, aluminum, copper, plastic flakes and shredded waste",
    products: [
      ["/products/eccentric-eddy-current-separator", "Eccentric Eddy Current Separator"],
      ["/products/hecp-eddy-current-metal-sorting-machine", "HECP eddy current metal sorting machine"]
    ],
    industry: ["/industries/recycling", "Recycling magnetic separation solutions"],
    image: "/images/industries/recycling-magnetic-separation-solution.webp"
  },
  {
    equipment: "Magnetic Grid",
    application: "grain and powder processing",
    material: "grain, flour, sugar, starch, spices, tea and dry powders",
    products: [
      ["/products/magnetic-grid", "Magnetic Grid"],
      ["/products/drawer-magnet", "Drawer Magnet"]
    ],
    industry: ["/industries/food", "Food processing magnetic separation"],
    image: "/images/industries/food-processing-magnetic-separator.webp"
  },
  {
    equipment: "Magnetic Filter",
    application: "plastic and chemical powder processing",
    material: "plastic pellets, resin, additives, chemical powders and granular materials",
    products: [
      ["/products/rcyz-type-pipeline-magnetic-filter", "Pipeline magnetic filter"],
      ["/products/cbs-drawer-type-magnetic-filter", "Drawer type magnetic filter"]
    ],
    industry: ["/applications/recycling", "Recycling application solutions"],
    image: "/images/industries/recycling-scenarios/plastic-recycling-sorting-line.jpg"
  },
  {
    equipment: "Magnetic Head Pulley",
    application: "continuous ferrous removal on conveyor discharge points",
    material: "aggregate, coal, recycling material, ore and bulk solids",
    products: [
      ["/products/magnetic-head-pulley", "Magnetic Head Pulley"],
      ["/products/drum-magnet", "Drum Magnet"]
    ],
    industry: ["/applications/mining", "Mining application solutions"],
    image: "/assets/products/magnetic-head-pulley/magnetic-head-pulley-01.jpg"
  }
];

function buildFallbackTopic(usedSlugs) {
  for (const region of FALLBACK_REGIONS) {
    for (const item of FALLBACK_APPLICATIONS) {
      const title = `How to Choose a ${item.equipment} for ${item.application} in ${region}`;
      const slug = slugify(title);
      if (usedSlugs.has(slug)) continue;
      return {
        title,
        region,
        buyer: "Plant engineers, procurement teams, EPC contractors and industrial equipment distributors",
        primaryKeyword: `${item.equipment.toLowerCase()} for ${item.application} in ${region}`,
        secondaryKeywords: [
          `${item.equipment.toLowerCase()} selection`,
          `magnetic separator for ${item.application}`,
          `${region} magnetic separation equipment`
        ],
        category: "Selection Guide",
        image: item.image,
        productLinks: item.products,
        industryLink: item.industry,
        application: item.application,
        material: item.material,
        risk: "incorrect separator selection can reduce recovery, miss tramp iron or create unnecessary maintenance work",
        unsuitable: "the material condition, target metal type or installation layout has not been confirmed"
      };
    }
  }
  return null;
}

export async function runDailyBlogPublisher({ force = false, dateKey = todayInTimezone(), requestId = crypto.randomUUID() } = {}) {
  const cmsBlogs = await getCmsItems("blog", { includeInactive: true });
  const usedSlugs = new Set([...STATIC_BLOG_FINGERPRINTS, ...cmsBlogs.map((post) => post.slug).filter(Boolean)]);
  const usedTitles = new Set(cmsBlogs.map((post) => String(post.title || "").toLowerCase()).filter(Boolean));
  const publishedToday = cmsBlogs.find((post) => post.status === "published" && String(post.publishedAt || "").slice(0, 10) === dateKey);

  if (publishedToday && !force) {
    return {
      requestId,
      status: "skipped",
      reason: "daily-blog-already-published",
      publishedCount: 0,
      post: publishedToday
    };
  }

  let topic = BLOG_TOPICS.find((candidate) => {
    const slug = slugify(candidate.title);
    return !usedSlugs.has(slug) && !usedTitles.has(candidate.title.toLowerCase());
  });

  if (!topic) {
    topic = buildFallbackTopic(usedSlugs);
  }

  if (!topic) {
    return {
      requestId,
      status: "skipped",
      reason: "blog-topic-pool-exhausted",
      publishedCount: 0,
      post: null
    };
  }

  const post = buildBlogPost(topic, dateKey);
  const saved = await saveCmsItem(post);
  return {
    requestId,
    status: "success",
    reason: "published",
    publishedCount: 1,
    post: saved
  };
}
