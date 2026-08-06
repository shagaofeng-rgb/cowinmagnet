import { categoryAnchor } from "@/lib/anchors";

export const productCategoryPages = [
  { category: "Suspended & Self-Unloading Iron Removers", slug: "suspended-self-unloading-iron-removers", description: "Suspended and self-unloading magnetic equipment for conveyor protection and tramp iron removal." },
  { category: "Magnetic Separation Equipment", slug: "magnetic-separation-equipment", description: "Magnetic separation equipment grouped from the current product catalogue." },
  { category: "Metal Detection & Recycling Sorting", slug: "metal-detection-recycling-sorting", description: "Equipment listed for metal detection and recycling sorting workflows." },
  { category: "Magnetic Components & Filters", slug: "magnetic-components-filters", description: "Magnetic components and filtration products from the current catalogue." },
  { category: "Industry Application Equipment", slug: "industry-application-equipment", description: "Equipment grouped by the industrial applications recorded in the catalogue." }
];

export function getProductCategoryPage(slug) {
  return productCategoryPages.find((item) => item.slug === slug || categoryAnchor(item.category) === slug);
}
