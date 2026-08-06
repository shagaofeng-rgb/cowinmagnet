import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveMonitorConfig } from "./config.mjs";
import { sendMonitorEmail } from "./email.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "../..");

function nowInShanghai() {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

function slugTime(value = nowInShanghai()) {
  return value.replace(/[-: ]/g, "-");
}

function absoluteUrl(siteUrl, value) {
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return siteUrl;
  }
}

function toRelativePath(siteUrl, url) {
  try {
    const parsed = new URL(url, siteUrl);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

function sameOrigin(siteUrl, url) {
  try {
    return new URL(siteUrl).origin === new URL(url, siteUrl).origin;
  } catch {
    return false;
  }
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function attr(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = tag.match(pattern);
  return decodeEntities(match?.[2] || match?.[3] || match?.[4] || "");
}

function metaContent(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<meta\\b(?=[^>]*(?:name|property)=["']${escaped}["'])[^>]*>`, "i");
  const tag = html.match(re)?.[0] || "";
  return attr(tag, "content");
}

function titleOf(html) {
  return decodeEntities(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim();
}

function h1Count(html) {
  return (html.match(/<h1\b/gi) || []).length;
}

function canonicalOf(html) {
  const tag = html.match(/<link\b(?=[^>]*rel=["'][^"']*canonical[^"']*["'])[^>]*>/i)?.[0] || "";
  return attr(tag, "href");
}

function hreflangCount(html) {
  return (html.match(/<link\b(?=[^>]*rel=["'][^"']*alternate[^"']*["'])(?=[^>]*hreflang=)[^>]*>/gi) || []).length;
}

function imgTags(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
}

function linkTags(html) {
  return [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
}

function isTrackingPixelImage(tagOrUrl = "") {
  const value = String(tagOrUrl || "").toLowerCase();
  if (value.includes("facebook.com/tr?")) return true;
  if (value.includes("google-analytics.com") || value.includes("googletagmanager.com")) return true;
  const width = attr(value, "width");
  const height = attr(value, "height");
  const style = attr(value, "style").toLowerCase();
  return (width === "1" && height === "1") || style.includes("display:none") || style.includes("display: none");
}

function extractResources(siteUrl, html) {
  const resources = [];
  for (const tag of imgTags(html)) {
    if (isTrackingPixelImage(tag)) continue;
    const src = attr(tag, "src") || attr(tag, "data-src");
    if (src && !src.startsWith("data:")) resources.push({ type: "image", url: absoluteUrl(siteUrl, src) });
  }
  for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    resources.push({ type: "script", url: absoluteUrl(siteUrl, decodeEntities(match[1])) });
  }
  for (const match of html.matchAll(/<link\b(?=[^>]*rel=["'][^"']*stylesheet[^"']*["'])[^>]*>/gi)) {
    const href = attr(match[0], "href");
    if (href) resources.push({ type: "stylesheet", url: absoluteUrl(siteUrl, href) });
  }
  const unique = new Map();
  for (const resource of resources) {
    if (sameOrigin(siteUrl, resource.url) || resource.url.startsWith("http")) {
      unique.set(`${resource.type}:${resource.url}`, resource);
    }
  }
  return [...unique.values()];
}

async function fetchWithTiming(url, { timeoutMs, method = "GET" }) {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method,
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "CowinmagnetMonitor/1.0 (+https://www.cowinmagnet.com)"
      }
    });
    const text = method === "HEAD" ? "" : await response.text();
    return {
      ok: response.ok,
      status: response.status,
      url: response.url,
      redirected: response.redirected,
      headers: response.headers,
      text,
      durationMs: Date.now() - started
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      url,
      redirected: false,
      headers: new Headers(),
      text: "",
      durationMs: Date.now() - started,
      error: error?.name === "AbortError" ? "timeout" : error?.message || "fetch failed"
    };
  } finally {
    clearTimeout(timer);
  }
}

function issue(severity, category, url, message, suggestion = "Please review this item manually.") {
  return { severity, category, url, message, suggestion };
}

function classifyStatusIssue(url, status) {
  if (status >= 500) return issue(url.endsWith("/") ? "P0" : "P1", "availability", url, `HTTP ${status} server error.`, "Check deployment/runtime logs and upstream services.");
  if (status === 404) return issue(url.endsWith("/") ? "P0" : "P1", "availability", url, "Page returned 404.", "Restore the route or update links/sitemap.");
  if ([301, 302, 303, 307, 308].includes(status)) return issue("P2", "availability", url, `Unexpected redirect status ${status}.`, "Confirm redirect target is intended.");
  if (status !== 200) return issue("P1", "availability", url, `Unexpected HTTP status ${status || "timeout"}.`, "Check page availability.");
  return null;
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let index = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  });
  await Promise.all(runners);
  return results;
}

async function discoverSitemapPages(config, issues) {
  const sitemapUrl = `${config.siteUrl}/sitemap.xml`;
  const queue = [sitemapUrl];
  const visited = new Set();
  const urls = [];

  while (queue.length > 0 && urls.length < config.maxSitemapUrls) {
    const currentUrl = queue.shift();
    if (!currentUrl || visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    const response = await fetchWithTiming(currentUrl, { timeoutMs: config.timeoutMs });
    if (!response.ok) {
      issues.push(
        issue(
          currentUrl === sitemapUrl ? "P1" : "P2",
          "seo",
          currentUrl,
          `Sitemap is not reachable: ${response.status || response.error}.`,
          "Confirm sitemap generation and robots settings."
        )
      );
      continue;
    }

    const locs = [...response.text.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
      .map((match) => decodeEntities(match[1]).trim())
      .filter((url) => sameOrigin(config.siteUrl, url));

    if (/<sitemapindex\b/i.test(response.text)) {
      queue.push(...locs.filter((url) => !visited.has(url)));
      continue;
    }

    urls.push(...locs.slice(0, config.maxSitemapUrls - urls.length));
  }

  return urls.map((url) => ({
    label: "Sitemap URL",
    path: toRelativePath(config.siteUrl, url),
    source: "sitemap"
  }));
}

async function checkResource(resource, pageUrl, config) {
  let response = await fetchWithTiming(resource.url, { timeoutMs: config.timeoutMs, method: "HEAD" });
  if (!response.ok && response.status === 405) {
    response = await fetchWithTiming(resource.url, { timeoutMs: config.timeoutMs, method: "GET" });
  }

  const bytes = Number(response.headers.get("content-length") || 0);
  const item = {
    ...resource,
    status: response.status,
    ok: response.ok,
    durationMs: response.durationMs,
    bytes
  };
  const issues = [];

  if (!response.ok) {
    issues.push(issue(resource.type === "image" ? "P2" : "P1", "resource", pageUrl, `${resource.type} failed: ${resource.url} (${response.status || response.error}).`, "Fix the missing resource URL or deployment asset."));
  } else if (response.durationMs > config.performanceThresholds.resourceResponseMs) {
    issues.push(issue("P3", "performance", pageUrl, `${resource.type} loaded slowly: ${resource.url} (${response.durationMs}ms).`, "Optimize or cache this resource."));
  }

  if (resource.type === "image" && bytes > config.performanceThresholds.imageBytes) {
    issues.push(issue("P3", "performance", pageUrl, `Large image over 1MB: ${resource.url}.`, "Compress or resize the image."));
  }
  if (resource.type === "script" && bytes > config.performanceThresholds.scriptBytes) {
    issues.push(issue("P2", "performance", pageUrl, `Large JS file over 500KB: ${resource.url}.`, "Split, defer, or reduce this script."));
  }

  return { item, issues };
}

function checkSeo({ url, html, headers }) {
  const title = titleOf(html);
  const description = metaContent(html, "description");
  const canonical = canonicalOf(html);
  const h1s = h1Count(html);
  const images = imgTags(html).filter((tag) => !isTrackingPixelImage(tag));
  const missingAlt = images.filter((tag) => !attr(tag, "alt").trim()).length;
  const hreflangs = hreflangCount(html);
  const robotsHeader = headers?.get("x-robots-tag") || "";
  const robotsMeta = metaContent(html, "robots");
  const isIndexable = !/\bnoindex\b/i.test(`${robotsHeader} ${robotsMeta}`);
  const issues = [];

  if (!title) issues.push(issue("P1", "seo", url, "Missing or empty title.", "Add a unique SEO title."));
  if (!description) issues.push(issue("P1", "seo", url, "Missing or empty meta description.", "Add a concise meta description."));
  if (h1s !== 1) issues.push(issue(h1s === 0 ? "P1" : "P2", "seo", url, `Expected exactly one H1, found ${h1s}.`, "Keep one primary H1 per page."));
  if (!canonical) issues.push(issue("P2", "seo", url, "Missing canonical link.", "Add canonical metadata for this route."));
  if (missingAlt > 0) issues.push(issue("P2", "seo", url, `${missingAlt} images are missing alt text.`, "Add meaningful alt text to product and content images."));
  if (/\/(en|es|ru|ar|fr|pt)(\/|$)/.test(new URL(url).pathname) && isIndexable && hreflangs < 2) {
    issues.push(issue("P2", "seo", url, "Indexable localized page is missing English and x-default hreflang alternates.", "Add alternates.languages metadata."));
  }

  return {
    title,
    description,
    canonical,
    h1Count: h1s,
    imageCount: images.length,
    missingAlt,
    hreflangCount: hreflangs,
    indexable: isIndexable,
    issues
  };
}

function checkInteractions({ url, html }) {
  const links = linkTags(html);
  const hrefs = links.map((tag) => attr(tag, "href")).filter(Boolean);
  const issues = [];

  const emptyLinks = hrefs.filter((href) => href === "#" || href.toLowerCase().startsWith("javascript:")).length;
  if (emptyLinks > 0) {
    issues.push(issue("P3", "interaction", url, `${emptyLinks} links use placeholder hrefs.`, "Replace placeholder links with real targets or buttons."));
  }

  if (/\/contact|\/request-quote/.test(new URL(url).pathname)) {
    if (!hrefs.some((href) => href.startsWith("mailto:"))) issues.push(issue("P2", "interaction", url, "Contact page has no mailto link.", "Add or restore the email link."));
    if (!hrefs.some((href) => href.startsWith("tel:"))) issues.push(issue("P2", "interaction", url, "Contact page has no tel link.", "Add or restore the phone link."));
    if (!/whatsapp|wa\.me/i.test(html)) issues.push(issue("P2", "interaction", url, "Contact page has no visible WhatsApp link.", "Add or restore the WhatsApp contact link."));
  }

  const nonSearchForms = [...html.matchAll(/<form\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => !/role=["']search["']|class=["'][^"']*site-search-form/i.test(tag));

  if (nonSearchForms.length > 0) {
    const hasSubmit = /<button\b[^>]*type=["']submit["']|<input\b[^>]*type=["']submit["']/i.test(html);
    if (!hasSubmit) issues.push(issue("P2", "interaction", url, "Form is present but no submit button was detected.", "Check form submit controls."));
    for (const name of ["name", "email", "message"]) {
      if (!new RegExp(`name=["']${name}["']`, "i").test(html)) {
        issues.push(issue("P2", "interaction", url, `Form field "${name}" was not detected.`, "Confirm inquiry form fields are rendered."));
      }
    }
  }

  return { linkCount: hrefs.length, issues };
}

async function checkPage(page, config) {
  const url = absoluteUrl(config.siteUrl, page.path);
  const response = await fetchWithTiming(url, { timeoutMs: config.timeoutMs });
  const issues = [];
  const statusIssue = classifyStatusIssue(url, response.status);
  if (statusIssue) issues.push(statusIssue);
  if (response.error === "timeout") {
    issues.push(issue(url === `${config.siteUrl}/` ? "P0" : "P1", "availability", url, `Page timed out after ${config.timeoutMs}ms.`, "Check deployment, CDN, and origin response time."));
  }
  if (response.durationMs > config.performanceThresholds.pageResponseMs) {
    issues.push(issue(url === `${config.siteUrl}/` ? "P1" : "P2", "performance", url, `Slow page response: ${response.durationMs}ms.`, "Review server rendering, cache, and large assets."));
  }

  const html = response.text || "";
  const contentType = response.headers.get("content-type") || "";
  const isHtml = /(?:text\/html|application\/xhtml\+xml)/i.test(contentType);
  const visibleText = stripHtml(html);
  if (response.ok && isHtml && visibleText.length < 120) {
    issues.push(issue(url === `${config.siteUrl}/` ? "P0" : "P1", "availability", url, "Page content appears nearly blank.", "Inspect frontend rendering and data loading."));
  }
  if (/\b(undefined|null|NaN)\b/i.test(visibleText)) {
    issues.push(issue("P2", "data", url, "Rendered text contains undefined/null/NaN.", "Inspect the page data mapping."));
  }
  if (/hydration failed|hydration error|text content does not match/i.test(html)) {
    issues.push(issue("P1", "frontend", url, "Hydration error text was found in HTML.", "Inspect React rendering consistency."));
  }

  const seo = response.ok && isHtml ? checkSeo({ url, html, headers: response.headers }) : null;
  if (seo) issues.push(...seo.issues);

  const interaction = response.ok && isHtml ? checkInteractions({ url, html }) : null;
  if (interaction) issues.push(...interaction.issues);

  const resources = response.ok && isHtml ? extractResources(config.siteUrl, html).slice(0, config.maxResourcesPerPage) : [];
  const resourceResults = await mapLimit(resources, 6, (resource) => checkResource(resource, url, config));
  const resourceIssues = resourceResults.flatMap((result) => result.issues).slice(0, 12);
  issues.push(...resourceIssues);

  const resourceSummary = resourceResults.reduce(
    (summary, result) => {
      summary.count += 1;
      summary.bytes += result.item.bytes || 0;
      summary.byType[result.item.type] = (summary.byType[result.item.type] || 0) + 1;
      if (!result.item.ok) summary.failed += 1;
      return summary;
    },
    { count: 0, failed: 0, bytes: 0, byType: {} }
  );

  if (resourceSummary.bytes > config.performanceThresholds.totalPageBytes) {
    issues.push(issue("P3", "performance", url, `Total checked resource size is ${Math.round(resourceSummary.bytes / 1024)}KB.`, "Compress or lazy-load large assets."));
  }

  return {
    label: page.label,
    source: page.source || "config",
    url,
    status: response.status,
    ok: response.ok,
    redirected: response.redirected,
    finalUrl: response.url,
    responseMs: response.durationMs,
    contentType,
    htmlBytes: Buffer.byteLength(html),
    seo,
    interaction,
    resources: resourceSummary,
    issues
  };
}

async function checkApiEndpoint(endpoint, config) {
  const url = absoluteUrl(config.siteUrl, endpoint.path);
  const response = await fetchWithTiming(url, { timeoutMs: config.timeoutMs });
  const issues = [];
  if (!response.ok) {
    issues.push(issue(endpoint.path.includes("analytics") ? "P1" : "P2", "api", url, `${endpoint.label} failed: ${response.status || response.error}.`, "Check the API route and backing store."));
  }
  if (response.durationMs > config.performanceThresholds.pageResponseMs) {
    issues.push(issue("P2", "api", url, `${endpoint.label} is slow: ${response.durationMs}ms.`, "Review API query and cache behavior."));
  }
  let json = null;
  if (endpoint.expectJson && response.ok) {
    try {
      json = JSON.parse(response.text);
    } catch {
      issues.push(issue("P1", "api", url, `${endpoint.label} did not return valid JSON.`, "Return a valid JSON response."));
    }
    if (json && JSON.stringify(json).match(/\b(undefined|NaN)\b/i)) {
      issues.push(issue("P2", "api", url, `${endpoint.label} JSON contains abnormal values.`, "Inspect API serialization."));
    }
  }

  return {
    label: endpoint.label,
    url,
    status: response.status,
    ok: response.ok,
    responseMs: response.durationMs,
    json,
    issues
  };
}

function addDuplicateSeoIssues(pageChecks, issues) {
  const byTitle = new Map();
  const byDescription = new Map();
  const routeKey = (url) => {
    try {
      const pathname = new URL(url).pathname.replace(/\/+$/, "") || "/";
      const withoutLocale = pathname.replace(/^\/(en|es|ru|ar|fr|pt)(?=\/|$)/, "") || "/";
      return withoutLocale;
    } catch {
      return url;
    }
  };
  const isOnlyLocalizedVariants = (urls) => new Set(urls.map(routeKey)).size === 1;

  for (const page of pageChecks) {
    if (!page.seo) continue;
    // A monitored legacy URL can deliberately redirect to the same canonical
    // page as another monitored route. Count the canonical once, not twice.
    const identity = page.seo.canonical || page.finalUrl || page.url;
    if (page.seo.title) byTitle.set(page.seo.title, [...(byTitle.get(page.seo.title) || []), identity]);
    if (page.seo.description) byDescription.set(page.seo.description, [...(byDescription.get(page.seo.description) || []), identity]);
  }
  for (const [title, urls] of byTitle) {
    if (isOnlyLocalizedVariants(urls)) continue;
    if (urls.length > 1) issues.push(issue("P3", "seo", urls[0], `Duplicate title on ${urls.length} checked pages: ${title}`, "Make titles unique for important pages."));
  }
  for (const [description, urls] of byDescription) {
    if (isOnlyLocalizedVariants(urls)) continue;
    if (urls.length > 1) issues.push(issue("P3", "seo", urls[0], `Duplicate meta description on ${urls.length} checked pages.`, "Make descriptions unique for important pages."));
  }
}

async function runOptionalPlaywright(pageChecks, config, runId, issues) {
  const screenshots = [];
  if (!config.enablePlaywright) return { enabled: false, reason: "disabled", screenshots };

  let chromium;
  try {
    const optionalImport = new Function("specifier", "return import(specifier)");
    ({ chromium } = await optionalImport("playwright"));
  } catch {
    return { enabled: false, reason: "playwright-not-installed", screenshots };
  }

  const targetPages = pageChecks
    .filter((page) => page.ok)
    .filter((page) => /\/$|\/products$|\/products\/|\/contact$/.test(new URL(page.url).pathname))
    .slice(0, 4);
  const targetViewports = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "mobile-390", width: 390, height: 844 }
  ];
  const screenshotDir = path.resolve(PROJECT_ROOT, config.screenshotOutputDir, runId);
  await fs.mkdir(screenshotDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    for (const pageCheck of targetPages) {
      for (const viewport of targetViewports) {
        const page = await browser.newPage({ viewport });
        const consoleErrors = [];
        page.on("console", (msg) => {
          if (msg.type() === "error") consoleErrors.push(msg.text());
        });
        page.on("pageerror", (error) => consoleErrors.push(error.message));
        await page.goto(pageCheck.url, { waitUntil: "networkidle", timeout: config.timeoutMs }).catch((error) => {
          issues.push(issue("P1", "frontend", pageCheck.url, `Browser render failed: ${error.message}`, "Inspect client-side runtime errors."));
        });

        const metrics = await page.evaluate(() => ({
          bodyTextLength: document.body?.innerText?.trim().length || 0,
          horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
          failedImages: Array.from(document.images).filter((img) => !img.complete || img.naturalWidth === 0).length
        }));

        if (metrics.bodyTextLength < 120) issues.push(issue("P1", "frontend", pageCheck.url, `Browser render appears blank at ${viewport.name}.`, "Inspect client-side rendering."));
        if (metrics.horizontalOverflow) issues.push(issue("P2", "responsive", pageCheck.url, `Horizontal overflow detected at ${viewport.name}.`, "Check mobile/desktop layout width constraints."));
        if (metrics.failedImages > 0) issues.push(issue("P2", "resource", pageCheck.url, `${metrics.failedImages} rendered images failed at ${viewport.name}.`, "Check image sources and dimensions."));
        if (consoleErrors.length > 0) {
          issues.push(issue("P1", "frontend", pageCheck.url, `Browser console errors at ${viewport.name}: ${consoleErrors.slice(0, 3).join(" | ")}`, "Inspect frontend console errors."));
        }

        const safeName = `${new URL(pageCheck.url).pathname.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-") || "home"}-${viewport.name}.png`;
        const filePath = path.join(screenshotDir, safeName);
        await page.screenshot({ path: filePath, fullPage: true });
        screenshots.push(filePath);
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  return { enabled: true, screenshots };
}

function severityCounts(issues) {
  return issues.reduce(
    (counts, item) => {
      counts[item.severity] = (counts[item.severity] || 0) + 1;
      return counts;
    },
    { P0: 0, P1: 0, P2: 0, P3: 0 }
  );
}

function healthStatus(counts) {
  if (counts.P0 > 0) return "Critical";
  if (counts.P1 > 0 || counts.P2 > 10) return "Warning";
  return "Healthy";
}

function summarizeCategories(issues) {
  return issues.reduce((summary, item) => {
    summary[item.category] = (summary[item.category] || 0) + 1;
    return summary;
  }, {});
}

function makeTextSummary(report) {
  const lines = [
    `Cowinmagnet website monitor report`,
    `Check time: ${report.checkedAtShanghai} (Asia/Shanghai)`,
    `Site: ${report.siteUrl}`,
    `Health: ${report.health}`,
    `Pages checked: ${report.summary.pagesChecked}, abnormal pages: ${report.summary.abnormalPages}`,
    `Issues: P0 ${report.counts.P0}, P1 ${report.counts.P1}, P2 ${report.counts.P2}, P3 ${report.counts.P3}`,
    `Report JSON: ${report.paths.json || "not saved"}`,
    `Report HTML: ${report.paths.html || "not saved"}`,
    ""
  ];

  const important = report.issues.filter((item) => ["P0", "P1", "P2"].includes(item.severity)).slice(0, 20);
  if (important.length === 0) {
    lines.push("No P0/P1/P2 problems found in this run.");
  } else {
    lines.push("Main problems:");
    for (const item of important) {
      lines.push(`- [${item.severity}] ${item.category}: ${item.message}`);
      lines.push(`  URL: ${item.url}`);
      lines.push(`  Suggestion: ${item.suggestion}`);
    }
  }

  return lines.join("\n");
}

function htmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function makeHtmlReport(report) {
  const rows = report.issues
    .map(
      (item) => `<tr>
        <td>${htmlEscape(item.severity)}</td>
        <td>${htmlEscape(item.category)}</td>
        <td><a href="${htmlEscape(item.url)}">${htmlEscape(item.url)}</a></td>
        <td>${htmlEscape(item.message)}</td>
        <td>${htmlEscape(item.suggestion)}</td>
      </tr>`
    )
    .join("");

  const screenshots = report.screenshots
    .map((file) => `<li>${htmlEscape(file)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Cowinmagnet Monitor ${htmlEscape(report.checkedAtShanghai)}</title>
  <style>
    body{font-family:Arial,sans-serif;margin:32px;color:#111827;line-height:1.55}
    h1{font-size:24px;margin:0 0 12px}
    h2{font-size:18px;margin-top:28px}
    .summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:20px 0}
    .box{border:1px solid #d1d5db;border-radius:8px;padding:12px;background:#f9fafb}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th,td{border:1px solid #d1d5db;padding:8px;vertical-align:top;font-size:13px}
    th{background:#f3f4f6;text-align:left}
  </style>
</head>
<body>
  <h1>Cowinmagnet Website Monitor</h1>
  <p><strong>Checked at:</strong> ${htmlEscape(report.checkedAtShanghai)} Asia/Shanghai</p>
  <p><strong>Site:</strong> <a href="${htmlEscape(report.siteUrl)}">${htmlEscape(report.siteUrl)}</a></p>
  <div class="summary">
    <div class="box"><strong>Health</strong><br>${htmlEscape(report.health)}</div>
    <div class="box"><strong>Pages</strong><br>${report.summary.pagesChecked}</div>
    <div class="box"><strong>Normal pages</strong><br>${report.summary.normalPages}</div>
    <div class="box"><strong>Abnormal pages</strong><br>${report.summary.abnormalPages}</div>
    <div class="box"><strong>P0/P1/P2/P3</strong><br>${report.counts.P0}/${report.counts.P1}/${report.counts.P2}/${report.counts.P3}</div>
  </div>
  <h2>Issues</h2>
  <table>
    <thead><tr><th>Priority</th><th>Category</th><th>URL</th><th>Problem</th><th>Suggested direction</th></tr></thead>
    <tbody>${rows || `<tr><td colspan="5">No issues found.</td></tr>`}</tbody>
  </table>
  <h2>Screenshots</h2>
  <ul>${screenshots || "<li>No screenshots saved in this run.</li>"}</ul>
</body>
</html>`;
}

async function saveReports(report, config, runId) {
  if (!config.saveReports) return { json: "", html: "" };

  const reportDir = path.resolve(PROJECT_ROOT, config.reportOutputDir);
  await fs.mkdir(reportDir, { recursive: true });
  const jsonPath = path.join(reportDir, `cowinmagnet-monitor-${runId}.json`);
  const htmlPath = path.join(reportDir, `cowinmagnet-monitor-${runId}.html`);
  const html = makeHtmlReport(report);

  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2), "utf8");
  await fs.writeFile(htmlPath, html, "utf8");

  return { json: jsonPath, html: htmlPath };
}

export async function runWebsiteMonitor(options = {}) {
  const config = resolveMonitorConfig(options);
  const checkedAtShanghai = nowInShanghai();
  const runId = slugTime(checkedAtShanghai);
  const issues = [];

  const sitemapPages = await discoverSitemapPages(config, issues);
  const pageMap = new Map();
  for (const page of [...config.pagesToCheck, ...sitemapPages]) {
    const url = absoluteUrl(config.siteUrl, page.path);
    if (!pageMap.has(url)) pageMap.set(url, page);
  }
  const pages = [...pageMap.values()].slice(0, config.maxPages);

  const [pageChecks, apiChecks] = await Promise.all([
    mapLimit(pages, 4, (page) => checkPage(page, config)),
    mapLimit(config.apiEndpointsToCheck, 3, (endpoint) => checkApiEndpoint(endpoint, config))
  ]);

  issues.push(...pageChecks.flatMap((page) => page.issues));
  issues.push(...apiChecks.flatMap((api) => api.issues));
  addDuplicateSeoIssues(pageChecks, issues);

  const visual = await runOptionalPlaywright(pageChecks, config, runId, issues);
  const counts = severityCounts(issues);
  const categoryCounts = summarizeCategories(issues);
  const report = {
    checkedAt: new Date().toISOString(),
    checkedAtShanghai,
    siteUrl: config.siteUrl,
    environment: process.env.VERCEL ? "vercel" : "local",
    timezone: config.timezone,
    schedule: {
      beijing: config.scheduleBeijing,
      utc: config.scheduleUtc
    },
    health: healthStatus(counts),
    counts,
    categoryCounts,
    summary: {
      pagesChecked: pageChecks.length,
      normalPages: pageChecks.filter((page) => page.ok && page.issues.every((item) => !["P0", "P1"].includes(item.severity))).length,
      abnormalPages: pageChecks.filter((page) => !page.ok || page.issues.some((item) => ["P0", "P1"].includes(item.severity))).length,
      frontendErrors: categoryCounts.frontend || 0,
      imageErrors: issues.filter((item) => item.category === "resource" && /image/i.test(item.message)).length,
      apiErrors: categoryCounts.api || 0,
      seoIssues: categoryCounts.seo || 0,
      performanceIssues: categoryCounts.performance || 0,
      dataIssues: categoryCounts.data || 0
    },
    pageChecks,
    apiChecks,
    visual,
    screenshots: visual.screenshots || [],
    issues: issues.sort((a, b) => ["P0", "P1", "P2", "P3"].indexOf(a.severity) - ["P0", "P1", "P2", "P3"].indexOf(b.severity)),
    paths: { json: "", html: "" },
    notification: { email: { sent: false, reason: "not-requested" } }
  };

  report.paths = await saveReports(report, config, runId);

  if (config.sendEmail) {
    const text = makeTextSummary(report);
    const html = makeHtmlReport(report);
    const attachments = [];
    if (report.paths.html) attachments.push({ filename: path.basename(report.paths.html), path: report.paths.html });
    if (report.paths.json) attachments.push({ filename: path.basename(report.paths.json), path: report.paths.json });
    report.notification.email = await sendMonitorEmail({
      recipients: config.emailRecipients,
      subject: `[Cowinmagnet Monitor] ${report.health} - P0 ${counts.P0}, P1 ${counts.P1}, P2 ${counts.P2}`,
      text,
      html,
      attachments
    }).catch((error) => ({ sent: false, reason: error?.message || "email-failed" }));
  }

  if (config.saveReports) {
    report.paths = await saveReports(report, config, runId);
  }

  return report;
}
