import { listNewsSourcesForValidation, updateNewsSourceValidation } from "../newsAutomationStore.js";

const CHECK_TIMEOUT_MS = 10_000;

function canonicalOrigin(source) {
  const requested = source.requested_url || `https://${source.domain}`;
  try { return new URL(requested).origin; }
  catch { return `https://${source.domain}`; }
}

function robotsAllowsResearch(text = "") {
  const rules = String(text).replace(/\r/g, "").split("\n");
  let applies = false;
  for (const line of rules) {
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") applies = value === "*" || /cowinmagnet/i.test(value);
    if (applies && key === "disallow" && (value === "/" || value === "/*")) return false;
  }
  return true;
}

async function fetchWithTimeout(fetcher, url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try { return await fetcher(url, { ...options, signal: controller.signal, headers: { "user-agent": "COWIN-MAGNET-News-Source-Validator/1.0" } }); }
  finally { clearTimeout(timer); }
}

// This deliberately validates only a small batch. A pending source does not become
// eligible until a maintainer records a lawful public discovery endpoint such as RSS.
export async function runNewsSourceHealthCheck({ siteId, fetcher = fetch, limit = 3 } = {}) {
  const sources = await listNewsSourcesForValidation({ siteId, limit });
  const results = [];
  for (const source of sources) {
    const origin = canonicalOrigin(source);
    try {
      const robots = await fetchWithTimeout(fetcher, `${origin}/robots.txt`);
      const robotsText = robots.ok ? await robots.text() : "";
      if (!robots.ok || !robotsAllowsResearch(robotsText)) {
        await updateNewsSourceValidation({ siteId, domain: source.domain, validationStatus: "robots-blocked", robotsAllowed: false, active: false, notes: `robots check returned ${robots.status}`, retryAfterMinutes: 10_080 });
        results.push({ domain: source.domain, status: "robots-blocked", httpStatus: robots.status });
        continue;
      }
      const page = await fetchWithTimeout(fetcher, origin, { redirect: "follow" });
      if (!page.ok) {
        await updateNewsSourceValidation({ siteId, domain: source.domain, validationStatus: "inactive", robotsAllowed: true, active: false, notes: `public-page check returned ${page.status}`, retryAfterMinutes: 4_320 });
        results.push({ domain: source.domain, status: "inactive", httpStatus: page.status });
        continue;
      }
      await updateNewsSourceValidation({ siteId, domain: source.domain, validationStatus: "needs_review", robotsAllowed: true, active: false, notes: "Public page and robots are reachable; a lawful RSS, sitemap, API or public news endpoint still needs approval.", retryAfterMinutes: 10_080 });
      results.push({ domain: source.domain, status: "needs_review", httpStatus: page.status });
    } catch (error) {
      await updateNewsSourceValidation({ siteId, domain: source.domain, validationStatus: "inactive", robotsAllowed: null, active: false, notes: String(error?.message || error).slice(0, 300), retryAfterMinutes: 4_320 });
      results.push({ domain: source.domain, status: "inactive", error: String(error?.message || error).slice(0, 160) });
    }
  }
  return { checked: results.length, results };
}

export { robotsAllowsResearch };
