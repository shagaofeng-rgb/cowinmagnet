import { getProductBySlugWithCms } from "@/lib/productCms";

function productSlug(value = "") {
  try {
    const pathname = new URL(value, "https://www.cowinmagnet.com").pathname;
    return pathname.split("/").filter(Boolean).at(-1) || "";
  } catch {
    return String(value).split("/").filter(Boolean).at(-1) || "";
  }
}

function ownedPublicAsset(src = "") {
  const value = String(src || "").trim();
  // productCms uses this legacy generic fallback when a record has no image.
  // It is not evidence that the image belongs to the requested product.
  if (value.endsWith("/assets/products/automatic-cleaning-magnetic-separator.webp")) return "";
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    return /(^|\.)cowinmagnet\.com$/i.test(url.hostname) ? value : "";
  } catch {
    return "";
  }
}

function readableSummary(product) {
  const name = String(product?.name || "this product").trim();
  const category = String(product?.category || "industrial magnetic separation").trim();
  // Existing catalogue marketing copy is not treated as a confirmed technical claim.
  // The public News fallback uses only the product identity and category until the
  // private research card supplies approved product facts.
  return `${name} is listed by COWIN MAGNET in the ${category} category. Configuration is discussed from material and site conditions.`;
}

export async function resolveProductTruthCard({ productId = "", productUrl = "", applicationScenario = "" } = {}) {
  const slug = productSlug(productId || productUrl);
  if (!slug) return { resolved: false, reason: "missing-product-reference" };
  const product = await getProductBySlugWithCms(slug);
  if (!product || product.status === "archived") return { resolved: false, reason: "product-not-found", slug };
  const imageSrc = ownedPublicAsset(product.image);
  const productName = String(product.name || "").trim();
  if (!productName) return { resolved: false, reason: "product-name-missing", slug };
  const imageAlt = `${productName} for ${applicationScenario || "industrial material handling"}`.replace(/\s+/g, " ").trim();
  return {
    resolved: true,
    product: {
      productId: slug,
      slug,
      category: String(product.category || "Industrial magnetic separation"),
      productName,
      publicUrl: `/en/products/${slug}`,
      verifiedSummary: readableSummary(product),
      verifiedFeatures: [],
      verifiedSpecifications: Object.fromEntries((Array.isArray(product.specs) ? product.specs : []).filter((spec) => spec?.label && spec?.value).map((spec) => [String(spec.label), String(spec.value)])),
      approvedIndustries: Array.isArray(product.applications) ? product.applications.map(String).filter(Boolean) : [],
      approvedScenarios: applicationScenario ? [applicationScenario] : [],
      productImages: imageSrc ? [{ id: `product:${slug}:primary`, src: imageSrc, alt: imageAlt, role: "primary", ownership: "owned", isPublished: true }] : [],
      missingFields: imageSrc ? [] : ["missing_owned_product_image"],
      prohibitedClaims: ["factory ownership", "certification", "guaranteed performance"],
      dataConfidence: Array.isArray(product.specs) && product.specs.length ? "verified" : "partial"
    }
  };
}

export async function resolveProductMedia(input = {}) {
  const truth = await resolveProductTruthCard(input);
  if (!truth.resolved) return truth;
  const primary = truth.product.productImages.find((image) => image.role === "primary" && image.isPublished && image.ownership === "owned");
  if (!primary) return { resolved: false, reason: "missing_owned_product_image", product: truth.product };
  return {
    resolved: true,
    product: truth.product,
    snapshot: {
      productId: truth.product.productId,
      productName: truth.product.productName,
      productUrl: truth.product.publicUrl,
      imageId: primary.id,
      src: primary.src,
      alt: primary.alt,
      capturedAt: new Date().toISOString()
    }
  };
}
