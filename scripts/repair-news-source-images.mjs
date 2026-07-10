import fs from "node:fs/promises";
import { getCmsItems, saveCmsItem, updateCmsItemStatus } from "../lib/cmsStore.js";
import { resolveOriginalArticleUrl } from "../lib/news-system/fetcher.mjs";
import { buildImagePlan } from "../lib/news-system/image-handler.mjs";

const args = new Set(process.argv.slice(2));
const argValue = (name, fallback = "") =>
  process.argv.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) || fallback;
const dryRun = args.has("--dry-run");
const onlyOverrides = args.has("--only-overrides");
const envFile = argValue("--env", ".env.production.local");
const overridesFile = argValue("--overrides", "data/newsSourceImageRepairs.json");

async function loadEnvFile(file) {
  const candidates = [file, ".env.vercel.local"].filter(Boolean);
  for (const candidate of candidates) {
    try {
      const content = await fs.readFile(candidate, "utf8");
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z0-9_]+)=(.*)\s*$/);
        if (!match || process.env[match[1]]) continue;
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[match[1]] = value.replace(/\\n/g, "\n");
      }
      return candidate;
    } catch {}
  }
  return "";
}

async function loadOverrides() {
  try {
    const parsed = JSON.parse(await fs.readFile(overridesFile, "utf8"));
    return parsed.repairs || {};
  } catch {
    return {};
  }
}

function processedNewsImageUrl(imageUrl = "", sourcePageUrl = "", width = 980) {
  if (!/^https?:\/\//i.test(String(imageUrl))) return "";
  const query = new URLSearchParams({ src: imageUrl, ref: sourcePageUrl || "", w: String(width) });
  return `/api/news-image?${query.toString()}`;
}

function currentSourceUrl(post) {
  return post.canonicalSourceUrl || post.automation?.originalUrl || post.sourceImage?.sourcePageUrl || post.sources?.[0]?.url || "";
}

function itemFromPost(post, override = {}) {
  const canonicalSourceUrl = override.canonicalSourceUrl || currentSourceUrl(post);
  const imageSourceUrl = override.imageSourceUrl || canonicalSourceUrl;
  return {
    title: post.automation?.originalTitle || post.originalReference?.title || post.title,
    url: imageSourceUrl,
    canonicalSourceUrl,
    sourceName: override.imageSourceName || override.sourceName || post.source || post.sources?.[0]?.name || "Original source",
    imageUrl:
      override.imageUrl ||
      post.sourceImage?.originalImageUrl ||
      post.sourceImage?.imageUrl ||
      (/^https?:\/\//i.test(post.coverImage || "") ? post.coverImage : ""),
    imageAlt: override.imageAlt || "",
    preferProvidedImage: Boolean(override.imageUrl)
  };
}

function emptyImagePatch(post, item, reason) {
  return {
    coverImage: "",
    coverAlt: "",
    imageCaption: "",
    imageSourceName: item.sourceName,
    imageSourceUrl: item.url,
    imageLicenseNote: "",
    bodyImages: [],
    sourceImage: {
      ...(post.sourceImage || {}),
      imageUrl: "",
      originalImageUrl: "",
      localImageUrl: "",
      imageUsageMode: "none",
      imageStatus: "unavailable",
      imageFailureReason: reason,
      sourcePageUrl: item.url,
      sourceName: item.sourceName,
      updatedAt: new Date().toISOString()
    }
  };
}

function sourceImagePatch({ post, plan, item }) {
  if (plan.sourceImage?.imageStatus !== "valid" || !plan.coverImage?.imageUrl) {
    return emptyImagePatch(post, item, plan.sourceImage?.imageFailureReason || "no-valid-source-image");
  }

  const originalImageUrl = plan.sourceImage.originalImageUrl || plan.sourceImage.imageUrl || plan.coverImage.imageUrl;
  const sourceName = plan.sourceImage.sourceName || item.sourceName;
  const sourcePageUrl = plan.sourceImage.sourcePageUrl || item.url;
  return {
    coverImage: processedNewsImageUrl(originalImageUrl, sourcePageUrl),
    coverAlt: item.imageAlt || plan.coverImage.imageAlt || post.coverAlt || post.title,
    imageCaption: plan.coverImage.imageCaption || `Article image. Image source: ${sourceName}.`,
    imageSourceName: sourceName,
    imageSourceUrl: sourcePageUrl,
    imageLicenseNote: `Image source: ${sourceName}.`,
    bodyImages: [],
    sourceImage: {
      ...plan.sourceImage,
      imageUrl: originalImageUrl,
      originalImageUrl,
      localImageUrl: "",
      imageUsageMode: "processed-proxy",
      updatedAt: new Date().toISOString()
    }
  };
}

async function repairPost(post, override = {}) {
  const action = override.action || "repair";
  if (action === "archive") {
    if (!dryRun) await updateCmsItemStatus("news", post.slug, "archived");
    return { slug: post.slug, action, status: dryRun ? "would-archive" : "archived" };
  }

  let item = itemFromPost(post, override);
  if (!override.imageUrl && /news\.google\.com/i.test(item.url)) {
    item = { ...item, ...(await resolveOriginalArticleUrl(item)) };
  }

  let patch;
  if (action === "clear") {
    patch = emptyImagePatch(post, item, override.reason || "source-image-unavailable");
  } else {
    const plan = await buildImagePlan(item, { category: "", recommendedProducts: [] }, post);
    patch = sourceImagePatch({ post, plan, item });
  }

  const next = {
    ...post,
    ...patch,
    canonicalSourceUrl: override.canonicalSourceUrl || item.canonicalSourceUrl || item.url || post.canonicalSourceUrl,
    maintenance: {
      ...(post.maintenance || {}),
      sourceImageRepair: {
        status: patch.coverImage ? "repaired" : "cleared",
        reason: patch.sourceImage?.imageFailureReason || "",
        updatedAt: new Date().toISOString()
      }
    }
  };
  if (!dryRun) await saveCmsItem(next);

  return {
    slug: post.slug,
    action,
    status: dryRun ? (patch.coverImage ? "would-update" : "would-clear") : patch.coverImage ? "updated" : "cleared",
    source: item.sourceName,
    sourceUrl: next.canonicalSourceUrl,
    image: patch.sourceImage?.originalImageUrl || "",
    reason: patch.sourceImage?.imageFailureReason || ""
  };
}

async function repairCmsNews(overrides) {
  const posts = await getCmsItems("news", { includeInactive: true });
  const targets = onlyOverrides
    ? posts.filter((post) => overrides[post.slug])
    : posts.filter((post) => post.status === "published" && (post.automation || post.canonicalSourceUrl || post.sourceImage));
  const results = [];

  for (const post of targets) {
    results.push(await repairPost(post, overrides[post.slug] || {}));
  }

  return { total: posts.length, targetCount: targets.length, results };
}

async function repairGeneratedNewsFiles(overrides) {
  void overrides;
  return [];
}

const loadedEnv = await loadEnvFile(envFile);
const overrides = await loadOverrides();
const cms = await repairCmsNews(overrides);
const generated = await repairGeneratedNewsFiles(overrides);
const summary = cms.results.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({ dryRun, loadedEnv, overridesFile, summary, cms, generated }, null, 2));
