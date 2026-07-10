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

function validDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const posts = (await getNewsPosts())
    .map((post) => ({ post, publishedDate: validDate(post.publishedAt), updatedDate: validDate(post.updatedAt || post.publishedAt) }))
    .filter((item): item is typeof item & { publishedDate: Date } => Boolean(item.publishedDate && item.publishedDate.getTime() >= cutoff))
    .slice(0, 1000);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${posts
  .map(
    ({ post, publishedDate, updatedDate }) => `  <url>
    <loc>${escapeXml(`${site.url}/en/news/${post.slug}`)}</loc>
    <lastmod>${escapeXml((updatedDate || publishedDate).toISOString())}</lastmod>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.name)}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${escapeXml(publishedDate.toISOString())}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900"
    }
  });
}
