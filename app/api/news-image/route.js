import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = Number(process.env.NEWS_IMAGE_PROXY_MAX_BYTES || 8 * 1024 * 1024);
const FETCH_TIMEOUT_MS = Number(process.env.NEWS_IMAGE_PROXY_TIMEOUT_MS || 15000);
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function isSafeHttpUrl(value = "") {
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol)) return false;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".localhost")) return false;
    if (/^(0|10|127|169\.254|172\.(1[6-9]|2\d|3[0-1])|192\.168)\./.test(host)) return false;
    if (host === "::1" || host.startsWith("fc") || host.startsWith("fd")) return false;
    if (host === "metadata.google.internal") return false;
    return true;
  } catch {
    return false;
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src") || "";
  const ref = searchParams.get("ref") || "";
  const width = Math.min(1400, Math.max(320, Number(searchParams.get("w") || 980) || 980));

  if (!isSafeHttpUrl(src) || (ref && !isSafeHttpUrl(ref))) {
    return NextResponse.json({ success: false, error: "Invalid image URL" }, { status: 400 });
  }

  try {
    const response = await fetch(src, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif,image/*,*/*;q=0.8",
        ...(ref ? { Referer: ref } : {})
      },
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: `Source image returned ${response.status}` }, { status: 502 });
    }

    const contentType = (response.headers.get("content-type") || "").split(";")[0].toLowerCase();
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "Source is not an image" }, { status: 415 });
    }

    const sourceBytes = await readLimitedBytes(response);
    const output = await sharp(sourceBytes, { failOn: "none" })
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    return new NextResponse(output, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.name === "TimeoutError" ? "Source image timed out" : "Image processing failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
