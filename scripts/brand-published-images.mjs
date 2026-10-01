import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const logoPath = path.join(publicRoot, "images/cowin-logo.png");
const suffix = "-cowin-brand-20261001";
const previewPath = process.argv.find((arg) => arg.startsWith("--preview="))?.slice(10);
const apply = process.argv.includes("--apply");
const manifestPath = path.join(root, "docs/audits/2026-10-01-branded-image-manifest.json");

async function filesUnder(directory) {
  const results = [];
  const queue = [path.join(root, directory)];
  while (queue.length) {
    const current = queue.pop();
    for (const entry of await fs.readdir(current, { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) queue.push(next);
      else if (/\.(?:tsx?|jsx?|css|json)$/.test(entry.name)) results.push(next);
    }
  }
  return results;
}

const codeFiles = [
  ...(await filesUnder("app")),
  ...(await filesUnder("components")),
  path.join(root, "data/products.ts"),
  path.join(root, "data/productCatalog.js"),
  path.join(root, "data/applications.ts"),
  path.join(root, "data/blogs.ts"),
  path.join(root, "data/contentHub.js"),
  path.join(root, "data/i18n.js"),
  path.join(root, "lib/productCms.js"),
  path.join(root, "lib/news/product-media-resolver.js"),
  ...(await filesUnder("data/news-generated"))
];

const productSource = await fs.readFile(path.join(root, "data/products.ts"), "utf8");
const applicationSource = await fs.readFile(path.join(root, "data/applications.ts"), "utf8");
const primaryProducts = [...productSource.matchAll(/"image": "(\/assets\/products\/[^\"]+)"/g)].map((match) => match[1]);
const engineeringDiagrams = [...productSource.matchAll(/"src": "(\/assets\/products\/[^\"]+)"/g)]
  .map((match) => match[1].replace(suffix, ""));
const engineeringDiagramSet = new Set(engineeringDiagrams);
const industryImages = [...applicationSource.matchAll(/"(\/images\/industries\/[^\"]+\.(?:jpg|jpeg|png|webp|avif))"/g)].map((match) => match[1]);
const explicitImages = [];
for (const file of codeFiles.filter((file) => file.includes("/app/") || file.includes("/components/") || /(?:data\/(?:blogs\.ts|contentHub\.js|i18n\.js)|lib\/(?:productCms\.js|news\/product-media-resolver\.js)|data\/news-generated\/)/.test(file))) {
  const source = await fs.readFile(file, "utf8");
  explicitImages.push(...[...source.matchAll(/\/(?:images|assets)\/[^"'\s)>,]+\.(?:png|jpe?g|webp|avif|gif)/g)].map((match) => match[0]));
}

const isContentImage = (url) =>
  !/(?:\/icons\/|cowin-logo|\/qr-|\/logo\.|favicon|apple-touch|\.svg$)/i.test(url) &&
  !url.includes(suffix) &&
  !url.startsWith("/images/source-products/");
let previousEntries = [];
try {
  previousEntries = JSON.parse(await fs.readFile(manifestPath, "utf8")).entries || [];
} catch {}
const imageUrls = [...new Set([...previousEntries.map((entry) => entry.source), ...primaryProducts, ...engineeringDiagrams, ...industryImages, ...explicitImages])]
  .filter(isContentImage)
  .sort();
const existingUrls = [];
for (const url of imageUrls) {
  try {
    await fs.access(path.join(publicRoot, url.slice(1)));
    existingUrls.push(url);
  } catch {}
}

const logo = await sharp(logoPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: logoWidth, height: logoHeight, channels } = logo.info;
let left = logoWidth, top = logoHeight, right = 0, bottom = 0;
for (let y = 0; y < logoHeight; y++) {
  for (let x = 0; x < logoWidth; x++) {
    if (logo.data[(y * logoWidth + x) * channels + 3] < 12) continue;
    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }
}
if (left > right || top > bottom) throw new Error("Official logo has no visible pixels");
const trimmedLogo = await sharp(logoPath).extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).png().toBuffer();

async function chooseCorner(input, width, height, badge, margin, preferred) {
  const points = {
    topLeft: { left: margin, top: margin },
    topRight: { left: width - badge - margin, top: margin },
    bottomLeft: { left: margin, top: height - badge - margin },
    bottomRight: { left: width - badge - margin, top: height - badge - margin }
  };
  const candidates = await Promise.all(Object.entries(points).map(async ([name, point]) => {
    const sample = await sharp(input).extract({ ...point, width: badge, height: badge }).resize(24, 24).greyscale().raw().toBuffer();
    const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
    const variance = sample.reduce((sum, value) => sum + (value - mean) ** 2, 0) / sample.length;
    const preferencePenalty = name === preferred ? 0 : 100;
    return { name, point, score: variance + preferencePenalty };
  }));
  return candidates.sort((a, b) => a.score - b.score)[0];
}

async function renderBrandedImage(url, destination, { mobileHero = false } = {}) {
  const source = path.join(publicRoot, url.slice(1));
  const normalized = await sharp(source, { animated: false }).rotate().toBuffer();
  const metadata = await sharp(normalized).metadata();
  const width = metadata.width;
  const height = metadata.height;
  if (!width || !height || width < 120 || height < 100) throw new Error(`Content image is too small to mark: ${url}`);
  const short = Math.min(width, height);
  const homeHero = url.includes("home-hero");
  const engineeringDiagram = engineeringDiagramSet.has(url);
  const badge = engineeringDiagram ? 26 : Math.max(26, Math.min(mobileHero ? 60 : homeHero ? 80 : 120, Math.round(short * 0.17)));
  const margin = Math.max(5, Math.min(30, Math.round(short * 0.035)));
  const preferred = url.includes("/assets/products/") ? "topRight" : "bottomRight";
  // The home background is center-cropped on phones and carries headline text on the left.
  const corner = engineeringDiagram
    ? { name: "separateWhiteFooter", point: { left: width - badge - 6, top: height + 5 } }
    : homeHero
    ? mobileHero
      ? { name: "mobileTopRightSafeArea", point: { left: Math.round(width * 0.64), top: margin } }
      : { name: "desktopTopRightSafeArea", point: { left: Math.round(width * 0.85), top: Math.round(height * 0.16) } }
    : await chooseCorner(normalized, width, height, badge, margin, preferred);
  const logoSize = Math.round(badge * 0.76);
  const inset = Math.floor((badge - logoSize) / 2);
  const plate = Buffer.from(`<svg width="${badge}" height="${badge}" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="${badge - 1}" height="${badge - 1}" rx="${Math.max(5, Math.round(badge * 0.16))}" fill="white" fill-opacity="0.88" stroke="#0c2745" stroke-opacity="0.2"/></svg>`);
  const icon = await sharp(trimmedLogo).resize(logoSize, logoSize, { fit: "contain", background: "#00000000" }).png().toBuffer();
  const overlay = await sharp({ create: { width: badge, height: badge, channels: 4, background: "#00000000" } })
    .composite([{ input: plate, left: 0, top: 0 }, { input: icon, left: inset, top: inset }])
    .png().toBuffer();
  // Technical dimensions and installation lines must remain completely untouched.
  // Add a short white strip below the drawing instead of painting over any label.
  const outputHeight = engineeringDiagram ? height + 36 : height;
  const pipeline = engineeringDiagram
    ? sharp({ create: { width, height: outputHeight, channels: 4, background: "#ffffff" } })
      .composite([{ input: normalized, left: 0, top: 0 }, { input: overlay, ...corner.point }])
    : sharp(normalized).composite([{ input: overlay, ...corner.point }]);
  const extension = path.extname(destination).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") pipeline.jpeg({ quality: 88, mozjpeg: true });
  else if (extension === ".webp") pipeline.webp({ quality: 88, effort: 5 });
  else if (extension === ".avif") pipeline.avif({ quality: 58, effort: 4 });
  else if (extension === ".gif") pipeline.gif();
  else pipeline.png({ compressionLevel: 9 });
  await pipeline.toFile(destination);
  const output = await fs.readFile(destination);
  return {
    source: url,
    branded: `/${path.relative(publicRoot, destination).replaceAll(path.sep, "/")}`,
    width,
    height: outputHeight,
    ...(engineeringDiagram ? { sourceHeight: height } : {}),
    logoCorner: corner.name,
    sha256: crypto.createHash("sha256").update(output).digest("hex")
  };
}

if (previewPath) {
  const url = previewPath.startsWith("/") ? previewPath : `/${previewPath}`;
  if (!existingUrls.includes(url)) throw new Error(`Preview image is not in the published image inventory: ${url}`);
  const destination = path.join("/tmp", `cowin-logo-preview-${path.basename(url)}`);
  console.log(JSON.stringify(await renderBrandedImage(url, destination), null, 2));
  process.exit(0);
}

if (!apply) {
  console.log(JSON.stringify({ count: existingUrls.length, paths: existingUrls }, null, 2));
  process.exit(0);
}

const manifest = [];
for (const url of existingUrls) {
  const extension = path.extname(url);
  const baseName = url.slice(0, -extension.length);
  const brandedUrl = baseName + (url.includes("home-hero") ? "-v2" : "") + suffix + extension;
  const destination = path.join(publicRoot, brandedUrl.slice(1));
  manifest.push(await renderBrandedImage(url, destination));
  if (url.includes("home-hero")) {
    const mobileUrl = baseName + "-mobile-v2" + suffix + extension;
    manifest.push(await renderBrandedImage(url, path.join(publicRoot, mobileUrl.slice(1)), { mobileHero: true }));
  }
}
for (const file of codeFiles) {
  const before = await fs.readFile(file, "utf8");
  let after = before;
  for (const entry of manifest) after = after.replaceAll(entry.source, entry.branded);
  if (before !== after) await fs.writeFile(file, after);
}
await fs.writeFile(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), logo: "/images/cowin-logo.png", entries: manifest }, null, 2)}\n`);
console.log(JSON.stringify({ count: manifest.length, manifest: manifestPath }));
