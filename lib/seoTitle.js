const TRAILING_BRAND = /(?:\s*\|\s*COWIN MAGNET)+\s*$/i;

export function pageTitleForTemplate(value) {
  return String(value || "").replace(TRAILING_BRAND, "").trim();
}
