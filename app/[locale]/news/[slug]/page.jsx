import { notFound } from "next/navigation";
import ShareActions from "@/components/ShareActions";
import { formatDisplayDate, formatViews, newsCategories, newsPosts } from "@/data/contentHub";
import { createSeoMetadata } from "@/data/i18n";

const siteUrl = "https://www.cowinmagnet.com";

export function generateStaticParams() {
  return newsPosts.flatMap((post) =>
    ["en", "es", "ru", "ar", "fr", "pt"].map((locale) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);
  if (!post) return {};

  return createSeoMetadata(locale, `/news/${slug}`, {
    title: `${post.title} | Cowinmagnet News`,
    description: post.excerpt
  });
}

export default async function NewsDetailPage({ params }) {
  const { locale, slug } = await params;
  const post = newsPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const category = newsCategories.find((item) => item.slug === post.category);
  const localizedHref = `/${locale}${post.href}`;
  const shareUrl = `${siteUrl}${localizedHref}`;

  return (
    <main className="content-article-page">
      <article className="content-article">
        <p className="eyebrow">{category?.title || "Industry News"}</p>
        <h1>{post.title}</h1>
        <div className="content-article-meta">
          <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
          <span>{formatViews(post.views)} views</span>
          <ShareActions url={shareUrl} title={post.title} />
        </div>
        <p className="content-article-lead">{post.excerpt}</p>
        <section>
          <h2>Industry Context</h2>
          <p>
            This news note is organized under the Cowinmagnet industry news categories. It is written as independent
            industry analysis for recycling, mining, quarrying, cement and bulk material handling buyers.
          </p>
        </section>
        <section>
          <h2>Cowinmagnet Product Viewpoint</h2>
          <p>
            Magnetic separation equipment may help reduce ferrous contamination risk and protect downstream machines.
            Product selection should be reviewed according to working conditions, not by headline alone.
          </p>
        </section>
      </article>
    </main>
  );
}
