import Link from "next/link";
import ShareActions from "@/components/ShareActions";
import { formatDisplayDate, formatViews } from "@/data/contentHub";

const siteUrl = "https://www.cowinmagnet.com";

function PostCard({ post, locale }) {
  const localizedHref = `/${locale}${post.href}`;
  const shareUrl = `${siteUrl}${localizedHref}`;

  return (
    <article className="content-post-card">
      <div className="content-card-meta">
        <span>{post.categoryLabel || post.category}</span>
        <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
      </div>
      <Link href={localizedHref}>
        <h2>{post.title}</h2>
      </Link>
      <p>{post.excerpt}</p>
      <div className="content-card-footer">
        <span className="content-views" aria-label={`${formatViews(post.views)} views`}>
          {formatViews(post.views)} views
        </span>
        <ShareActions url={shareUrl} title={post.title} />
      </div>
    </article>
  );
}

export function BlogIndexPage({ page, posts, locale }) {
  return (
    <main className="content-index-page">
      <section className="simple-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
      </section>
      <section className="content-post-grid" aria-label="Cowinmagnet blog posts">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </section>
    </main>
  );
}

export function NewsIndexPage({ page, categories, posts, locale }) {
  const categoryMap = new Map(categories.map((category) => [category.slug, category.title]));
  const normalizedPosts = posts.map((post) => ({ ...post, categoryLabel: categoryMap.get(post.category) || post.category }));

  return (
    <main className="content-index-page">
      <section className="simple-hero">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1>{page.h1}</h1>
        <p>{page.intro}</p>
      </section>

      <section className="news-category-grid" aria-label="News categories">
        {categories.map((category) => (
          <a className="news-category-card" href={`#${category.slug}`} key={category.slug}>
            <h2>{category.title}</h2>
            <p>{category.description}</p>
          </a>
        ))}
      </section>

      <section className="news-group-list" aria-label="Industry news posts">
        {categories.map((category) => {
          const categoryPosts = normalizedPosts.filter((post) => post.category === category.slug);
          return (
            <div className="news-group" id={category.slug} key={category.slug}>
              <div className="news-group-head">
                <p className="eyebrow">News Category</p>
                <h2>{category.title}</h2>
              </div>
              <div className="content-post-grid">
                {categoryPosts.map((post) => (
                  <PostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
