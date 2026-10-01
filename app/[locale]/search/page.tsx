import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { PaginationNav } from "@/components/PaginationNav";
import { getDictionary, isLocale, localizedPageAlternates, localizeHref, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { searchSite } from "@/lib/siteSearch";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string; page?: string }>;
};

const RESULTS_PER_PAGE = 10;

function safePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const ui = getPublicUi(current);
  return {
    title: ui.searchUi[0],
    description: ui.searchUi[1],
    alternates: localizedPageAlternates(current, "/search"),
    robots: { index: false, follow: true }
  };
}

export default async function LocalizedSearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const t = getDictionary(current);
  const ui = getPublicUi(current);
  const queryParams = await searchParams;
  const query = String(queryParams?.q || "").trim();
  const results = await searchSite(query, current);
  const totalPages = Math.max(1, Math.ceil(results.length / RESULTS_PER_PAGE));
  const currentPage = Math.min(safePage(queryParams?.page), totalPages);
  const pageResults = results.slice((currentPage - 1) * RESULTS_PER_PAGE, currentPage * RESULTS_PER_PAGE);
  const startItem = results.length ? (currentPage - 1) * RESULTS_PER_PAGE + 1 : 0;
  const endItem = Math.min(results.length, currentPage * RESULTS_PER_PAGE);
  const hrefForPage = (page: number) => {
    const search = new URLSearchParams({ q: query });
    if (page > 1) search.set("page", String(page));
    return `${localizeHref("/search", current)}?${search.toString()}`;
  };

  return (
    <>
      <PageHero
        eyebrow={ui.search}
        title={ui.searchUi[0]}
        description={ui.searchUi[1]}
        image="/images/generated/contact-support-cowinmagnet-clean-20261001-cowin-brand-20261001.webp"
        imageAlt={ui.searchUi[0]}
        secondaryHref={localizeHref("/request-quote", current)}
        secondaryLabel={ui.catalogHelp}
      />

      <section className="section search-section">
        <form className="site-search-form" action={localizeHref("/search", current)} role="search">
          <label htmlFor="site-search-query">{ui.searchUi[2]}</label>
          <div>
            <input id="site-search-query" name="q" defaultValue={query} placeholder={ui.searchUi[3]} />
            <button type="submit" className="btn btn-primary">
              <Search size={17} aria-hidden /> {ui.search}
            </button>
          </div>
        </form>

        <div className="search-results-header">
          <span className="eyebrow">{ui.searchUi[4]}</span>
          <h2>{query ? ui.searchUi[5].replace("{count}", String(results.length)).replace("{query}", `"${query}"`) : ui.searchUi[6]}</h2>
          {current !== "en" && pageResults.some((item) => item.type === ui.news[0] || item.type === t.nav.blog) ? <p>{ui.news[8]}</p> : null}
        </div>

        {query && results.length ? (
          <>
          <p className="search-results-summary">{ui.searchUi[7].replace("{start}", String(startItem)).replace("{end}", String(endItem)).replace("{total}", String(results.length))}</p>
          <div className="search-result-list">
            {pageResults.map((item) => (
              <article className="search-result-card" key={`${item.type}-${item.href}`}>
                <span>{item.type}</span>
                <h3 lang={item.type === ui.news[0] || item.type === t.nav.blog || item.type === t.nav.products ? "en" : current}><Link href={localizeHref(item.href, current)}>{item.title}</Link></h3>
                <p lang={item.type === ui.news[0] || item.type === t.nav.blog ? "en" : current}>{item.excerpt}</p>
                <Link className="text-link" href={localizeHref(item.href, current)}>{ui.searchUi[8]}</Link>
              </article>
            ))}
          </div>
          <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={hrefForPage} label={ui.searchUi[4]} summary={`${ui.page} ${currentPage} / ${totalPages}`} locale={current} />
          </>
        ) : query ? (
          <div className="search-empty-state">
            <h3>{ui.searchUi[9]}</h3>
            <p>{ui.searchUi[10]}</p>
            <Link href={localizeHref("/request-quote", current)} className="btn btn-primary">{ui.searchUi[11]}</Link>
          </div>
        ) : null}
      </section>
    </>
  );
}
