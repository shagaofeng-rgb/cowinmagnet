import fs from "node:fs/promises";
import path from "node:path";
import { getCmsItems, saveCmsItem } from "../lib/cmsStore.js";
import { buildImagePlan } from "../lib/news-system/image-handler.mjs";

function loadEnvFile(file = ".env.vercel.local") {
  return fs
    .readFile(file, "utf8")
    .then((content) => {
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z0-9_]+)=(.*)\s*$/);
        if (!match || process.env[match[1]]) continue;
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[match[1]] = value.replace(/\\n/g, "\n");
      }
    })
    .catch(() => {});
}

function processedNewsImageUrl(imageUrl = "", sourcePageUrl = "", width = 980) {
  if (!/^https?:\/\//i.test(String(imageUrl))) return "";
  const query = new URLSearchParams({ src: imageUrl, ref: sourcePageUrl || "", w: String(width) });
  return `/api/news-image?${query.toString()}`;
}

function itemFromPost(post) {
  return {
    title: post.automation?.originalTitle || post.originalReference?.title || post.title,
    url: post.canonicalSourceUrl || post.automation?.originalUrl || post.sourceImage?.sourcePageUrl || post.sources?.[0]?.url || "",
    sourceName: post.source || post.sources?.[0]?.name || post.sourceImage?.sourceName || "Original source",
    imageUrl:
      post.sourceImage?.originalImageUrl ||
      post.sourceImage?.imageUrl ||
      (/^https?:\/\//i.test(post.coverImage || "") ? post.coverImage : "")
  };
}

function sourceImagePatch({ post, plan, item }) {
  if (plan.sourceImage?.imageStatus !== "valid" || !plan.coverImage?.imageUrl) {
    return {
      coverImage: "",
      coverAlt: "",
      imageCaption: "",
      imageSourceName: "",
      imageSourceUrl: item.url,
      imageLicenseNote: "",
      bodyImages: [],
      sourceImage: {
        ...(post.sourceImage || {}),
        ...(plan.sourceImage || {}),
        imageUrl: "",
        localImageUrl: "",
        imageUsageMode: "none",
        imageStatus: plan.sourceImage?.imageStatus || "failed",
        imageFailureReason: plan.sourceImage?.imageFailureReason || "no-valid-source-image",
        sourcePageUrl: item.url,
        sourceName: item.sourceName,
        updatedAt: new Date().toISOString()
      }
    };
  }

  const originalImageUrl = plan.sourceImage.originalImageUrl || plan.sourceImage.imageUrl || plan.coverImage.imageUrl;
  return {
    coverImage: processedNewsImageUrl(originalImageUrl, plan.sourceImage.sourcePageUrl || item.url),
    coverAlt: plan.coverImage.imageAlt || post.coverAlt || post.title,
    imageCaption: plan.coverImage.imageCaption || `Article image. Image source: ${item.sourceName}.`,
    imageSourceName: plan.sourceImage.sourceName || item.sourceName,
    imageSourceUrl: plan.sourceImage.sourcePageUrl || item.url,
    imageLicenseNote: `Image source: ${plan.sourceImage.sourceName || item.sourceName}.`,
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

async function repairCmsNews() {
  const posts = await getCmsItems("news", { includeInactive: true });
  const targets = posts.filter((post) => post.status === "published" && (post.automation || post.canonicalSourceUrl || post.sourceImage));
  const results = [];

  for (const post of targets) {
    const item = itemFromPost(post);
    if (!item.url) {
      results.push({ slug: post.slug, status: "skipped", reason: "missing-source-url" });
      continue;
    }
    const plan = await buildImagePlan(item, { category: "", recommendedProducts: [] }, post);
    const patch = sourceImagePatch({ post, plan, item });
    await saveCmsItem({ ...post, ...patch });
    results.push({
      slug: post.slug,
      status: patch.coverImage ? "updated" : "cleared",
      source: item.sourceName,
      image: patch.sourceImage?.originalImageUrl || "",
      reason: patch.sourceImage?.imageFailureReason || ""
    });
  }

  return results;
}

async function repairGeneratedNewsFiles() {
  const dir = path.join(process.cwd(), "data", "news-generated");
  const files = await fs.readdir(dir).catch(() => []);
  const results = [];

  for (const file of files.filter((entry) => entry.endsWith(".json"))) {
    const fullPath = path.join(dir, file);
    const post = JSON.parse(await fs.readFile(fullPath, "utf8"));
    if (post.status !== "published") continue;

    const item = itemFromPost(post);
    if (!item.url) {
      results.push({ slug: post.slug, status: "skipped", reason: "missing-source-url" });
      continue;
    }
    const plan = await buildImagePlan(item, { category: "", recommendedProducts: [] }, post);
    const patch = sourceImagePatch({ post, plan, item });
    await fs.writeFile(fullPath, JSON.stringify({ ...post, ...patch }, null, 2), "utf8");
    results.push({
      slug: post.slug,
      status: patch.coverImage ? "updated" : "cleared",
      source: item.sourceName,
      image: patch.sourceImage?.originalImageUrl || "",
      reason: patch.sourceImage?.imageFailureReason || ""
    });
  }

  return results;
}

await loadEnvFile();
const cms = await repairCmsNews();
const generated = await repairGeneratedNewsFiles();

console.log(JSON.stringify({ cms, generated }, null, 2));
