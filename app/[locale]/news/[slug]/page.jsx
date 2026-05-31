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
        {post.sources?.length > 0 && (
          <section className="content-source-box">
            <h2>Referenced Sources</h2>
            <p>
              The news above is independently summarized and interpreted by Cowinmagnet. We do not republish full
              third-party articles or copy media images.
            </p>
            <ul>
              {post.sources.map((source) => (
                <li key={source.url}>
                  <span>{source.date}</span>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.name}: {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
