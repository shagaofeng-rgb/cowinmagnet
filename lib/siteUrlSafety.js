const PRIMARY_ORIGIN = "https://www.cowinmagnet.com";
const ALLOWED_HOSTS = new Set(["www.cowinmagnet.com", "cowinmagnet.com"]);

function parseSiteUrl(value) {
  const raw = String(value || "").trim();
  if (!raw || raw.length > 2048) return null;

  try {
    const url = new URL(raw, PRIMARY_ORIGIN);
    if (!ALLOWED_HOSTS.has(url.hostname.toLowerCase())) return null;
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

export function safeSitePath(value) {
  const url = parseSiteUrl(value);
  return url ? `${url.pathname}${url.search}` : "";
}

export function safeSiteUrl(value) {
  const url = parseSiteUrl(value);
  return url ? `${PRIMARY_ORIGIN}${url.pathname}${url.search}` : "";
}
