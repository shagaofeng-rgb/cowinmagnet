import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DateBadge } from "@/components/DateBadge";
import { PageHero } from "@/components/PageHero";
import { formatDisplayDate, getNewsCategories, getNewsPosts } from "@/data/contentHub";
import { isLocale, localizedPageAlternates, localizeHref, type Locale } from "@/lib/i18n";

type PageProps = { params: Promise<{ locale: string }> };

function NewsCardImage({ src, alt }: { src: string; alt: string }) {
  if (/^https?:\/\//i.test(src)) {
    return <img src={src} width={760} height={460} alt={alt} loading="lazy" referrerPolicy="no-referrer" style={{ objectFit: "contain" }} />;
  }
  return <Image src={src} width={760} height={460} alt={alt} style={{ objectFit: "contain" }} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  return {
    title: "News | Latest Industry Updates and Company Insights",
    description: "Read the latest industry news, market updates, technology trends, and company perspectives.",
    alternates: localizedPageAlternates(current, "/news")
  };
}

export default async function LocalizedNewsPage({ params }: PageProps) {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const [categories, posts] = await Promise.all([getNewsCategories(), getNewsPosts()]);
  const categoryMap = new Map(categories.map((category) => [category.slug, category.title]));

  return (
    <>
      <PageHero
        eyebrow="News"
        title="News"
        description="Latest industry updates, market insights, and company perspectives."
        image="/images/generated/recycling-application-cowinmagnet.png"
        imageAlt="Cowinmagnet industry news and magnetic separation market insights"
        primaryHref={localizeHref("/request-quote", current)}
        primaryLabel="Send Requirements"
      />

      <section className="section news-index-section">
        <div className="section-heading align-left">
          <span className="eyebrow">Industry Updates</span>
          <h2>Market signals and Cowinmagnet viewpoints</h2>
          <p>
            News is used for industry news, market dynamics, technology trends, company insights, project updates and global observations.
            Blog remains focused on product knowledge, technical guides and application solutions.
          </p>
        </div>

        <div className="news-category-row" aria-label="News categories">
          {categories.map((category) => (
            <a href={`#${category.slug}`} className="news-category-pill" key={category.slug}>
              {category.title}
            </a>
          ))}
        </div>

        <div className="blog-grid news-card-grid">
          {posts.map((post) => (
            <article className="blog-card news-card" id={post.category} key={post.slug}>
              {post.coverImage ? (
                <Link href={localizeHref(`/news/${post.slug}`, current)} className="blog-card-image" aria-label={post.title}>
                  <DateBadge date={post.publishedAt} />
                  <NewsCardImage src={post.coverImage} alt={post.coverAlt || post.title} />
                </Link>
              ) : null}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{categoryMap.get(post.category) || post.categoryTitle || post.category}</span>
                  <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
                </div>
                <h3><Link href={localizeHref(`/news/${post.slug}`, current)}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link href={localizeHref(`/news/${post.slug}`, current)} className="text-link">
                  Read More <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
