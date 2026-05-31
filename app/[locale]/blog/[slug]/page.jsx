import { notFound } from "next/navigation";
import ShareActions from "@/components/ShareActions";
import { blogPosts, formatDisplayDate, formatViews } from "@/data/contentHub";
import { createSeoMetadata } from "@/data/i18n";

const siteUrl = "https://www.cowinmagnet.com";

export function generateStaticParams() {
  return blogPosts.flatMap((post) =>
    ["en", "es", "ru", "ar", "fr", "pt"].map((locale) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return {};

  return createSeoMetadata(locale, `/blog/${slug}`, {
    title: `${post.title} | Cowinmagnet Blog`,
    description: post.excerpt
  });
}

export default async function BlogDetailPage({ params }) {
  const { locale, slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const localizedHref = `/${locale}${post.href}`;
  const shareUrl = `${siteUrl}${localizedHref}`;

  return (
    <main className="content-article-page">
      <article className="content-article">
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <div className="content-article-meta">
          <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
          <span>{formatViews(post.views)} views</span>
          <ShareActions url={shareUrl} title={post.title} />
        </div>
        <p className="content-article-lead">{post.excerpt}</p>
        {post.coverImage && (
          <figure className="content-article-media">
            <img src={post.coverImage} alt={post.coverAlt || post.title} width="1200" height="720" />
            <figcaption>{post.imageCaption}</figcaption>
          </figure>
        )}
        {post.sections?.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
