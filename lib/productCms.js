import { products, productCategories } from "@/data/products";
import { getCmsItems } from "@/lib/cmsStore";

function normalizeSpec(spec) {
  if (Array.isArray(spec)) {
    return { label: String(spec[0] || "Specification"), value: String(spec[1] || "") };
  }
  if (spec && typeof spec === "object" && "label" in spec && "value" in spec) {
    return { label: String(spec.label), value: String(spec.value) };
  }
  return { label: "Specification", value: String(spec || "") };
}

function splitApplication(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return String(value || "Industrial Material Handling")
    .split(/[,，;/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function cmsProductToProduct(item) {
  const name = String(item.title || item.shortTitle || item.slug || "Uploaded Product");
  const category = String(item.categoryTitle || "Uploaded Products");
  const summary = String(item.summary || item.overview || "Uploaded product from Cowinmagnet admin backend.");
  const features = Array.isArray(item.features) ? item.features.map(String).filter(Boolean) : [];

  return {
    slug: String(item.slug),
    name,
    category,
    status: item.status || "published",
    publishedAt: item.publishedAt || item.createdAt || "",
    updatedAt: item.updatedAt || item.publishedAt || item.createdAt || "",
    image: String(item.image || "/images/source-products/automatic-cleaning-magnetic-separators-for-iron-scrap-waste.webp"),
    summary,
    keywords: [name, category, "magnetic separation equipment"],
    features: features.length ? features : ["Uploaded from backend CMS", "Selection support according to working conditions"],
    principle: String(item.overview || summary),
    specs: Array.isArray(item.specifications) ? item.specifications.map(normalizeSpec) : [],
    applications: splitApplication(item.application),
    installation: String(item.installation || "Installation method should be confirmed according to site layout and working conditions."),
    customization: ["Magnetic strength", "Working size", "Installation method", "Packaging and export support"],
    faqs: [
      {
        question: `How do I request a quote for ${name}?`,
        answer: "Please share material type, belt width or flow path, layer height, installation space, target impurity size, and cleaning requirements."
      },
      {
        question: "Can this uploaded product be customized?",
        answer: "Yes. Cowinmagnet can help coordinate product matching, technical communication, quality inspection support and export details."
      }
    ]
  };
}

export async function getProductsWithCms() {
  const uploadedProducts = await getCmsItems("product");
  return [...products, ...uploadedProducts.map(cmsProductToProduct)];
}

export async function getProductCategoryNamesWithCms() {
  const allProducts = await getProductsWithCms();
  return [...new Set([...productCategories, ...allProducts.map((product) => product.category)])];
}

export async function getProductBySlugWithCms(slug) {
  const allProducts = await getProductsWithCms();
  return allProducts.find((product) => product.slug === slug);
}
