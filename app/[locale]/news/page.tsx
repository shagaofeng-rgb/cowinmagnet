import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DateBadge } from "@/components/DateBadge";
import { PageHero } from "@/components/PageHero";
import { formatDisplayDate, getNewsCategories, getNewsPosts } from "@/data/contentHub";
import { isLocale, localizedPageAlternates, localizeHref, type Locale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ page?: string; perPage?: string }>;
};

const pageSizeOptions = [15, 30, 45];

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function newsPageHref(locale: Locale, page: number, perPage: number) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (perPage !== pageSizeOptions[0]) params.set("perPage", String(perPage));
  const base = localizeHref("/news", locale);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

function NewsCardImage({ src, alt }: { src: string; alt: string }) {
  if (/^https?:\/\//i.test(src) || src.startsWith("/api/")) {
    return <img src={src} width={760} height={460} alt={alt} loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <Image src={src} width={760} height={460} alt={alt} />;
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

export default async function LocalizedNewsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const [categories, posts] = await Promise.all([getNewsCategories(), getNewsPosts()]);
  const categoryMap = new Map(categories.map((category) => [category.slug, category.title]));
  const perPageCandidate = parsePositiveInteger(query?.perPage, pageSizeOptions[0]);
  const perPage = pageSizeOptions.includes(perPageCandidate) ? perPageCandidate : pageSizeOptions[0];
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const requestedPage = parsePositiveInteger(query?.page, 1);
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const pagePosts = posts.slice((currentPage - 1) * perPage, currentPage * perPage);
  const startItem = posts.length ? (currentPage - 1) * perPage + 1 : 0;
  const endItem = Math.min(posts.length, currentPage * perPage);

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

        <div className="news-list-toolbar">
          <p>{startItem}-{endItem} of {posts.length} news posts</p>
          <div className="news-page-size" aria-label="News posts per page">
            <span>Per page</span>
            {pageSizeOptions.map((option) => (
              <Link key={option} href={newsPageHref(current, 1, option)} className={option === perPage ? "active" : ""}>
                {option}
              </Link>
            ))}
          </div>
        </div>

        <div className="blog-grid news-card-grid">
          {pagePosts.map((post) => (
            <article className="blog-card news-card" id={post.category} key={post.slug}>
              {post.coverImage ? (
                <Link href={localizeHref(`/news/${post.slug}`, current)} className="blog-card-image news-card-image" aria-label={post.title}>
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

        {totalPages > 1 ? (
          <nav className="news-pagination" aria-label="News pagination">
            <Link className={currentPage === 1 ? "disabled" : ""} href={newsPageHref(current, Math.max(1, currentPage - 1), perPage)} aria-disabled={currentPage === 1}>
              Previous
            </Link>
            <span>Page {currentPage} of {totalPages}</span>
            <Link className={currentPage === totalPages ? "disabled" : ""} href={newsPageHref(current, Math.min(totalPages, currentPage + 1), perPage)} aria-disabled={currentPage === totalPages}>
              Next
            </Link>
          </nav>
        ) : null}
      </section>
    </>
  );
}
