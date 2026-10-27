type ProductPageSchemaInput = {
  name: string;
  description: string;
  imageUrls: string[];
  url: string;
};

/**
 * These made-to-order machines have no public fixed price or verified customer
 * reviews. Describe the page and its subject without claiming eligibility for
 * Google's Product rich result, which requires a real offer or review signal.
 */
export function productPageSchema({ name, description, imageUrls, url }: ProductPageSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name,
    description,
    image: imageUrls,
    url,
    about: {
      "@type": "Thing",
      name,
      description,
      image: imageUrls,
      url
    }
  };
}
