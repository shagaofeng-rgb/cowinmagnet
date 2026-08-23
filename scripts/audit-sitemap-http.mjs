const rootUrl = process.argv.find((arg) => arg.startsWith("--url="))?.slice(6) || "https://www.cowinmagnet.com/sitemap.xml";
const targetOrigin = process.argv.find((arg) => arg.startsWith("--target-origin="))?.slice(16).replace(/\/$/, "") || "";
// Rendered routes can be expensive to resolve locally. Keep this audit deliberately
// conservative so the checker does not overload a development server and report its
// own failures as sitemap defects.
const concurrency = Math.max(1, Math.min(20, Number(process.argv.find((arg) => arg.startsWith("--concurrency="))?.slice(14) || 2)));
const timeoutMs = Math.max(1000, Number(process.argv.find((arg) => arg.startsWith("--timeout="))?.slice(10) || 12000));

function xmlLocations(xml = "") {
  return [...String(xml).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  );
}

function requestUrl(url) {
  if (!targetOrigin) return url;
  const parsed = new URL(url);
  return new URL(`${parsed.pathname}${parsed.search}`, targetOrigin).toString();
}

async function fetchXml(url) {
  const response = await fetch(requestUrl(url), {
    headers: { Accept: "application/xml,text/xml;q=0.9,*/*;q=0.1", "User-Agent": "Cowinmagnet-Sitemap-Audit/1.0" },
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!response.ok) throw new Error(`Sitemap fetch failed: ${response.status} ${url}`);
  return response.text();
}

async function collectUrls(url) {
  const xml = await fetchXml(url);
  if (!/<sitemapindex\b/i.test(xml)) return xmlLocations(xml);
  const childFiles = xmlLocations(xml);
  const children = await Promise.all(childFiles.map((childUrl) => fetchXml(childUrl)));
  return children.flatMap(xmlLocations);
}

async function inspectUrl(url) {
  const targetUrl = requestUrl(url);
  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      redirect: "manual",
      headers: { Range: "bytes=0-0", "User-Agent": "Cowinmagnet-Sitemap-Audit/1.0" },
      signal: AbortSignal.timeout(timeoutMs)
    });
    return {
      url,
      requestUrl: targetUrl,
      status: response.status,
      location: response.headers.get("location") || ""
    };
  } catch (error) {
    return { url, requestUrl: targetUrl, status: 0, error: String(error?.name || error?.message || "request-failed") };
  }
}

const urls = [...new Set(await collectUrls(rootUrl))];
const queue = [...urls];
const results = [];

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    if (url) results.push(await inspectUrl(url));
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
const issues = results.filter((result) => result.status !== 200);
const statusCounts = results.reduce((counts, result) => {
  const key = String(result.status || "error");
  counts[key] = (counts[key] || 0) + 1;
  return counts;
}, {});

process.stdout.write(
  `${JSON.stringify({ rootUrl, targetOrigin: targetOrigin || null, total: urls.length, statusCounts, issueCount: issues.length, issues: issues.slice(0, 200) }, null, 2)}\n`
);
if (issues.length) process.exitCode = 1;
