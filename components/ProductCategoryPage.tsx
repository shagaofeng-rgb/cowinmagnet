import Link from "next/link";
import { CheckCircle2, Factory, Filter, Layers, Magnet, Settings2, SlidersHorizontal, Workflow } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { InnerAction, InnerPage } from "@/components/InnerPage";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { PageHero } from "@/components/PageHero";
import { PaginationNav } from "@/components/PaginationNav";
import { breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { getDictionary, type Locale, localizeHref } from "@/lib/i18n";
import { productCategories, type Product } from "@/data/products";
import { getPublicUi } from "@/lib/publicUi";
import { getHomeProductFamily, homeProductFamilies } from "@/lib/homeProductTaxonomy";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
import { catalogLabels } from "@/lib/interiorLocale";
import { PRODUCTS_PER_PAGE } from "@/components/PaginatedProductCatalog";

type Props = { category: { category: string; slug: string; description: string }; products: Product[]; locale?: Locale; requestedPage?: string; requestedFamily?: string };

const categoryDesign = [
  { hero: "rcyd-type-permanent-magnet-self-dumping-iron-remover", Icon: Magnet, guide: ["Permanent magnetic systems", "Electromagnetic systems"], notes: ["Review how iron is collected and discharged at the conveyor.", "Confirm power, duty cycle and installation clearance for the proposed unit."] },
  { hero: "wet-drum-magnetic-separator", Icon: Workflow, guide: ["Dry processing", "Wet processing"], notes: ["Review particle size, feed depth and whether material is free flowing.", "Share slurry concentration, particle size and required throughput before selecting a unit."] },
  { hero: "eccentric-eddy-current-separator", Icon: Filter, guide: ["Detect metal", "Recover non-ferrous metals", "Remove ferrous material"], notes: ["Confirm what must be detected and how the line should respond.", "Review the mix and size of conductive non-ferrous material.", "Review upstream iron removal so the sorting stage receives the correct feed."] },
  { hero: "magnetic-grid", Icon: Layers, guide: ["Dry powders and granules", "Liquids and slurry", "Integration components"], notes: ["Share hopper geometry, bulk material and access for cleaning.", "Confirm the pipe connection, material and operating conditions.", "Review fit, material compatibility and maintenance access."] },
  { hero: "round-electromagnetic-lifting-magnet", Icon: Factory, guide: ["Equipment integration", "Operating conditions"], notes: ["Share the equipment interface, installation and intended duty.", "Confirm the load, duty cycle and operating environment before configuration."] }
];

export function ProductCategoryPage({ category, products, locale = "en", requestedPage, requestedFamily }: Props) {
  const ui = getPublicUi(locale);
  const t = getDictionary(locale);
  const labels = catalogLabels[locale];
  const categoryIndex = productCategories.indexOf(category.category);
  const categoryName = ui.productCategories[categoryIndex] || category.category;
  const description = locale === "en" ? category.description : t.products.description;
  const path = `/products/${category.slug}`;
  const design = categoryDesign[categoryIndex] || categoryDesign[1];
  const hero = products.find((item) => item.slug === design.hero) || products[0];
  const families = homeProductFamilies.map((id, index) => ({ id, label: ui.homeCategories[index + 1], count: products.filter((item) => getHomeProductFamily(item) === id).length })).filter(({ count }) => count > 0);
  const family = families.find((item) => item.id === requestedFamily)?.id;
  const results = family ? products.filter((item) => getHomeProductFamily(item) === family) : products;
  const totalPages = Math.max(1, Math.ceil(results.length / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, Math.floor(Number(requestedPage) || 1)), totalPages);
  const pageProducts = results.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const href = (page: number, group?: string) => {
    const params = new URLSearchParams();
    if (group) params.set("family", group);
    if (page > 1) params.set("page", String(page));
    return `${localizeHref(path, locale)}${params.size ? `?${params}` : ""}`;
  };
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: categoryName, description, url: absoluteUrl(localizeHref(path, locale)) };

  return <InnerPage locale={locale} title={categoryName} parent={{ label: t.nav.products, href: "/products" }} variant="category">
    <JsonLd data={schema} />
    <JsonLd data={breadcrumbSchema([{ name: ui.home, path: `/${locale}` }, { name: t.nav.products, path: localizeHref("/products", locale) }, { name: categoryName, path: localizeHref(path, locale) }])} />
    <PageHero eyebrow={ui.catalog} title={categoryName} description={description} image={hero?.image} imageAlt={hero ? getLocalizedProductTitle(hero, locale) : undefined} mediaStyle="equipment" primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.requestSelectionSupport} />
    <div className="inner-container inner-stack">
      <section>
        <h2>{labels.selection}</h2>
        <div className="inner-guide-grid">
          {locale === "en" ? design.guide.map((heading, index) => <article key={heading}><div className="inner-icon">{index === 0 ? <design.Icon size={25} aria-hidden /> : <SlidersHorizontal size={25} aria-hidden />}</div><div><h3>{heading}</h3><p>{design.notes[index]}</p></div></article>)
            : families.map(({ id, label }) => <article key={id}><div className="inner-icon"><design.Icon size={24} aria-hidden /></div><div><h3>{label}</h3><p>{ui.productInstruction}</p></div></article>)}
        </div>
      </section>
      <section>
        {families.length > 1 ? <nav className="inner-pills" aria-label={labels.families}><Link href={href(1)} aria-current={!family ? "true" : undefined}>{ui.allProducts} · {products.length}</Link>{families.map(({ id, label, count }) => <Link key={id} href={href(1, id)} aria-current={family === id ? "true" : undefined}>{label} · {count}</Link>)}</nav> : null}
        <div className="inner-results-heading"><h2>{labels.equipment}</h2><p>{ui.catalogCount.replace("{start}", String(results.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0)).replace("{end}", String(Math.min(results.length, currentPage * PRODUCTS_PER_PAGE))).replace("{total}", String(results.length))}</p></div>
        <div className="product-grid inner-category-grid">{pageProducts.map((product) => <LocalizedProductCard key={product.slug} product={product} locale={locale} />)}</div>
        <PaginationNav currentPage={currentPage} totalPages={totalPages} hrefForPage={(page) => href(page, family)} label={categoryName} summary={`${ui.page} ${currentPage} / ${totalPages}`} locale={locale} />
      </section>
      <section className="inner-process-band">
        <h2>{labels.process}</h2><p>{ui.productInstruction}</p>
        <ul>{[ui.material, ui.installation, labels.operation].map((label) => <li key={label}><CheckCircle2 size={18} aria-hidden />{label}</li>)}</ul>
      </section>
      <InnerAction locale={locale} />
    </div>
  </InnerPage>;
}
