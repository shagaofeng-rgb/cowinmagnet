import { products, productCategories } from "@/data/products";
import { getCmsItems } from "@/lib/cmsStore";
import { getConfirmedProductFacts, getConfirmedProductFactsMap } from "@/lib/productResearch";

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

async function getUploadedProductsSafely() {
  try {
    return await getCmsItems("product");
  } catch (error) {
    // Keep the public catalogue available during a transient CMS/database outage.
    // The failure stays visible in runtime logs; admin operations still require the database.
    console.error("[product-cms] CMS product read failed; serving the published static catalogue", {
      message: error?.message || String(error)
    });
    return [];
  }
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
    image: String(item.image || "/assets/products/automatic-cleaning-magnetic-separator.webp"),
    summary,
    keywords: [name, category, "magnetic separation equipment"],
    features: features.length ? features : ["Uploaded from backend CMS", "Selection support according to working conditions"],
    principle: String(item.overview || summary),
    // Only private research-card facts approved by the supplier are allowed into public product fields.
    specs: Array.isArray(item.confirmedSpecifications) ? item.confirmedSpecifications.map(normalizeSpec) : [],
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

function applyConfirmedFacts(product, confirmedFacts = []) {
  return { ...product, specs: confirmedFacts.length ? confirmedFacts : [] };
}

export async function getProductsWithCms() {
  const uploadedProducts = await getUploadedProductsSafely();
  const combined = [...products, ...uploadedProducts.map(cmsProductToProduct)];
  const confirmedFacts = await getConfirmedProductFactsMap(combined.map((product) => product.slug));
  return combined.map((product) => applyConfirmedFacts(product, confirmedFacts.get(product.slug) || []));
}

export async function getProductCategoryNamesWithCms() {
  const allProducts = await getProductsWithCms();
  return [...new Set([...productCategories, ...allProducts.map((product) => product.category)])];
}

export async function getProductBySlugWithCms(slug) {
  const uploadedProducts = await getUploadedProductsSafely();
  const product = products.find((item) => item.slug === slug) || uploadedProducts.map(cmsProductToProduct).find((item) => item.slug === slug);
  return product ? applyConfirmedFacts(product, await getConfirmedProductFacts(product.slug)) : undefined;
}
