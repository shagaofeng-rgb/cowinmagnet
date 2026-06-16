import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { newsSystemConfig } from "../../config/news-system.config.mjs";

const FETCH_TIMEOUT_MS = Number(process.env.NEWS_IMAGE_FETCH_TIMEOUT_MS || process.env.NEWS_FETCH_TIMEOUT_MS || 15000);
const MAX_IMAGE_BYTES = Number(process.env.NEWS_MAX_IMAGE_SIZE_BYTES || 8 * 1024 * 1024);
const MIN_WIDTH = Number(process.env.NEWS_MIN_IMAGE_WIDTH || 120);
const MIN_HEIGHT = Number(process.env.NEWS_MIN_IMAGE_HEIGHT || 80);
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const BAD_IMAGE_TERMS = ["favicon", "sprite", "pixel", "tracking", "placeholder", "spacer"];

function nowIso() {
  return new Date().toISOString();
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value = "") {
  return decodeHtml(String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function isSafeHttpUrl(value = "") {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return false;
    const host = url.hostname.toLowerCase();
    if (process.env.NEWS_IMAGE_ALLOW_LOCAL_TESTS === "1" && process.env.NODE_ENV !== "production") return true;
    if (host === "localhost" || host.endsWith(".localhost")) return false;
    if (/^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host)) return false;
    if (host === "::1" || host.startsWith("fc") || host.startsWith("fd")) return false;
    if (host === "metadata.google.internal") return false;
    return true;
  } catch {
    return false;
  }
}

function absolutizeUrl(value = "", base = "") {
  try {
    return new URL(decodeHtml(value), base).toString();
  } catch {
    return "";
  }
}

function metaContent(html = "", key = "") {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escaped}["'][^>]*>`, "i")
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return "";
}

function firstJsonLdImages(html = "") {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const images = [];

  function collect(value) {
    if (!value) return;
    if (typeof value === "string") images.push(value);
    else if (Array.isArray(value)) value.forEach(collect);
    else if (typeof value === "object") {
      if (value.url) images.push(value.url);
      if (value.contentUrl) images.push(value.contentUrl);
      if (value.image) collect(value.image);
      if (value["@graph"]) collect(value["@graph"]);
    }
  }

  for (const block of blocks) {
    try {
      collect(JSON.parse(stripTags(block[1])));
    } catch {}
  }

  return images;
}

function bodyImageCandidates(html = "") {
  const articleMatch = html.match(/<article[\s\S]*?<\/article>/i);
  const source = articleMatch?.[0] || html;
  const images = [];
  const imgRegex = /<img\b[^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(source))) {
    const tag = match[0];
    const src =
      tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ||
      tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ||
      tag.match(/\bdata-lazy-src=["']([^"']+)["']/i)?.[1] ||
      "";
    const srcset = tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1] || "";
    const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || "";
    const candidate = largestSrcsetUrl(srcset) || src;
    if (candidate) images.push({ url: candidate, alt });
  }
  return images;
}

function largestSrcsetUrl(srcset = "") {
  const entries = String(srcset)
    .split(",")
    .map((entry) => entry.trim())
    .map((entry) => {
      const [url, size = ""] = entry.split(/\s+/);
      const width = Number(size.replace(/\D/g, "")) || 0;
      return { url, width };
    })
    .filter((entry) => entry.url);
  return entries.sort((a, b) => b.width - a.width)[0]?.url || "";
}

function looksLikeBadImage(url = "") {
  const lower = String(url).toLowerCase();
  if (/\.svg($|\?)/i.test(lower)) return true;
  return BAD_IMAGE_TERMS.some((term) => lower.includes(term));
}

function imageHash(url = "") {
  return crypto.createHash("sha256").update(String(url)).digest("hex");
}

async function fetchHtml(url) {
  if (!isSafeHttpUrl(url)) return { html: "", error: "unsafe-source-url" };
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) return { html: "", error: `source-http-${response.status}` };
    if (!isSafeHttpUrl(response.url)) return { html: "", error: "unsafe-source-redirect" };
    const type = response.headers.get("content-type") || "";
    if (!/text\/html|application\/xhtml/i.test(type)) return { html: "", error: "source-not-html" };
    const html = await response.text();
    return { html: html.slice(0, Number(process.env.NEWS_MAX_SOURCE_SIZE_BYTES || 1024 * 1024)), error: "" };
  } catch (error) {
    return { html: "", error: error?.name === "TimeoutError" ? "source-timeout" : "source-fetch-failed" };
  }
}

async function readLimitedBytes(response) {
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength && contentLength > MAX_IMAGE_BYTES) {
    throw new Error("image-too-large");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_IMAGE_BYTES) throw new Error("image-too-large");
    return buffer;
  }

  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_IMAGE_BYTES) throw new Error("image-too-large");
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

function parseDimensions(buffer, mimeType = "") {
  if (buffer.length < 24) return { width: 0, height: 0 };
  if (mimeType === "image/png" || buffer.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (mimeType === "image/gif" || buffer.slice(0, 3).toString("ascii") === "GIF") {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }
  if (mimeType === "image/jpeg" || buffer[0] === 0xff) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      offset += 2 + length;
    }
  }
  if (mimeType === "image/webp" || buffer.slice(0, 4).toString("ascii") === "RIFF") {
    const chunk = buffer.slice(12, 16).toString("ascii");
    if (chunk === "VP8X" && buffer.length >= 30) {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3)
      };
    }
    if (chunk === "VP8 " && buffer.length >= 30) {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff
      };
    }
    if (chunk === "VP8L" && buffer.length >= 25) {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
  }
  return { width: 0, height: 0 };
}

function isLikelyTransparentPlaceholder(buffer, mimeType, width, height) {
  return buffer.length < 512 || width <= 16 || height <= 16 || (mimeType === "image/png" && width <= 32 && height <= 32);
}

async function validateImage(candidate, sourcePageUrl) {
  const imageUrl = absolutizeUrl(candidate.url, sourcePageUrl);
  if (!imageUrl) return { ok: false, reason: "empty-image-url" };
  if (!isSafeHttpUrl(imageUrl)) return { ok: false, reason: "unsafe-image-url", imageUrl };
  if (looksLikeBadImage(imageUrl)) return { ok: false, reason: "logo-ad-or-svg", imageUrl };

  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif,image/*,*/*;q=0.8",
        Referer: sourcePageUrl,
        "Accept-Language": "en-US,en;q=0.9"
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });
    if (!response.ok) return { ok: false, reason: `image-http-${response.status}`, imageUrl };
    if (!isSafeHttpUrl(response.url)) return { ok: false, reason: "unsafe-image-redirect", imageUrl };
    const mimeType = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) return { ok: false, reason: "unsupported-image-mime", imageUrl, mimeType };
    const bytes = await readLimitedBytes(response);
    const dimensions = parseDimensions(bytes, mimeType);
    if (dimensions.width && dimensions.height && (dimensions.width < MIN_WIDTH || dimensions.height < MIN_HEIGHT)) {
      return { ok: false, reason: "image-too-small", imageUrl, mimeType, imageFileSize: bytes.length, ...dimensions };
    }
    if (dimensions.width && dimensions.height && isLikelyTransparentPlaceholder(bytes, mimeType, dimensions.width, dimensions.height)) {
      return { ok: false, reason: "placeholder-or-pixel", imageUrl, mimeType, imageFileSize: bytes.length, ...dimensions };
    }
    return {
      ok: true,
      imageUrl: response.url || imageUrl,
      originalImageUrl: imageUrl,
      imageMimeType: mimeType,
      imageFileSize: bytes.length,
      bytes,
      ...dimensions
    };
  } catch (error) {
    return { ok: false, reason: error?.message || "image-fetch-failed", imageUrl };
  }
}

function buildAlt({ item, article, candidate }) {
  const title = item?.title || article?.originalReference?.title || article?.title || "industry news";
  const sourceName = item?.sourceName || article?.sources?.[0]?.name || "source";
  const candidateAlt = stripTags(candidate.alt || "");
  const base = candidateAlt && candidateAlt.length > 20 ? candidateAlt : title;
  return `${base} - source image from ${sourceName}`.slice(0, 180);
}

function maybeCaption({ item, candidate }) {
  const sourceName = item?.sourceName || "Original source";
  const text = stripTags(candidate.alt || candidate.caption || "");
  return text && text.length > 12 && text.length < 180
    ? `${text}. Image source: ${sourceName}.`
    : `Article image. Image source: ${sourceName}.`;
}

async function saveLocalImage(valid, slug) {
  if (process.env.VERCEL || process.env.NEWS_IMAGE_USAGE_MODE !== "local") return { localImageUrl: "", usageMode: "remote" };
  const extension = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/gif": ".gif"
  }[valid.imageMimeType] || ".jpg";
  const fileName = `${slug || "news"}-${imageHash(valid.originalImageUrl).slice(0, 12)}${extension}`;
  const publicDir = path.join(process.cwd(), "public", "images", "news-source");
  await fs.mkdir(publicDir, { recursive: true });
  const target = path.join(publicDir, fileName);
  await fs.writeFile(target, valid.bytes);
  return { localImageUrl: `/images/news-source/${fileName}`, usageMode: "local" };
}

function buildNoImagePlan(error, failures = [], { sourcePageUrl = "", sourceName = "" } = {}) {
  return {
    topic: "source-image",
    coverImage: null,
    bodyImages: [],
    libraryMatchCount: 0,
    sourceImage: {
      imageUrl: "",
      originalImageUrl: "",
      localImageUrl: "",
      sourcePageUrl,
      sourceName,
      imageAlt: "",
      imageCaption: "",
      imageWidth: 0,
      imageHeight: 0,
      imageMimeType: "",
      imageFileSize: 0,
      imageUsageMode: "none",
      imageStatus: error ? "failed" : "pending",
      imageFailureReason: error || "",
      imageCandidateFailures: failures,
      fetchedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso()
    },
    copyrightNote: "No valid source image was found. The article can publish without a news image."
  };
}

export async function buildImagePlan(item, productMatch, article = null) {
  const sourcePageUrl = item?.url || article?.canonicalSourceUrl || "";
  const sourceName = item?.sourceName || article?.sources?.[0]?.name || "Original news source";
  if (!sourcePageUrl) return buildNoImagePlan("missing-source-page");

  const { html, error } = await fetchHtml(sourcePageUrl);
  if (!html && !item?.imageUrl) return buildNoImagePlan(error || "source-html-empty", [], { sourcePageUrl, sourceName });

  const candidates = [
    { url: html ? metaContent(html, "og:image:secure_url") || metaContent(html, "og:image") : "", kind: "og:image" },
    { url: html ? metaContent(html, "twitter:image") || metaContent(html, "twitter:image:src") : "", kind: "twitter:image" },
    ...(html ? firstJsonLdImages(html).map((url) => ({ url, kind: "json-ld:image" })) : []),
    ...(html ? bodyImageCandidates(html).map((entry) => ({ url: entry.url, alt: entry.alt, kind: "body:first-image" })) : []),
    { url: item?.imageUrl || "", kind: "source-thumbnail", alt: item?.title || "" }
  ].filter((candidate) => candidate.url);

  const uniqueCandidates = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const absolute = absolutizeUrl(candidate.url, sourcePageUrl);
    if (!absolute || seen.has(absolute)) continue;
    seen.add(absolute);
    uniqueCandidates.push({ ...candidate, url: absolute });
  }

  const failures = [];
  for (const candidate of uniqueCandidates) {
    const valid = await validateImage(candidate, sourcePageUrl);
    if (!valid.ok) {
      failures.push({ imageUrl: valid.imageUrl || candidate.url, kind: candidate.kind, reason: valid.reason });
      continue;
    }

    const local = await saveLocalImage(valid, article?.slug || item?.slug || "news");
    const imageUrl = local.localImageUrl || valid.imageUrl;
    const imageRecord = {
      imageUrl,
      originalImageUrl: valid.originalImageUrl,
      localImageUrl: local.localImageUrl,
      sourcePageUrl,
      sourceName,
      imageAlt: buildAlt({ item, article, candidate }),
      imageCaption: maybeCaption({ item, candidate }),
      imageWidth: valid.width,
      imageHeight: valid.height,
      imageMimeType: valid.imageMimeType,
      imageFileSize: valid.imageFileSize,
      imageUsageMode: local.usageMode,
      imageStatus: "valid",
      imageKind: candidate.kind,
      imageHash: imageHash(valid.originalImageUrl),
      fetchedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
      geoImageContext: {
        event: item?.title || article?.title || "",
        source: sourceName,
        description: maybeCaption({ item, candidate }),
        subject: item?.title || "",
        imageType: candidate.kind.includes("json") ? "Article image" : "Source image",
        fetchedAt: nowIso()
      }
    };

    return {
      topic: "source-image",
      coverImage: {
        ...imageRecord,
        imageType: "cover",
        displayOrder: 0,
        relatedSection: "Cover",
        sourceStrategy: "source-article-image",
        visualStyle: "source image"
      },
      bodyImages: [],
      libraryMatchCount: 0,
      sourceImage: imageRecord,
      copyrightNote: "Source article image is referenced with visible attribution. No AI or unrelated gallery image was used."
    };
  }

  return buildNoImagePlan(error || "no-valid-source-image", failures, { sourcePageUrl, sourceName });
}
