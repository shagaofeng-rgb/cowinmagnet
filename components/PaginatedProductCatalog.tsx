import Link from "next/link";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { PaginationNav } from "@/components/PaginationNav";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { localizeHref, type Locale } from "@/lib/i18n";
import { categoryAnchor } from "@/lib/anchors";

const PRODUCTS_PER_PAGE = 12;

type Props = {
  products: Product[];
  categories: string[];
  locale?: Locale;
  selectedCategory?: string;
  requestedPage?: string;
};

function safePage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function PaginatedProductCatalog({ products, categories, locale, selectedCategory, requestedPage }: Props) {
  const selected = categories.find((category) => categoryAnchor(category) === selectedCategory);
  const filteredProducts = selected ? products.filter((product) => product.category === selected) : products;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(safePage(requestedPage), totalPages);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const startItem = filteredProducts.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0;
  const endItem = Math.min(filteredProducts.length, currentPage * PRODUCTS_PER_PAGE);
  const basePath = locale ? localizeHref("/products", locale) : "/products";

  function hrefFor(category?: string, page = 1) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return (
    <section className="section catalog-index-section">
      <div className="section-heading align-left">
        <span className="eyebrow">Product catalogue</span>
        <h2>{selected || "Browse all magnetic separation equipment"}</h2>
        <p>Choose an equipment group, then compare up to 12 products per page. Send your material and installation conditions for configuration support.</p>
      </div>

      <nav className="catalog-category-tabs" aria-label="Product categories">
        <Link href={hrefFor()} className={!selected ? "is-active" : ""}>All products <small>{products.length}</small></Link>
        {categories.map((category) => {
          const slug = categoryAnchor(category);
          const active = selected === category;
          return <Link href={hrefFor(slug)} className={active ? "is-active" : ""} key={category}>{category} <small>{products.filter((product) => product.category === category).length}</small></Link>;
        })}
      </nav>

      <div className="catalog-list-summary"><p>{startItem}-{endItem} of {filteredProducts.length} products</p><Link className="button ghost" href={locale ? localizeHref("/request-quote", locale) : "/request-quote"}>Need selection help?</Link></div>
      <div className="product-grid">
        {pageProducts.map((product) => locale ? <LocalizedProductCard key={product.slug} product={product} locale={locale} /> : <ProductCard key={product.slug} product={product} />)}
      </div>
      <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => hrefFor(selected ? categoryAnchor(selected) : undefined, page)} label="Product catalogue pagination" summary={`Page ${currentPage} of ${totalPages}`} />
    </section>
  );
}
