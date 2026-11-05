import type { Metadata } from "next";
import Link from "next/link";
import { InnerAction, InnerPage } from "@/components/InnerPage";
import { InnerArticleCard } from "@/components/InnerArticleCard";
import { PaginationNav } from "@/components/PaginationNav";
import { PageHero } from "@/components/PageHero";
import { getNewsCategories, getNewsPosts } from "@/data/contentHub";
import { isLocale, localizedPageAlternates, localizeHref, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

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

  const featured = currentPage === 1 ? pagePosts[0] : undefined;
  const renderCard = (post: (typeof pagePosts)[number], lead = false) => <InnerArticleCard
    key={post.slug} href={localizeHref(`/news/${post.slug}`, current)} title={post.title}
    category={categoryMap.get(post.category) || post.categoryTitle || post.category}
    excerpt={post.excerpt} image={post.coverImage} alt={post.coverAlt} date={post.publishedAt}
    action={ui.news[7]} featured={lead} priority={lead}
  />;
  return <InnerPage locale={current} title={ui.news[0]} variant="news">
    <PageHero compact eyebrow={ui.news[2]} title={current === "en" ? "News & Industry Updates" : ui.news[0]} description={ui.news[3]} primaryHref="" />
    <div className="inner-container inner-stack">
      {current !== "en" ? <p>{ui.news[8]}</p> : null}
      <nav className="inner-pills" aria-label={ui.news[2]}>
        <Link href={newsPageHref(current, 1)} aria-current={!selectedCategory ? "true" : undefined}>{ui.news[4]}</Link>
        {categories.map((category) => <Link href={newsPageHref(current, 1, category.slug)} aria-current={selectedCategory === category.slug ? "true" : undefined} key={category.slug} lang="en">{category.title}</Link>)}
      </nav>
      {featured ? <section aria-label={ui.news[2]}>{renderCard(featured, true)}</section> : null}
      <section>
        <div className="inner-results-heading"><h2>{ui.news[1]}</h2><p>{ui.news[5].replace("{start}", String(startItem)).replace("{end}", String(endItem)).replace("{total}", String(filteredPosts.length))}</p></div>
        <div className="blog-grid news-card-grid">{(featured ? pagePosts.slice(1) : pagePosts).map((post) => renderCard(post))}</div>
        <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => newsPageHref(current, page, selectedCategory)} label={ui.news[0]} summary={`${ui.page} ${currentPage} / ${totalPages}`} locale={current} />
      </section>
      <InnerAction locale={current} />
    </div>
  </InnerPage>;
}
