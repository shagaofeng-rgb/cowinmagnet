import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, Search } from "lucide-react";
import { BlogImage } from "@/components/BlogImage";
import { InnerPage } from "@/components/InnerPage";
import { PaginationNav } from "@/components/PaginationNav";
import { getDictionary, isLocale, localizedPageAlternates, localizeHref } from "@/lib/i18n";
import { catalogLabels } from "@/lib/interiorLocale";
import { getPublicUi } from "@/lib/publicUi";
import { productCategoryPages } from "@/lib/productCategories";
import { searchSite } from "@/lib/siteSearch";

type PageProps = { params: Promise<{ locale: string }>; searchParams?: Promise<{ q?: string; page?: string; kind?: string }> };
const PER_PAGE = 10;
const kinds = ["products", "industries", "articles"] as const;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const ui = getPublicUi(current);
  return { title: ui.searchUi[0], description: ui.searchUi[1], alternates: localizedPageAlternates(current, "/search"), robots: { index: false, follow: true } };
}

export default async function LocalizedSearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const current = isLocale(locale) ? locale : "en";
  const t = getDictionary(current);
  const ui = getPublicUi(current);
  const labels = catalogLabels[current];
  const inputs = await searchParams;
  const query = typeof inputs?.q === "string" ? inputs.q.trim().slice(0, 120) : "";
  const kind = kinds.find((item) => item === inputs?.kind);
  const results = await searchSite(query, current, kind);
  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const page = Math.min(totalPages, Math.max(1, Math.floor(Number(inputs?.page) || 1)));
  const pageResults = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const path = localizeHref("/search", current);
  const href = (value: number, filter?: string) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (filter) search.set("kind", filter);
    if (value > 1) search.set("page", String(value));
    return search.size ? `${path}?${search}` : path;
  };
  const groupLabels = [t.nav.products, ui.industries, labels.articles];

  return <InnerPage locale={current} title={ui.search} variant="search">
    <section className="inner-search-hero"><div className="inner-container">
      <span className="eyebrow">{ui.search}</span>
      <h1>{current === "en" ? "Find products, applications and insights" : ui.searchUi[0]}</h1><p>{ui.searchUi[1]}</p>
      <form className="inner-searchbar" action={path} role="search">
        {kind ? <input type="hidden" name="kind" value={kind} /> : null}
        <input type="search" aria-label={ui.searchUi[2]} name="q" defaultValue={query} placeholder={ui.searchUi[3]} maxLength={120} required />
        <button type="submit" className="btn btn-primary"><Search size={17} aria-hidden />{ui.search}</button>
      </form>
    </div></section>
    <div className="inner-container inner-search-layout">
      <section>
        <nav className="inner-pills" aria-label={ui.searchUi[4]}><Link href={href(1)} aria-current={!kind ? "true" : undefined}>{labels.allResults}</Link>{kinds.map((id, index) => <Link href={href(1, id)} aria-current={kind === id ? "true" : undefined} key={id}>{groupLabels[index]}</Link>)}</nav>
        <div className="inner-results-heading"><h2>{query ? ui.searchUi[5].replace("{count}", String(results.length)).replace("{query}", `“${query}”`) : ui.searchUi[6]}</h2></div>
        {query && results.length ? <>
          {kinds.map((id, index) => {
            const group = pageResults.filter((item) => item.kind === id);
            return group.length ? <div className="inner-result-group" key={id}><h3>{groupLabels[index]}</h3><div className="search-result-list">
              {group.map((item) => <article className="search-result-card" key={item.href}>
                {item.image ? <Link className="inner-result-image" aria-label={item.title} href={localizeHref(item.href, current)}><BlogImage src={item.image} width={200} height={140} alt={item.title} /></Link> : null}
                <div><h4 lang={id === "articles" ? "en" : current}><Link href={localizeHref(item.href, current)}>{item.title}</Link></h4><p lang={id === "articles" ? "en" : current}>{item.excerpt}</p></div>
              </article>)}
            </div></div> : null;
          })}
          <PaginationNav currentPage={page} totalPages={totalPages} hrefForPage={(value) => href(value, kind)} label={ui.searchUi[4]} summary={`${ui.page} ${page} / ${totalPages}`} locale={current} />
        </> : <div className="search-empty-state"><Search size={35} aria-hidden /><h3>{query ? ui.searchUi[9] : ui.searchUi[6]}</h3><p>{query ? ui.searchUi[10] : ui.searchUi[1]}</p><Link href={localizeHref(query ? "/request-quote" : "/products", current)} className="btn btn-primary">{query ? ui.searchUi[11] : t.common.viewProducts}</Link></div>}
      </section>
      <aside className="inner-search-side">
        <div className="inner-filter-links"><h3>{ui.categories}</h3>{productCategoryPages.map((category, index) => <Link key={category.slug} href={localizeHref(`/products/${category.slug}`, current)}>{ui.productCategories[index]}<ArrowRight size={14} aria-hidden /></Link>)}</div>
        <div className="inner-rail-help"><Headphones size={23} aria-hidden /><h3>{ui.catalogHelp}</h3><p>{ui.productInstruction}</p><Link className="text-link" href={localizeHref("/request-quote", current)}>{t.common.getQuote}</Link></div>
      </aside>
    </div>
  </InnerPage>;
}
