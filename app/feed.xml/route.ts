import { getNewsPosts } from "@/data/contentHub";
import { site } from "@/data/site";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rssDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

function absoluteImageUrl(value = "") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${site.url}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function GET() {
  const posts = (await getNewsPosts()).slice(0, 30);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(site.name)} Industry News</title>
    <link>${escapeXml(`${site.url}/news`)}</link>
    <description>${escapeXml("Industry news references with Cowinmagnet original magnetic separation analysis.")}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts
  .map((post) => {
    const link = `${site.url}/news/${post.slug}`;
    const image = absoluteImageUrl(post.coverImage || "");
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(post.excerpt || post.seoDescription || "")}</description>
      <pubDate>${rssDate(post.publishedAt)}</pubDate>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <author>${escapeXml(post.author || site.name)}</author>
      <category>${escapeXml(post.categoryTitle || post.category || "Industry News")}</category>${image ? `\n      <media:content url="${escapeXml(image)}" medium="image" />` : ""}
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900"
    }
  });
}
