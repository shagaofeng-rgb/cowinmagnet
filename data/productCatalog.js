export const productCategories = [
  {
    id: "permanent-magnet-series",
    title: "Permanent Magnet Series",
    description:
      "Permanent magnetic separators for continuous tramp iron removal, equipment protection and recycling recovery lines.",
    sourceUrl: "https://www.cowinmagnet.com/product/PermanentMagnetSeries",
    products: [
      {
        slug: "permanent-overband-magnetic-separator",
        title: "Automatic Cleaning Magnetic Separators for Iron Scrap Waste",
        shortTitle: "Self-cleaning Permanent Magnetic Separator",
        sourceUrl: "https://www.cowinmagnet.com/product/MagneticSeparators.html",
        application: "Waste recycling, conveyor belt iron removal, crusher protection",
        summary:
          "A self-cleaning overband magnetic separator for continuous removal of ferrous scrap from conveyed materials."
      },
      {
        slug: "suspended-permanent-magnetic-separator",
        title: "Suspended Permanent Magnetic Separator",
        shortTitle: "Suspended Permanent Magnet",
        sourceUrl: "https://www.cowinmagnet.com/product/Suspendedironseparator.html",
        application: "Quarry, mining, coal, cement and aggregate handling",
        summary:
          "A suspended permanent magnet for reliable tramp iron capture where manual or periodic cleaning is acceptable."
      }
    ]
  },
  {
    id: "electromagnetic-series",
    title: "Electromagnetic Series",
    description:
      "Electromagnetic separators and lifting magnets for stronger magnetic fields, controlled operation and heavy-duty conditions.",
    sourceUrl: "https://www.cowinmagnet.com/product/ElectromagneticSeries",
    products: [
      {
        slug: "suspended-electromagnetic-conveyor-belt-separator",
        title: "Suspended Electromagnetic Conveyor Belt Separator",
        shortTitle: "Suspended Electromagnetic Separator",
        sourceUrl: "https://www.cowinmagnet.com/product/3.html",
        application: "High-capacity conveyors, mining, ports, coal and heavy material handling",
        summary:
          "An electromagnetic conveyor belt separator for working conditions that require adjustable and powerful magnetic force."
      },
      {
        slug: "round-electromagnetic-lifting-magnet",
        title: "Round Electromagnetic Lifting Magnet",
        shortTitle: "Round Electromagnetic Lifting Magnet",
        sourceUrl: "https://www.cowinmagnet.com/product/4.html",
        application: "Steel scrap lifting, metal handling, foundry and warehouse operations",
        summary:
          "A round lifting electromagnet for handling ferrous metal materials in industrial loading and unloading scenarios."
      }
    ]
  },
  {
    id: "magnetic-rollers-bars",
    title: "Magnetic Rollers & Magnetic Bars",
    description:
      "Magnetic components for filtration, chute separation, hopper protection and custom magnetic separation assemblies.",
    sourceUrl: "https://www.cowinmagnet.com/product/MagneticRollersMagneticBars",
    products: [
      {
        slug: "permanent-filter-bar-magnetic-neodymium-rod",
        title: "Strong 6000-16000 Gauss Iron Absorbing Permanent Filter Bar Magnetic Neodymium Rod",
        shortTitle: "Permanent Filter Bar Magnetic Rod",
        sourceUrl: "https://www.cowinmagnet.com/product/5.html",
        application: "Powder, granule, liquid filtration, hopper and chute protection",
        summary:
          "High-gauss magnetic rods used to capture fine ferrous contamination in material flow and filtration systems."
      }
    ]
  }
];

export const allProducts = productCategories.flatMap((category) =>
  category.products.map((product) => ({
    ...product,
    categoryId: category.id,
    categoryTitle: category.title
  }))
);

export function getProductBySlug(slug) {
  return allProducts.find((product) => product.slug === slug);
}
