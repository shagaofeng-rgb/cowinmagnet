import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DateBadge } from "@/components/DateBadge";
import { PaginationNav } from "@/components/PaginationNav";
import { PageHero } from "@/components/PageHero";
import { formatDisplayDate, getNewsCategories, getNewsPosts } from "@/data/contentHub";

type NewsPageProps = {
  searchParams?: Promise<{ category?: string; page?: string }>;
};

const NEWS_PER_PAGE = 12;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function newsPageHref(page: number, category?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/news?${query}` : "/news";
}

function NewsCardImage({ src, alt }: { src: string; alt: string }) {
  if (/^https?:\/\//i.test(src) || src.startsWith("/api/")) {
    return <img src={src} width={760} height={460} alt={alt} loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <Image src={src} width={760} height={460} alt={alt} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "News | Latest Industry Updates and Company Insights",
  description: "Read the latest industry news, market updates, technology trends, and company perspectives.",
  alternates: { canonical: "/news" }
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const query = await searchParams;
  const [categories, posts] = await Promise.all([getNewsCategories(), getNewsPosts()]);
  const categoryMap = new Map(categories.map((category) => [category.slug, category.title]));
  const selectedCategory = categories.some((category) => category.slug === query?.category) ? query?.category : undefined;
  const filteredPosts = selectedCategory ? posts.filter((post) => post.category === selectedCategory) : posts;
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / NEWS_PER_PAGE));
  const requestedPage = parsePositiveInteger(query?.page, 1);
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const pagePosts = filteredPosts.slice((currentPage - 1) * NEWS_PER_PAGE, currentPage * NEWS_PER_PAGE);
  const startItem = filteredPosts.length ? (currentPage - 1) * NEWS_PER_PAGE + 1 : 0;
  const endItem = Math.min(filteredPosts.length, currentPage * NEWS_PER_PAGE);

  return (
    <>
      <PageHero
        eyebrow="News"
        title="News"
        description="Latest industry updates, market insights, and company perspectives."
        image="/images/generated/recycling-application-cowinmagnet.png"
        imageAlt="Cowinmagnet industry news and magnetic separation market insights"
      />

      <section className="section news-index-section">
        <div className="section-heading align-left">
          <span className="eyebrow">Industry Updates</span>
          <h2>Verified industry updates and editorial analysis</h2>
          <p>
            News summarizes attributable external industry developments and separates sourced facts from editorial analysis.
            Blog remains focused on the website&apos;s original technical guides and application knowledge.
          </p>
        </div>

        <div className="news-category-row" aria-label="News categories">
          <Link href={newsPageHref(1)} className={`news-category-pill${!selectedCategory ? " active" : ""}`}>All updates</Link>
          {categories.map((category) => (
            <Link href={newsPageHref(1, category.slug)} className={`news-category-pill${selectedCategory === category.slug ? " active" : ""}`} key={category.slug}>
              {category.title}
            </Link>
          ))}
        </div>

        <div className="news-list-toolbar">
          <p>{startItem}-{endItem} of {filteredPosts.length} news posts</p>
          <span>12 posts per page</span>
        </div>

        <div className="blog-grid news-card-grid">
          {pagePosts.map((post) => (
            <article className="blog-card news-card" id={post.category} key={post.slug}>
              {post.coverImage ? (
                <Link href={`/news/${post.slug}`} className="blog-card-image news-card-image" aria-label={post.title}>
                  <DateBadge date={post.publishedAt} />
                  <NewsCardImage src={post.coverImage} alt={post.coverAlt || post.title} />
                </Link>
              ) : null}
              <div className="blog-card-body">
                <div className="blog-card-meta">
                  <span>{categoryMap.get(post.category) || post.categoryTitle || post.category}</span>
                  <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
                </div>
                <h3><Link href={`/news/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link href={`/news/${post.slug}`} className="text-link">
                  Read More <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 ? (
          <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => newsPageHref(page, selectedCategory)} label="News pagination" summary={`Page ${currentPage} of ${totalPages}`} />
        ) : null}
      </section>
    </>
  );
}
