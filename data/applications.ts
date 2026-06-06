export type ApplicationSolutionPair = {
  issue: string;
  solution: string;
  note: string;
};

export type ApplicationEquipment = {
  name: string;
  usage: string;
};

export type ApplicationTable = {
  title: string;
  columns: string[];
  rows: string[][];
};

export type Application = {
  slug: string;
  industrySlug: string;
  name: string;
  pageTitle: string;
  seoTitle: string;
  seoDescription: string;
  image: string;
  iconImage?: string;
  imageAlt: string;
  summary: string;
  secondaryDescription?: string;
  painPoints: string[];
  solutionPairs: ApplicationSolutionPair[];
  recommendedProducts: string[];
  equipment: ApplicationEquipment[];
  scenarios: string[];
  scenarioImages?: Record<string, string>;
  table?: ApplicationTable;
  faqs: { question: string; answer: string }[];
};

const commonQuoteFaq = {
  question: "What information should I provide before quotation?",
  answer:
    "Please share material type, conveyor belt width, belt speed, material layer height, installation height, iron contamination level, target capacity and site photos if available. These details help us recommend a practical separator type instead of guessing from a catalog."
};

export const applications: Application[] = [
  {
    slug: "recycling",
    industrySlug: "recycling",
    name: "Recycling Industry",
    pageTitle: "Recycling Industry Magnetic Separation Solution",
    seoTitle: "Magnetic Separation Solutions for Recycling Industry",
    seoDescription:
      "Magnetic separation equipment for municipal waste, construction waste, RDF fuel, plastic recycling, scrap metal recycling, and e-waste processing lines.",
    image: "/images/industries/recycling-industry-magnetic-separation-cover.png",
    iconImage: "/images/industries/icons/recycling-icon.png",
    imageAlt: "Magnetic separator for recycling waste processing line",
    summary:
      "Efficiently remove ferrous contaminants from municipal solid waste, construction waste, RDF fuel, plastic recycling, scrap metal recycling, and e-waste processing lines.",
    painPoints: [
      "Nails, bolts, rebars and mixed ferrous scrap may damage shredders, crushers and downstream equipment.",
      "Metal contamination can reduce the quality and resale value of recycled material.",
      "Manual sorting is slow, labor-intensive and difficult to keep stable on continuous lines.",
      "Unexpected downtime increases repair cost and interrupts recycling plant output."
    ],
    solutionPairs: [
      {
        issue: "Nails, bolts, and other ferrous contaminants can damage shredders and crushers.",
        solution: "Protect equipment by removing ferrous metals before shredding and crushing.",
        note:
          "Install an overband or suspended magnetic separator before crushing or shredding to remove nails, bolts, steel wire and tramp iron from mixed waste streams."
      },
      {
        issue: "Metal contamination reduces the quality of recycled materials.",
        solution: "Improve product purity and reduce metal contamination in the final output.",
        note:
          "Magnetic separation helps reduce ferrous contamination in plastic recycling, RDF preparation, scrap sorting and mixed waste recovery."
      },
      {
        issue: "Manual sorting is inefficient and costly.",
        solution: "Reduce labor costs with automatic magnetic separation.",
        note:
          "A self-cleaning magnetic separator can discharge captured iron continuously, reducing manual cleaning and keeping the line moving."
      },
      {
        issue: "Ferrous impurities lower the value of recycled products.",
        solution: "Recover valuable ferromagnetic metals and create additional revenue.",
        note:
          "Recovered ferrous metal can create additional value while making the main recycled stream cleaner and easier to sell."
      },
      {
        issue: "Unplanned downtime increases operating costs.",
        solution: "Reduce maintenance costs and prevent equipment damage.",
        note:
          "Removing tramp iron before critical equipment helps avoid unexpected repairs and supports more stable plant operation."
      }
    ],
    recommendedProducts: [
      "Automatic Cleaning Magnetic Separators for Iron Scrap Waste",
      "Suspended Permanent Magnetic Separator",
      "Suspended Electromagnetic Conveyor Belt Separator",
      "Strong 6000-16000 Gauss Iron Absorbing Permanent Filter Bar Magnetic Neodymium Magnet Rod"
    ],
    equipment: [
      {
        name: "Self-Cleaning Suspended Magnetic Separator",
        usage:
          "A practical first choice for municipal waste, RDF, plastic recycling and scrap metal recycling lines where continuous iron discharge is required."
      },
      {
        name: "Suspended Permanent Magnet",
        usage:
          "Suitable for smaller recycling lines or locations where manual cleaning is acceptable and iron contamination is not heavy."
      },
      {
        name: "Self-Cleaning Electromagnetic Separator",
        usage:
          "Useful for higher suspension height, thicker material burden or larger tramp iron risks in demanding recycling operations."
      },
      {
        name: "Magnetic Drum",
        usage:
          "Used at discharge points for ferrous recovery and fine-particle material processing after size reduction."
      }
    ],
    scenarios: [
      "Municipal Solid Waste",
      "Construction Waste",
      "Plastic Recycling",
      "Scrap Metal Recycling",
      "Alternative Fuel Production",
      "E-Waste Recycling"
    ],
    scenarioImages: {
      "Municipal Solid Waste": "/images/industries/recycling-scenarios/municipal-solid-waste-recycling-line.jpg",
      "Construction Waste": "/images/industries/recycling-scenarios/construction-waste-recycling-line.jpg",
      "Plastic Recycling": "/images/industries/recycling-scenarios/plastic-recycling-sorting-line.jpg",
      "Scrap Metal Recycling": "/images/industries/recycling-scenarios/non-metal-recycling-sorting-line.jpg",
      "Alternative Fuel Production": "/images/industries/recycling-scenarios/alternative-fuel-production-line.jpg",
      "E-Waste Recycling": "/images/industries/recycling-scenarios/e-waste-recycling-line.jpg"
    },
    faqs: [
      {
        question: "What separator is best for high iron contamination in recycling?",
        answer:
          "A self-cleaning overband magnetic separator is usually the starting option because it removes and discharges ferrous metals continuously. Final selection still depends on belt width, burden depth, iron size and installation height."
      },
      commonQuoteFaq
    ]
  },
  {
    slug: "mining",
    industrySlug: "mining",
    name: "Mining Industry",
    pageTitle: "Mining Industry Magnetic Separation Solution",
    seoTitle: "Magnetic Separation Solutions for Mining Industry",
    seoDescription:
      "Magnetic separation solutions for protecting crushers, improving ore purity, reducing downtime, and recovering valuable magnetic minerals.",
    image: "/images/industries/mining-scenarios/mining-industry-magnetic-separation-cover.jpg",
    iconImage: "/images/industries/icons/mining-icon.png",
    imageAlt: "Suspended magnetic separator for mining conveyor belt",
    summary:
      "Protect crushers, improve ore grade, and recover valuable magnetic minerals.",
    secondaryDescription:
      "Suitable for iron ore, gold ore, copper ore, chrome ore, manganese ore, limestone, and other mining projects.",
    painPoints: [
      "Tramp iron can damage jaw crushers, cone crushers, impact crushers, ball mills and conveyor systems.",
      "Iron contamination may reduce ore purity and affect downstream beneficiation quality.",
      "Unexpected equipment shutdowns increase maintenance cost and production loss.",
      "Valuable magnetic minerals may be lost if the separation stage is not planned properly."
    ],
    solutionPairs: [
      {
        issue: "Equipment Damage",
        solution: "Protect crushers and grinding equipment by removing tramp iron before key processing stages.",
        note:
          "Install a magnetic separator before key crushing, grinding or transfer points to remove steel fragments, bolts and large ferrous contaminants."
      },
      {
        issue: "Low Product Purity",
        solution: "Improve mineral purity and enhance the value of processed materials.",
        note:
          "Magnetic separation can reduce unwanted ferrous contamination and support cleaner ore preparation before the next processing stage."
      },
      {
        issue: "Production Downtime",
        solution: "Reduce maintenance costs and minimize unplanned downtime.",
        note:
          "Stable tramp iron removal helps lower repair frequency and reduce unplanned downtime in heavy mining environments."
      },
      {
        issue: "Metal Losses",
        solution: "Recover magnetic minerals and generate additional value.",
        note:
          "Magnetic drums, pulleys and high-intensity magnetic separation equipment can support mineral recovery or pre-selection according to ore properties."
      }
    ],
    recommendedProducts: [
      "Automatic Cleaning Magnetic Separators for Iron Scrap Waste",
      "Suspended Permanent Magnetic Separator",
      "Suspended Electromagnetic Conveyor Belt Separator"
    ],
    equipment: [
      {
        name: "Self-Cleaning Suspended Magnetic Separator",
        usage:
          "Used above conveyors for iron ore, gold ore, copper ore, manganese, chromite and other mining lines that require automatic discharge."
      },
      {
        name: "Suspended Permanent Magnet",
        usage:
          "A simple option for small mines, lower-capacity lines or conveyors where occasional manual cleaning is acceptable."
      },
      {
        name: "Self-Cleaning Electromagnetic Separator",
        usage:
          "Recommended when suspension height is higher, burden depth is thicker, or large tramp iron protection is required."
      },
      {
        name: "Magnetic Pulley",
        usage:
          "Installed at conveyor discharge points for ore pre-selection, magnetite enrichment and continuous ferrous separation."
      }
    ],
    scenarios: [
      "Iron Ore",
      "Magnetite",
      "Hematite",
      "Gold Ore",
      "Copper Ore",
      "Chrome Ore",
      "Manganese Ore",
      "Limestone",
      "Quartz Sand",
      "Feldspar",
      "Coal",
      "Nickel Ore"
    ],
    scenarioImages: {
      "Iron Ore": "/images/industries/mining-scenarios/iron-ore.jpg",
      "Magnetite": "/images/industries/mining-scenarios/magnetite.jpg",
      "Hematite": "/images/industries/mining-scenarios/hematite.jpg",
      "Gold Ore": "/images/industries/mining-scenarios/gold-ore.jpg",
      "Copper Ore": "/images/industries/mining-scenarios/copper-ore.jpg",
      "Chrome Ore": "/images/industries/mining-scenarios/chrome-ore.jpg",
      "Manganese Ore": "/images/industries/mining-scenarios/manganese-ore.jpg",
      "Limestone": "/images/industries/mining-scenarios/limestone.jpg",
      "Quartz Sand": "/images/industries/mining-scenarios/quartz-sand.jpg",
      "Feldspar": "/images/industries/mining-scenarios/feldspar.jpg",
      "Coal": "/images/industries/mining-scenarios/coal.jpg",
      "Nickel Ore": "/images/industries/mining-scenarios/nickel-ore.jpg"
    },
    faqs: [
      {
        question: "How should a mining conveyor magnetic separator be selected?",
        answer:
          "Selection should consider ore type, particle size, bulk density, conveyor belt width, belt speed, material layer height, suspension height, target iron size and whether automatic discharge is required."
      },
      commonQuoteFaq
    ]
  },
  {
    slug: "aggregate-cement",
    industrySlug: "cement-aggregate",
    name: "Cement & Aggregates",
    pageTitle: "Cement & Aggregate Industry Magnetic Separation Solution",
    seoTitle: "Magnetic Separation Solutions for Cement and Aggregate Industry",
    seoDescription:
      "Magnetic separators for cement raw materials, limestone, sand, gravel, aggregate, slag, and industrial by-product processing lines.",
    image: "/images/industries/cement-aggregate-industry-magnetic-separation-cover.png",
    iconImage: "/images/industries/icons/cement-aggregate-icon.png",
    imageAlt: "Magnetic separation equipment for cement and aggregate industry",
    summary:
      "Magnetic separation solutions for cement raw materials, aggregates, sand, gravel, and bulk material handling lines.",
    painPoints: [
      "Iron impurities can damage crushers, mills, screens and material handling equipment.",
      "Metal contamination may reduce finished aggregate or raw material quality.",
      "Manual sorting is inefficient for dusty, abrasive and continuous production conditions.",
      "Unplanned downtime increases operating cost and delays production schedules."
    ],
    solutionPairs: [
      {
        issue: "Ferrous contaminants can damage crushers and mills.",
        solution: "Protect jaw crushers, cone crushers, impact crushers, and grinding mills by removing tramp iron before processing.",
        note:
          "Use magnetic separators before jaw crushers, cone crushers, impact crushers, mills and key transfer points to reduce equipment damage."
      },
      {
        issue: "Metal contamination reduces product quality.",
        solution: "Improve product purity and ensure raw materials are free from metal impurities.",
        note:
          "Remove ferrous contaminants from limestone, aggregate, clinker handling and cement raw material lines before downstream processing."
      },
      {
        issue: "Manual sorting is inefficient and expensive.",
        solution: "Reduce labor costs and improve production efficiency.",
        note:
          "Self-cleaning separators support continuous iron discharge and reduce the need for manual removal in high-throughput lines."
      },
      {
        issue: "Equipment downtime increases operating costs.",
        solution: "Reduce maintenance costs, avoid unexpected repair expenses, and recover valuable metals.",
        note:
          "A properly selected separator can lower maintenance risk and help stabilize cement, quarry and aggregate production."
      }
    ],
    recommendedProducts: [
      "Automatic Cleaning Magnetic Separators for Iron Scrap Waste",
      "Suspended Permanent Magnetic Separator",
      "Suspended Electromagnetic Conveyor Belt Separator"
    ],
    equipment: [
      {
        name: "Self-Cleaning Suspended Magnetic Separator",
        usage:
          "Suitable for limestone, sand, crushed stone and cement raw material conveyors that need automatic iron cleaning."
      },
      {
        name: "Suspended Permanent Magnet",
        usage:
          "Suitable for small and medium lines where manual cleaning is acceptable and installation needs to stay simple."
      },
      {
        name: "Self-Cleaning Electromagnetic Separator",
        usage:
          "Used for high installation positions, thick material burdens and large tramp iron protection in heavy-duty lines."
      },
      {
        name: "Magnetic Roller, Drum or Pulley",
        usage:
          "Used at discharge points or conveyor ends for recovering ferrous impurities from aggregate or raw material streams."
      }
    ],
    scenarios: [
      "Crusher Protection and Iron Removal",
      "Finished Aggregate Purification",
      "Cement Raw Material Processing",
      "Slag and Industrial By-Product Processing"
    ],
    scenarioImages: {
      "Crusher Protection and Iron Removal": "/images/industries/cement-aggregate-scenarios/crusher-protection-iron-removal.jpg",
      "Finished Aggregate Purification": "/images/industries/cement-aggregate-scenarios/finished-aggregate-purification.jpg",
      "Cement Raw Material Processing": "/images/industries/cement-aggregate-scenarios/cement-raw-material-processing.jpg",
      "Slag and Industrial By-Product Processing": "/images/industries/cement-aggregate-scenarios/slag-industrial-by-product-processing.jpg"
    },
    faqs: [
      {
        question: "Which magnetic separator is suitable for cement and aggregate conveyors?",
        answer:
          "The model should be selected by belt width, material burden, suspension height, iron size, cleaning method and whether the line requires continuous automatic discharge."
      },
      commonQuoteFaq
    ]
  },
  {
    slug: "food-processing",
    industrySlug: "food",
    name: "Food & Grain Processing",
    pageTitle: "Food Industry Magnetic Separation Solution",
    seoTitle: "Magnetic Separation Solutions for Food Processing Industry",
    seoDescription:
      "Food-grade magnetic separation equipment for rice, grain, flour, sugar, milk powder, nuts, beans, spices, coffee, tea, starch, and feed processing lines.",
    image: "/images/industries/food-industry-magnetic-separation-cover.png",
    iconImage: "/images/industries/icons/food-processing-icon.png",
    imageAlt: "Food-grade magnetic separation solution for grain and powder processing",
    summary:
      "Food-grade magnetic separation solutions for rice, grain, sugar, flour, nuts, beans, milk powder, starch, feed, and other food processing lines.",
    painPoints: [
      "Fine iron particles, worn metal fragments, nails or wire may enter grain, powder or food material streams.",
      "Metal contamination creates food safety concerns and can affect product quality.",
      "Grinding, milling, roasting and pelletizing equipment may be damaged by unexpected ferrous impurities.",
      "Different food materials require different magnetic contact methods and cleaning structures."
    ],
    solutionPairs: [
      {
        issue: "Fine metal contamination in food material",
        solution: "Use magnetic rods, grids or drums",
        note:
          "Fine iron powder and worn metal particles can be captured in hoppers, chutes, pipelines and gravity-flow systems."
      },
      {
        issue: "Equipment protection before milling or grinding",
        solution: "Install magnets before processing equipment",
        note:
          "Suspended magnets, drums and pipeline separators help protect mills, grinders, pellet mills and downstream equipment."
      },
      {
        issue: "Powder and granular materials have different flow behavior",
        solution: "Match the contact structure to the material",
        note:
          "Magnetic bars, grids, drums and pipeline separators should be selected according to particle size, flow rate, moisture and cleaning frequency."
      },
      {
        issue: "Food-grade requirements need careful handling",
        solution: "Coordinate surface material and cleaning design",
        note:
          "Stainless steel shell options, magnetic strength, housing design and cleaning access should be confirmed according to the production line."
      }
    ],
    recommendedProducts: [
      "Strong 6000-16000 Gauss Iron Absorbing Permanent Filter Bar Magnetic Neodymium Magnet Rod",
      "Suspended Permanent Magnetic Separator",
      "Automatic Cleaning Magnetic Separators for Iron Scrap Waste"
    ],
    equipment: [
      {
        name: "Magnetic Bar / Magnetic Rod",
        usage:
          "Captures fine ferrous particles in hoppers, drawers, grates and filtration assemblies for powder and granular materials."
      },
      {
        name: "Magnetic Grid / Magnetic Grate",
        usage:
          "Improves contact with gravity-flow materials such as flour, sugar, spices, starch, feed and food additives."
      },
      {
        name: "Pipeline Magnetic Separator",
        usage:
          "Used in enclosed pipeline or gravity-flow systems for powder, granule and food-related material streams."
      },
      {
        name: "Magnetic Drum",
        usage:
          "Supports continuous separation for rice, grain, beans, nuts, feed and other flowing bulk food materials."
      }
    ],
    scenarios: [
      "Rice, Wheat and Corn",
      "Beans and Nuts",
      "Sugar, Flour and Milk Powder",
      "Coffee Beans and Tea",
      "Spices",
      "Feed",
      "Food Additives and Starch"
    ],
    scenarioImages: {
      "Rice, Wheat and Corn": "/images/industries/food-scenarios/rice-wheat-corn-food-processing-line.jpg",
      "Beans and Nuts": "/images/industries/food-scenarios/beans-nuts-magnetic-bar-separator.jpg",
      "Sugar, Flour and Milk Powder": "/images/industries/food-scenarios/sugar-flour-milk-powder-pipeline-magnetic-separator.jpg",
      "Coffee Beans and Tea": "/images/industries/food-scenarios/coffee-beans-tea-magnetic-grid.jpg",
      "Spices": "/images/industries/food-scenarios/spices-pipeline-magnetic-separator.jpg",
      "Feed": "/images/industries/food-scenarios/feed-magnetic-drum-separator.jpg",
      "Food Additives and Starch": "/images/industries/food-scenarios/food-additives-starch-magnetic-roller.jpg"
    },
    table: {
      title: "Food Processing Applications and Recommended Equipment",
      columns: ["Food Type", "Recommended Equipment", "Application Description"],
      rows: [
        [
          "Rice / Wheat / Corn",
          "Suspended Permanent Magnetic Separator; Self-Cleaning Permanent Magnetic Separator; Magnetic Drum; Pipeline Magnetic Separator",
          "Removes nails, wires, iron chips, and other ferrous impurities from grain and rice processing lines, helping protect rice milling, flour milling, and downstream processing equipment."
        ],
        [
          "Beans / Nuts",
          "Suspended Permanent Magnetic Separator; Magnetic Drum; Pipeline Magnetic Separator",
          "Removes ferrous contaminants mixed during transportation and storage, preventing metal contamination and improving food safety."
        ],
        [
          "Sugar / Flour / Milk Powder",
          "Magnetic Drum; Magnetic Bar Grate; Pipeline Magnetic Separator",
          "Captures fine iron powder and worn metal particles to improve product purity."
        ],
        [
          "Coffee Beans / Tea",
          "Suspended Permanent Magnetic Separator; Magnetic Bar Grate; Pipeline Magnetic Separator",
          "Removes metal impurities, protects roasting and grinding equipment, and helps ensure product safety."
        ],
        [
          "Spices, Chili Powder, Pepper Powder",
          "Pipeline Magnetic Separator; Magnetic Bar Grate",
          "Removes ferrous contaminants from powder materials and improves final product quality."
        ],
        [
          "Feed",
          "Suspended Permanent Magnetic Separator; Self-Cleaning Permanent Magnetic Separator; Magnetic Drum; Pipeline Magnetic Separator",
          "Protects crushers, grinders, pellet mills, and other feed processing equipment while ensuring safer production."
        ],
        [
          "Food Additives / Starch",
          "Pipeline Magnetic Separator; Magnetic Bar Grate",
          "Removes fine ferrous impurities and helps meet food-grade processing requirements."
        ]
      ]
    },
    faqs: [
      {
        question: "Which magnetic equipment is suitable for food and grain processing?",
        answer:
          "For powders and granules, magnetic bars, grids and pipeline separators are commonly considered. For continuous bulk flow, magnetic drums or suspended magnets may be suitable. Final selection depends on material, particle size, flow rate and cleaning method."
      },
      commonQuoteFaq
    ]
  }
];
