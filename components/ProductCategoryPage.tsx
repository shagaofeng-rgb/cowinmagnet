import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { breadcrumbSchema, absoluteUrl } from "@/lib/seo";
import { type Locale, localizeHref } from "@/lib/i18n";
import type { Product } from "@/data/products";

type Props = { category: { category: string; slug: string; description: string }; products: Product[]; locale?: Locale };

export function ProductCategoryPage({ category, products, locale }: Props) {
  const path = `/products/${category.slug}`;
  const href = (value: string) => locale ? localizeHref(value, locale) : value;
  const schema = { "@context": "https://schema.org", "@type": "CollectionPage", name: category.category, description: category.description, url: absoluteUrl(locale ? `/${locale}${path}` : path) };
  return <><JsonLd data={schema} /><JsonLd data={breadcrumbSchema([{ name: "Home", path: locale ? `/${locale}` : "/" }, { name: "Products", path: locale ? `/${locale}/products` : "/products" }, { name: category.category, path: locale ? `/${locale}${path}` : path }])} />
    <section className="detail-hero"><div><span className="eyebrow">Product category</span><h1>{category.category}</h1><p>{category.description}</p><div className="hero-actions"><Link href={href("/request-quote")} className="btn btn-primary">Request selection support</Link><Link href={href("/contact")} className="btn btn-secondary">Contact us</Link></div></div></section>
    <section className="section"><div className="section-heading align-left"><span className="eyebrow">Current catalogue</span><h2>Products in this category</h2><p>Compare the listed products, then share your material and installation conditions for technical selection support.</p></div><div className="product-grid">{products.map((product) => locale ? <LocalizedProductCard key={product.slug} product={product} locale={locale} /> : <ProductCard key={product.slug} product={product} />)}</div></section></>;
}
