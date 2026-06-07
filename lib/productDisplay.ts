import type { Product } from "@/data/products";

const SCRIPT_ARTIFACT_PATTERNS = [
  "window.onload",
  "window.dataLayer",
  "gtag(",
  "products_details.css",
  "tenantId=",
  "visittrack_siteId",
  "document.domain",
  "c_portalResnav_main"
];

const INVALID_SPEC_VALUES = new Set([
  "JSON",
  "UA-162924846",
  "UA-162924846-5"
]);

function hasScriptArtifact(value: string) {
  return SCRIPT_ARTIFACT_PATTERNS.some((pattern) => value.includes(pattern));
}

export function cleanProductText(value: string | undefined, fallback = "") {
  const text = String(value || "").trim();
  if (!text || hasScriptArtifact(text)) {
    return fallback;
  }
  return text;
}

export function cleanProductList(items: string[] | undefined) {
  return (items || [])
    .map((item) => cleanProductText(item))
    .filter((item) => item && !INVALID_SPEC_VALUES.has(item.replace(/^Model:\s*/i, "").trim()));
}

export function cleanProductSpecs(specs: Product["specs"]) {
  return (specs || []).filter((spec) => {
    const label = cleanProductText(spec.label);
    const value = cleanProductText(spec.value);
    return label && value && !INVALID_SPEC_VALUES.has(value.trim());
  });
}
