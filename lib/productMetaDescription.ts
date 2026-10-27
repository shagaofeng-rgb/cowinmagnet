/** Keep search snippets concise without cutting a factual sentence in half. */
export function productMetaDescription(name: string, industry: string) {
  const productName = name.trim();
  const primaryIndustry = industry.trim();
  const candidates = [
    `${productName} for ${primaryIndustry}. Share material and operating conditions with COWIN MAGNET for configuration support.`,
    `${productName} for ${primaryIndustry}. Request a configuration review.`,
    `${productName}. Share material and site conditions for a configuration review.`,
    `${productName}. Request a configuration review.`
  ];
  return candidates.find((candidate) => candidate.length <= 160) || `${productName}.`;
}
