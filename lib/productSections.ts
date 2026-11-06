export const productSections = ["overview", "selection", "applications", "technical", "support"] as const;
export type ProductSection = (typeof productSections)[number];

export function getProductSection(value: unknown): ProductSection {
  return productSections.find((section) => section === value) || "overview";
}
