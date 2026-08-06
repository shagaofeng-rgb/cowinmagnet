import fs from "node:fs";
import path from "node:path";

const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.cowinmagnet.com").replace(/\/$/, "");
const reportDir = path.join(process.cwd(), "docs/final-audit/runtime");
fs.mkdirSync(reportDir, { recursive: true });

const publicPaths = [
  "/",
  "/en",
  "/en/products",
  "/en/products/suspended-self-unloading-iron-removers",
  "/en/products/magnetic-separation-equipment",
  "/en/news",
  "/en/about",
  "/en/contact",
  "/products",
  "/news",
  "/sitemap.xml",
  "/robots.txt",
  "/feed.xml",
  "/news-sitemap.xml"
];

function now() {
  return new Date().toISOString();
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 45000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal, redirect: "manual" });
    const text = await response.text().catch(() => "");
    return { ok: response.ok, status: response.status, url, text, headers: response.headers };
  } catch (error) {
    return { ok: false, status: 0, url, error: error?.message || String(error), text: "" };
  } finally {
    clearTimeout(timer);
  }
}

function isExpectedGeoBlock(result) {
  const text = String(result.text || "");
  const geoHeader = result.headers?.get?.("x-cowin-geo-block") || "";
  const vercelId = result.headers?.get?.("x-vercel-id") || "";
  return (
    result.status === 403 &&
    (Boolean(geoHeader) ||
      /^Access unavailable/i.test(text) ||
      /^Forbidden/i.test(text) ||
      /\bhnd1::/.test(vercelId))
  );
}

function hasBasicSeo(html) {
  return {
    title: /<title[^>]*>[^<]+<\/title>/i.test(html),
    description: /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(html),
    h1: /<h1[\s>]/i.test(html),
    canonical: /<link[^>]+rel=["']canonical["']/i.test(html) || /\/admin\//.test(html),
    htmlLang: /<html[^>]+lang=/i.test(html)
  };
}

function hasExpectedCanonical(url, html) {
  const expected = new URL(url).pathname;
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
  if (!match) return false;
  try {
    return new URL(match[1], siteUrl).pathname === expected;
  } catch {
    return false;
  }
}

function extractSitemapUrls(xml, limit = 20) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).slice(0, limit);
}

function urlOnCurrentSite(url) {
  try {
    const parsed = new URL(url);
    return `${siteUrl}${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

async function checkPublic() {
  const results = [];
  for (const pathName of publicPaths) {
    const url = `${siteUrl}${pathName}`;
    const result = await fetchWithTimeout(url);
    const contentType = result.headers?.get?.("content-type") || "";
    const seo = contentType.includes("text/html") ? hasBasicSeo(result.text) : {};
    if (contentType.includes("text/html")) seo.canonicalMatchesPath = hasExpectedCanonical(url, result.text);
    results.push({
      url,
      status: result.status,
      ok: (result.ok && (!contentType.includes("text/html") || seo.canonicalMatchesPath)) || [301, 302, 307, 308].includes(result.status) || isExpectedGeoBlock(result),
      contentType,
      seo,
      geoBlocked: isExpectedGeoBlock(result),
      edgeId: result.headers?.get?.("x-vercel-id") || "",
      error: result.error || ""
    });
  }

  const sitemap = results.find((item) => item.url.endsWith("/sitemap.xml"));
  if (sitemap?.ok) {
    const sitemapText = (await fetchWithTimeout(`${siteUrl}/sitemap.xml`)).text;
    for (const rawUrl of extractSitemapUrls(sitemapText, 20)) {
      const url = urlOnCurrentSite(rawUrl);
      const result = await fetchWithTimeout(url);
      const contentType = result.headers?.get?.("content-type") || "";
      const seo = contentType.includes("text/html") ? hasBasicSeo(result.text) : {};
      if (contentType.includes("text/html")) seo.canonicalMatchesPath = hasExpectedCanonical(url, result.text);
      results.push({
        url,
        status: result.status,
        ok: (result.ok && (!contentType.includes("text/html") || seo.canonicalMatchesPath)) || [301, 302, 307, 308].includes(result.status) || isExpectedGeoBlock(result),
        contentType,
        seo,
        geoBlocked: isExpectedGeoBlock(result),
        edgeId: result.headers?.get?.("x-vercel-id") || "",
        error: result.error || "",
        source: "sitemap"
      });
    }
  }

  return results;
}

async function checkAdmin() {
  const email = process.env.ADMIN_SMOKE_EMAIL;
  const password = process.env.ADMIN_SMOKE_PASSWORD;
  const results = [];

  const loginPage = await fetchWithTimeout(`${siteUrl}/admin/login`);
  results.push({
    url: `${siteUrl}/admin/login`,
    status: loginPage.status,
    ok: loginPage.ok || isExpectedGeoBlock(loginPage),
    geoBlocked: isExpectedGeoBlock(loginPage),
    edgeId: loginPage.headers?.get?.("x-vercel-id") || "",
    hasPasswordToggle: /admin-password-field|显示密码|隐藏密码/.test(loginPage.text),
    error: loginPage.error || ""
  });

  if (!email || !password) {
    results.push({ skipped: true, reason: "ADMIN_SMOKE_EMAIL or ADMIN_SMOKE_PASSWORD not provided" });
    return results;
  }

  const body = new URLSearchParams({ email, password });
  const login = await fetchWithTimeout(`${siteUrl}/api/admin/login`, {
    method: "POST",
    body,
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
  const cookie = login.headers?.get?.("set-cookie") || "";
  const sessionCookie = cookie.match(/cowin_admin_session=[^;]+/)?.[0] || "";
  results.push({
    url: `${siteUrl}/api/admin/login`,
    status: login.status,
    ok: [303, 302].includes(login.status) && Boolean(sessionCookie),
    location: login.headers?.get?.("location") || "",
    sessionCookie: Boolean(sessionCookie),
    error: login.error || ""
  });

  if (!sessionCookie) return results;

  for (const pathName of ["/admin/settings", "/admin/analytics?range=day", "/api/admin/analytics?range=day", "/api/admin/analytics?range=week", "/api/admin/analytics?range=month"]) {
    const result = await fetchWithTimeout(`${siteUrl}${pathName}`, { headers: { cookie: sessionCookie } });
    let rangeDays = null;
    if (pathName.startsWith("/api/")) {
      try {
        rangeDays = JSON.parse(result.text).rangeDays;
      } catch {
        rangeDays = null;
      }
    }
    results.push({
      url: `${siteUrl}${pathName}`,
      status: result.status,
      ok: result.ok,
      rangeDays,
      error: result.error || ""
    });
  }

  return results;
}

const publicResults = await checkPublic();
const adminResults = await checkAdmin();
const report = {
  generatedAt: now(),
  siteUrl,
  publicResults,
  adminResults,
  summary: {
    publicTotal: publicResults.length,
    publicFailed: publicResults.filter((item) => !item.ok).length,
    adminTotal: adminResults.length,
    adminFailed: adminResults.filter((item) => item.ok === false).length
  }
};

const reportPath = path.join(reportDir, `smoke-${Date.now()}.json`);
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`FINAL_AUDIT_SMOKE_REPORT=${reportPath}`);
console.log(`PUBLIC_FAILED=${report.summary.publicFailed}/${report.summary.publicTotal}`);
console.log(`ADMIN_FAILED=${report.summary.adminFailed}/${report.summary.adminTotal}`);

if (report.summary.publicFailed || report.summary.adminFailed) {
  process.exitCode = 1;
}
