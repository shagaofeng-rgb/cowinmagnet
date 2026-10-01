import fs from "node:fs/promises";

const baseUrl = (process.argv.find((arg) => arg.startsWith("--base="))?.slice(7) || "http://localhost:3010").replace(/\/$/, "");
const productsSource = await fs.readFile("data/products.ts", "utf8");
const slugs = [...productsSource.matchAll(/"slug": "([^"]+)"/g)].map((match) => match[1]);
const pages = [
  "/en",
  "/en/products",
  "/en/industries",
  "/en/industries/recycling",
  "/en/industries/mining",
  "/en/industries/cement-aggregate",
  "/en/industries/food",
  "/en/applications",
  "/en/about",
  "/en/contact",
  "/en/factory",
  "/en/blog",
  "/en/news",
  ...slugs.map((slug) => `/en/products/${slug}`)
];

function extractImages(html, page) {
  const localUnbranded = [];
  const remote = [];
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const src = match[0].match(/\bsrc="([^"]+)"/i)?.[1]?.replaceAll("&amp;", "&");
    if (!src) continue;
    try {
      const image = new URL(src, `${baseUrl}${page}`);
      const original = image.pathname === "/_next/image" ? new URL(image.searchParams.get("url") || "/", baseUrl) : image;
      if (original.origin !== new URL(baseUrl).origin) {
        if (!/facebook\.com\/tr/.test(original.href)) remote.push(original.href);
        continue;
      }
      const pathname = original.pathname;
      if (!/^\/(?:images|assets)\//.test(pathname)) continue;
      if (/(?:cowin-logo|\/icons\/|\/qr-|\/logo\.|favicon|apple-touch)/i.test(pathname)) continue;
      if (!pathname.includes("-cowin-brand-20261001")) localUnbranded.push(pathname);
    } catch {}
  }
  return { localUnbranded: [...new Set(localUnbranded)], remote: [...new Set(remote)] };
}

const results = [];
const concurrency = 8;
let nextIndex = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (nextIndex < pages.length) {
    const page = pages[nextIndex++];
    try {
      const response = await fetch(`${baseUrl}${page}`);
      const html = await response.text();
      results.push({ page, status: response.status, ...extractImages(html, page) });
    } catch (error) {
      results.push({ page, status: 0, error: String(error), localUnbranded: [], remote: [] });
    }
  }
}));
results.sort((a, b) => a.page.localeCompare(b.page));
const failures = results.filter((item) => item.status !== 200 || item.localUnbranded.length);
const external = results.filter((item) => item.remote.length);
console.log(JSON.stringify({ pages: results.length, failed: failures, externalImages: external }, null, 2));
if (failures.length) process.exitCode = 1;
