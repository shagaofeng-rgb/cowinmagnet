import Link from "next/link";
import { Filter, Headphones, Search } from "lucide-react";
import { InnerAction } from "@/components/InnerPage";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { PaginationNav } from "@/components/PaginationNav";
import type { Product } from "@/data/products";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
import { getDictionary, localizeHref, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { categoryAnchor } from "@/lib/anchors";
import { getHomeProductFamily, homeProductFamilies } from "@/lib/homeProductTaxonomy";
import { productCategoryPages } from "@/lib/productCategories";
import { applications, filters, getCatalogueFacets, installations } from "@/lib/catalogFacets";
import { catalogLabels } from "@/lib/interiorLocale";

export const PRODUCTS_PER_PAGE = 12;
const preferred = [
  "rcyd-type-permanent-magnet-self-dumping-iron-remover", "wet-drum-magnetic-separator", "magnetic-head-pulley",
  "magnetic-grid", "eccentric-eddy-current-separator", "round-electromagnetic-lifting-magnet",
  "drum-magnet", "permanent-overband-magnetic-separator", "dry-drum-magnetic-separator"
];
const catalogueOrder = new Map(preferred.map((slug, index) => [slug, index]));

type Props = {
  products: Product[];
  categories: string[];
  locale?: Locale;
  selectedCategory?: string;
  requestedPage?: string;
  requestedFamily?: string;
  keyword?: string;
  requestedApplication?: string;
  requestedInstallation?: string;
};

export function PaginatedProductCatalog({ products, categories, locale = "en", selectedCategory, requestedPage, requestedFamily, keyword, requestedApplication, requestedInstallation }: Props) {
  const ui = getPublicUi(locale);
  const t = getDictionary(locale);
  const labels = catalogLabels[locale];
  const facets = filters[locale];
  const application = applications.find((item) => item === requestedApplication);
  const installation = installations.find((item) => item === requestedInstallation);
  const selected = categories.find((category) => categoryAnchor(category) === selectedCategory);
  const family = homeProductFamilies.find((item) => item === requestedFamily);
  const query = typeof keyword === "string" ? keyword.trim().slice(0, 120) : "";
  const normal = (value: string) => value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
  const queryWords = normal(query).split(/\s+/).filter(Boolean);
  const searched = queryWords.length ? products.filter((item) => {
    const haystack = normal([getLocalizedProductTitle(item, locale), item.name, item.slug, ...(item.keywords || [])].join(" "));
    return queryWords.every((word) => haystack.includes(word));
  }) : products;
  const classified = searched.map((item) => ({ item, ...getCatalogueFacets(item) }));
  const byFacets = classified.filter((entry) => (!application || entry.application.has(application)) && (!installation || entry.installation.has(installation))).map(({ item }) => item);
  const families = homeProductFamilies.map((id, index) => ({ id, label: ui.homeCategories[index + 1], count: byFacets.filter((item) => getHomeProductFamily(item) === id).length })).filter((item) => item.count > 0 || family === item.id);
  const filtered = byFacets.filter((item) => (!selected || item.category === selected) && (!family || getHomeProductFamily(item) === family));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, Math.floor(Number(requestedPage) || 1)), totalPages);
  const pageProducts = [...filtered].sort((a, b) => (catalogueOrder.get(a.slug) ?? preferred.length) - (catalogueOrder.get(b.slug) ?? preferred.length)).slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const base = localizeHref("/products", locale);

  function hrefFor({ group, category, page = 1, term = query, use = application, setup = installation }: { group?: string; category?: string; page?: number; term?: string; use?: string; setup?: string } = {}) {
    const params = new URLSearchParams();
    if (group) params.set("family", group);
    if (category) params.set("category", category);
    if (term) params.set("q", term);
    if (use) params.set("application", use);
    if (setup) params.set("installation", setup);
    if (page > 1) params.set("page", String(page));
    return params.size ? `${base}?${params}` : base;
  }

  const categoryParam = selected ? categoryAnchor(selected) : undefined;
  const nav = <div className="inner-filter-links">
    <h3>{labels.families}</h3>
    <Link href={hrefFor()} aria-current={!family && !selected ? "true" : undefined}>{ui.allProducts} <small>{byFacets.length}</small></Link>
    {families.map(({ id, label, count }) => <Link href={hrefFor({ group: id })} key={id} aria-current={family === id && !selected ? "true" : undefined}>{label} <small>{count}</small></Link>)}
    <h3>{facets[0]}</h3>
    {applications.map((id, index) => <Link href={hrefFor({ group: family, category: categoryParam, use: id === application ? "" : id })} key={id} aria-current={id === application ? "true" : undefined}>{facets[index + 2]}</Link>)}
    <h3>{facets[1]}</h3>
    {installations.map((id, index) => <Link href={hrefFor({ group: family, category: categoryParam, setup: id === installation ? "" : id })} key={id} aria-current={id === installation ? "true" : undefined}>{facets[index + 6]}</Link>)}
    {family || selected || query || application || installation ? <Link className="inner-reset-filter" href={base}>{facets[10]}</Link> : null}
    <h3>{ui.categories}</h3>
    {productCategoryPages.map((category) => <Link href={localizeHref(`/products/${category.slug}`, locale)} key={category.slug}>{ui.productCategories[categories.indexOf(category.category)] || category.category}</Link>)}
  </div>;

  return <section className="inner-container inner-catalog">
    <div className="inner-catalog-layout">
      <aside className="inner-catalog-rail">
        <div className="inner-filter-desktop">{nav}</div>
        <details className="inner-filter-mobile"><summary><Filter size={17} aria-hidden />{ui.categories}{family ? ` · ${families.find((item) => item.id === family)?.label || ""}` : ""}</summary>{nav}</details>
        <div className="inner-rail-help"><Headphones size={22} aria-hidden /><h3>{ui.catalogHelp}</h3><p>{ui.productInstruction}</p><Link className="text-link" href={localizeHref("/request-quote", locale)}>{t.common.requestSelectionSupport}</Link></div>
      </aside>
      <div className="inner-catalog-results">
        <form action={base} className="inner-searchbar" role="search">
          {application ? <input type="hidden" name="application" value={application} /> : null}
          {installation ? <input type="hidden" name="installation" value={installation} /> : null}
          {family ? <input type="hidden" name="family" value={family} /> : null}
          {selected ? <input type="hidden" name="category" value={categoryAnchor(selected)} /> : null}
          <input type="search" name="q" aria-label={labels.search} placeholder={labels.search} defaultValue={query} maxLength={120} />
          <button className="btn btn-primary" type="submit"><Search size={16} aria-hidden />{ui.search}</button>
        </form>
        <div className="inner-results-heading">
          <h2>{selected ? ui.productCategories[categories.indexOf(selected)] || selected : families.find((item) => item.id === family)?.label || ui.allProducts}</h2>
          <p>{ui.catalogCount.replace("{start}", String(filtered.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0)).replace("{end}", String(Math.min(filtered.length, currentPage * PRODUCTS_PER_PAGE))).replace("{total}", String(filtered.length))}</p>
        </div>
        {pageProducts.length ? <div className="product-grid inner-catalog-grid">{pageProducts.map((product) => <LocalizedProductCard key={product.slug} product={product} locale={locale} />)}</div>
          : <div className="search-empty-state"><Search size={30} aria-hidden /><h3>{ui.searchUi[9]}</h3><Link className="btn btn-secondary" href={base}>{ui.allProducts}</Link></div>}
        <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => hrefFor({ group: family, category: selected ? categoryAnchor(selected) : undefined, page })} label={ui.catalog} summary={`${ui.page} ${currentPage} / ${totalPages}`} locale={locale} />
      </div>
    </div>
    <InnerAction locale={locale} />
  </section>;
}
