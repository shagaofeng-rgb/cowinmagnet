import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_ORIGIN = "http://www.xintuocidian.com";
const BACKUP_DIR = path.join(process.cwd(), ".backups", "xintuo-product-sync-20260822");
const REPORT_DIR = path.join(process.cwd(), "reports", "xintuo-product-sync");
const DOWNLOAD_MEDIA = process.argv.includes("--download-media");
const SHOW_RECORD = process.argv.find((argument) => argument.startsWith("--show="))?.split("=")[1];
const PRODUCT_URL_PATTERN = /<loc>(https?:\/\/www\.xintuocidian\.com\/[^<]*\/product_\d+\.html)<\/loc>/gi;

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function htmlDecode(value = "") {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function textFromHtml(value = "") {
  return htmlDecode(value)
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\t\r ]+/g, " ")
    .replace(/\n\s*/g, "\n")
    .trim();
}

function absoluteUrl(value) {
  try {
    return new URL(value, SOURCE_ORIGIN).toString();
  } catch {
    return null;
  }
}

function sourcePath(value) {
  return new URL(value).pathname;
}

function extractProductTitle(html) {
  const inline = html.match(/font-size:\s*18px[^>]*>\s*([\s\S]*?)<\/span>/i)?.[1];
  const documentTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return textFromHtml(inline || documentTitle || "").split(/\s+-\s+/)[0].trim();
}

function extractContentBlock(html, heading) {
  const blocks = [...html.matchAll(/<div\s+class=["']prointr["'][^>]*>([\s\S]*?)<\/div>\s*(?=<div\s+class=["']prointr|<\/div>\s*<div|<div\s+class=["']xgprlist)/gi)];
  return blocks.find((match) => textFromHtml(match[1]).includes(heading))?.[1] || "";
}

function extractImageSources(html) {
  return [...html.matchAll(/<img\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => absoluteUrl(match[1]))
    .filter(Boolean)
    .filter((url) => /\/upload\//i.test(url));
}

function tableRows(tableHtml) {
  const activeCells = [];
  const output = [];
  for (const rowMatch of tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const row = [];
    let column = 0;
    const writeActive = () => {
      while (activeCells[column]) {
        row[column] = activeCells[column].value;
        activeCells[column].remaining -= 1;
        if (activeCells[column].remaining <= 0) activeCells[column] = undefined;
        column += 1;
      }
    };
    writeActive();
    for (const cellMatch of rowMatch[1].matchAll(/<t[dh]\b([^>]*)>([\s\S]*?)<\/t[dh]>/gi)) {
      writeActive();
      const attributes = cellMatch[1];
      const value = textFromHtml(cellMatch[2]);
      const rowspan = Number(attributes.match(/rowspan=["']?(\d+)/i)?.[1] || 1);
      const colspan = Number(attributes.match(/colspan=["']?(\d+)/i)?.[1] || 1);
      for (let index = 0; index < colspan; index += 1) {
        row[column + index] = value;
        if (rowspan > 1) activeCells[column + index] = { value, remaining: rowspan - 1 };
      }
      column += colspan;
    }
    if (row.some(Boolean)) output.push(row.filter((cell) => cell !== undefined));
  }
  return output;
}

function extractTechnicalTable(block) {
  const table = block.match(/<table\b[^>]*>([\s\S]*?)<\/table>/i)?.[0];
  if (!table) return { columns: [], rows: [] };
  const parsed = tableRows(table);
  if (parsed.length < 3) return { columns: [], rows: [] };
  const [firstHeader, secondHeader, ...rows] = parsed;
  const columns = firstHeader.map((cell, index) => {
    const childHeader = secondHeader[index];
    return [cell, childHeader].filter((item, itemIndex, items) => item && items.indexOf(item) === itemIndex).join(" / ").trim();
  });
  const normalizedRows = rows.filter((row) => row.some(Boolean)).map((row) => columns.map((_, index) => row[index] || ""));
  return { columns, rows: normalizedRows };
}

function modelCode(title) {
  return title.match(/[A-Z]{2,}[A-Z0-9()\-]*/)?.[0] || null;
}

function normalizeModel(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function currentProducts(source) {
  return [...source.matchAll(/"slug":\s*"([^"]+)"[\s\S]{0,700}?"name":\s*"([^"]+)"/g)]
    .map((match) => ({ slug: match[1], name: match[2] }));
}

function mapProduct(title, productIndex) {
  const code = modelCode(title);
  if (!code) return { status: "needs_review", modelCode: null, targetSlug: null, candidates: [] };
  const normalizedCode = normalizeModel(code);
  if (normalizedCode.length < 4) {
    return { status: "needs_review", modelCode: code, targetSlug: null, candidates: [] };
  }
  const candidates = productIndex.filter((product) => product.slug
    .split("-")
    .some((segment) => segment === normalizedCode || normalizedCode.startsWith(segment)));
  if (candidates.length === 1) return { status: "matched", modelCode: code, targetSlug: candidates[0].slug, candidates };
  return { status: candidates.length ? "ambiguous" : "unmatched", modelCode: code, targetSlug: null, candidates };
}

function csvValue(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "User-Agent": "COWIN-MAGNET-product-migration/1.0 (owned-site-content-sync)" } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

async function downloadMedia(record) {
  const mediaDir = path.join(BACKUP_DIR, "media", record.sourceId);
  await mkdir(mediaDir, { recursive: true });
  const assets = [];
  for (const sourceUrl of record.mediaUrls) {
    await wait(220);
    const response = await fetch(sourceUrl, { headers: { "User-Agent": "COWIN-MAGNET-product-migration/1.0 (owned-site-content-sync)" } });
    if (!response.ok) {
      assets.push({ sourceUrl, status: "failed", reason: `HTTP ${response.status}` });
      continue;
    }
    const body = Buffer.from(await response.arrayBuffer());
    const urlPath = sourcePath(sourceUrl);
    const fileName = path.basename(urlPath).replace(/[^a-zA-Z0-9._-]/g, "_");
    const target = path.join(mediaDir, fileName);
    await writeFile(target, body);
    assets.push({
      sourceUrl,
      status: "backed_up",
      relativeBackupPath: path.relative(process.cwd(), target).replaceAll("\\", "/"),
      contentType: response.headers.get("content-type") || "unknown",
      bytes: body.length,
      sha256: createHash("sha256").update(body).digest("hex")
    });
  }
  return assets;
}

async function main() {
  if (SHOW_RECORD) {
    const catalog = JSON.parse(await readFile(path.join(REPORT_DIR, "xintuo-product-catalog.json"), "utf8"));
    const record = catalog.records.find((item) => item.sourceId === SHOW_RECORD || item.mapping?.targetSlug === SHOW_RECORD);
    if (!record) throw new Error(`No catalog record found for ${SHOW_RECORD}`);
    process.stdout.write(`${JSON.stringify(record, null, 2)}\n`);
    return;
  }
  await mkdir(REPORT_DIR, { recursive: true });
  const [sitemap, productSource] = await Promise.all([
    readFile(path.join(BACKUP_DIR, "source-sitemap.xml"), "utf8"),
    readFile(path.join(process.cwd(), "data", "products.ts"), "utf8")
  ]);
  const urls = [...new Set([...sitemap.matchAll(PRODUCT_URL_PATTERN)].map((match) => match[1]))];
  const productIndex = currentProducts(productSource);
  const records = [];

  for (const [index, url] of urls.entries()) {
    await wait(index ? 300 : 0);
    const sourceId = url.match(/product_(\d+)\.html/i)?.[1] || `source-${index + 1}`;
    try {
      const html = await fetchText(url);
      await writeFile(path.join(BACKUP_DIR, "pages", `product_${sourceId}.html`), html, "utf8").catch(async () => {
        await mkdir(path.join(BACKUP_DIR, "pages"), { recursive: true });
        await writeFile(path.join(BACKUP_DIR, "pages", `product_${sourceId}.html`), html, "utf8");
      });
      const title = extractProductTitle(html);
      const detailBlock = extractContentBlock(html, "产品详情");
      const technicalBlock = extractContentBlock(html, "技术参数");
      const mapping = mapProduct(title, productIndex);
      const mediaUrls = [...new Set([...extractImageSources(html), ...extractImageSources(detailBlock)])];
      const record = {
        sourceId,
        sourceUrl: url,
        sourcePath: sourcePath(url),
        sourceTitle: title,
        sourceCategory: sourcePath(url).split("/").filter(Boolean)[0] || "uncategorized",
        chineseDescription: textFromHtml(detailBlock),
        technicalTable: extractTechnicalTable(technicalBlock),
        mediaUrls,
        flashAssets: [...html.matchAll(/<embed\b[^>]*?\bsrc=["']([^"']+)["'][^>]*>/gi)].map((match) => absoluteUrl(match[1])).filter(Boolean),
        mapping,
        translationStatus: mapping.status === "matched" ? "ready_for_translation" : "needs_review"
      };
      if (DOWNLOAD_MEDIA) record.mediaBackup = await downloadMedia(record);
      records.push(record);
      process.stdout.write(`Imported ${index + 1}/${urls.length}: ${title || url}\n`);
    } catch (error) {
      records.push({ sourceId, sourceUrl: url, status: "fetch_failed", error: error instanceof Error ? error.message : String(error) });
      process.stdout.write(`Failed ${index + 1}/${urls.length}: ${url}\n`);
    }
  }

  const targetGroups = new Map();
  for (const record of records) {
    if (record.mapping?.status !== "matched" || !record.mapping.targetSlug) continue;
    const group = targetGroups.get(record.mapping.targetSlug) || [];
    group.push(record);
    targetGroups.set(record.mapping.targetSlug, group);
  }
  for (const [targetSlug, group] of targetGroups) {
    if (group.length < 2) continue;
    for (const record of group) {
      record.mapping = {
        ...record.mapping,
        status: "ambiguous",
        targetSlug: null,
        reason: `Multiple legacy model pages map to ${targetSlug}; model-level review is required.`
      };
      record.translationStatus = "needs_review";
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    sourceOrigin: SOURCE_ORIGIN,
    sourceProductUrls: urls.length,
    extracted: records.filter((record) => !record.status).length,
    matched: records.filter((record) => record.mapping?.status === "matched").length,
    ambiguous: records.filter((record) => record.mapping?.status === "ambiguous").length,
    unmatched: records.filter((record) => record.mapping?.status === "unmatched").length,
    needsReview: records.filter((record) => record.mapping?.status === "needs_review").length,
    failed: records.filter((record) => record.status === "fetch_failed").length,
    downloadedMedia: Boolean(DOWNLOAD_MEDIA)
  };
  await writeFile(path.join(REPORT_DIR, "xintuo-product-catalog.json"), `${JSON.stringify({ summary, records }, null, 2)}\n`, "utf8");
  const csv = [
    ["sourceId", "sourceTitle", "sourceUrl", "category", "modelCode", "mappingStatus", "targetSlug", "parameterRows", "mediaCount", "flashCount", "translationStatus"],
    ...records.map((record) => [record.sourceId, record.sourceTitle, record.sourceUrl, record.sourceCategory, record.mapping?.modelCode, record.mapping?.status || record.status, record.mapping?.targetSlug, record.technicalTable?.rows?.length || 0, record.mediaUrls?.length || 0, record.flashAssets?.length || 0, record.translationStatus || ""])
  ].map((row) => row.map(csvValue).join(",")).join("\n");
  await writeFile(path.join(REPORT_DIR, "xintuo-product-mapping.csv"), `${csv}\n`, "utf8");
  const report = [
    "# Xintuo Product Sync Audit",
    "",
    `- Source product URLs: ${summary.sourceProductUrls}`,
    `- Extracted pages: ${summary.extracted}`,
    `- Exact Cowin model matches: ${summary.matched}`,
    `- Ambiguous matches: ${summary.ambiguous}`,
    `- Unmatched products: ${summary.unmatched}`,
    `- Needs review: ${summary.needsReview}`,
    `- Fetch failures: ${summary.failed}`,
    `- Original media backed up: ${DOWNLOAD_MEDIA ? "yes" : "no"}`,
    "",
    "Legacy SWF files are listed for review and are not copied into the public site. Product media is stored in the private backup first; only matched, reviewed assets can move to the public Cowin media directory.",
    "",
    "See `xintuo-product-catalog.json` and `xintuo-product-mapping.csv` for per-product evidence."
  ].join("\n");
  await writeFile(path.join(REPORT_DIR, "xintuo-product-sync-audit.md"), `${report}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(summary)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
