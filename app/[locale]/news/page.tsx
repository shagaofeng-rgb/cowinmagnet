import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DateBadge } from "@/components/DateBadge";
import { PaginationNav } from "@/components/PaginationNav";
import { PageHero } from "@/components/PageHero";
import { formatDisplayDate, getNewsCategories, getNewsPosts } from "@/data/contentHub";
import { isLocale, localizedPageAlternates, localizeHref, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { brandedImageUrl } from "@/lib/brandedImage";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; page?: string }>;
};

const NEWS_PER_PAGE = 12;

function parsePositiveInteger(value: string | undefined, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

function newsPageHref(locale: Locale, page: number, category?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const base = localizeHref("/news", locale);
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

function NewsCardImage({ src, alt }: { src: string; alt: string }) {
  const imageSrc = brandedImageUrl(src);
  if (/^https?:\/\//i.test(imageSrc) || imageSrc.startsWith("/api/")) {
    return <img src={imageSrc} width={760} height={460} alt={alt} loading="lazy" referrerPolicy="no-referrer" />;
  }
  return <Image src={imageSrc} width={760} height={460} alt={alt} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const ui = getPublicUi(current);
  return {
    title: ui.news[1],
    description: ui.news[3],
    alternates: localizedPageAlternates(current, "/news")
  };
}

export default async function LocalizedNewsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = await searchParams;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const ui = getPublicUi(current);
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
        eyebrow={ui.news[0]}
        title={ui.news[0]}
        description={ui.news[3]}
        image="/images/generated/recycling-application-cowinmagnet-clean-20261001-cowin-brand-20261001.webp"
        imageAlt={ui.news[1]}
      />

      <section className="section news-index-section">
        <div className="section-heading align-left">
          <span className="eyebrow">{ui.news[2]}</span>
          <h2>{ui.news[1]}</h2>
          <p>{ui.news[3]}</p>
          {current !== "en" ? <p lang={current}>{ui.news[8]}</p> : null}
        </div>

        <div className="news-category-row" aria-label={ui.news[2]}>
          <Link href={newsPageHref(current, 1)} className={`news-category-pill${!selectedCategory ? " active" : ""}`}>{ui.news[4]}</Link>
          {categories.map((category) => (
            <Link href={newsPageHref(current, 1, category.slug)} className={`news-category-pill${selectedCategory === category.slug ? " active" : ""}`} key={category.slug}>
              <span lang="en">{category.title}</span>
            </Link>
          ))}
        </div>

        <div className="news-list-toolbar">
          <p>{ui.news[5].replace("{start}", String(startItem)).replace("{end}", String(endItem)).replace("{total}", String(filteredPosts.length))}</p>
          <span>{ui.news[6]}</span>
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
                  <span lang="en">{categoryMap.get(post.category) || post.categoryTitle || post.category}</span>
                  <time dateTime={post.publishedAt}>{formatDisplayDate(post.publishedAt)}</time>
                </div>
                <h3 lang="en"><Link href={localizeHref(`/news/${post.slug}`, current)}>{post.title}</Link></h3>
                <p lang="en">{post.excerpt}</p>
                <Link href={localizeHref(`/news/${post.slug}`, current)} className="text-link">
                  {ui.news[7]} <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 ? (
          <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => newsPageHref(current, page, selectedCategory)} label={ui.news[0]} summary={`${ui.page} ${currentPage} / ${totalPages}`} locale={current} />
        ) : null}
      </section>
    </>
  );
}
