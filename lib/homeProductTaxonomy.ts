import type { Product } from "@/data/products";

export const homeProductFamilies = ["suspended", "drums", "separators", "filters", "detection", "industrial", "other"] as const;
export type HomeProductFamily = (typeof homeProductFamilies)[number];

// The five broad catalogue categories contain several different equipment
// types. These model-level exceptions keep the homepage's smaller groups
// technically accurate without changing product URLs or the main catalogue.
const familyOverrides: Partial<Record<HomeProductFamily, readonly string[]>> = {
  suspended: [
    "rcda-type-air-cooled-electromagnetic-iron-remover",
    "rcdc-type-air-cooled-self-dumping-electromagnetic-iron-remover",
    "rcde-type-oil-cooled-electromagnetic-iron-remover",
    "rcdf-oil-cooled-self-dumping-electromagnetic-iron-remover",
    "rcdfj-type-forced-oil-circulation-self-dumping-electromagnetic-iron-remover",
    "rcps-self-dumping-disc-type-permanent-magnet-iron-remover",
    "rcydii-type-permanent-magnet-self-dumping-iron-remover",
    "rcye-type-permanent-magnet-self-dumping-iron-remover",
    "rcyp-type-permanent-magnet-manual-self-dumping-iron-remover",
    "ljk-type-magnetic-ore-special-iron-remover",
    "suspended-permanent-magnetic-separator",
    "suspended-electromagnetic-conveyor-belt-separator",
    "electromagnet-separator",
    "permanent-overband-magnetic-separator",
    "rbcdb-explosion-proof-disc-type-electromagnetic-iron-remover",
    "rbcdd-explosion-proof-electromagnetic-self-dumping-iron-remover",
    "rbcyd-explosion-proof-permanent-magnet-self-dumping-iron-remover"
  ],
  drums: [
    "cxj-drum-type-automatic-magnetic-separator",
    "cgt-type-super-strong-full-magnetic-drum",
    "ctz-type-midfield-strong-semi-magnetic-drum",
    "rct-type-fully-magnetic-drum",
    "drum-magnet",
    "magnetic-head-pulley"
  ],
  filters: [
    "rcya-type-inclined-pipeline-permanent-magnet-iron-remover",
    "rcyf-type-vertical-pipeline-permanent-magnet-iron-remover",
    "rcyg-type-pipeline-self-dumping-permanent-magnet-iron-remover",
    "rcyz-type-vertical-pipeline-permanent-magnet-iron-remover"
  ]
};

const overrideEntries = Object.entries(familyOverrides).flatMap(([family, slugs]) =>
  (slugs || []).map((slug) => [slug, family as HomeProductFamily] as const)
);
export const homeProductFamilyOverrides = new Map(overrideEntries);

const catalogueFamilyByCategory: Record<string, HomeProductFamily> = {
  "Suspended & Self-Unloading Iron Removers": "suspended",
  "Magnetic Separation Equipment": "separators",
  "Metal Detection & Recycling Sorting": "detection",
  "Magnetic Components & Filters": "filters",
  "Industry Application Equipment": "industrial"
};

export function getHomeProductFamily(product: Pick<Product, "slug" | "category">): HomeProductFamily {
  return homeProductFamilyOverrides.get(product.slug) || catalogueFamilyByCategory[product.category] || "other";
}
