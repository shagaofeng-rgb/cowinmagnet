import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { RelatedInternalLinks } from "@/components/RelatedInternalLinks";
import { breadcrumbSchema, faqSchema, absoluteUrl } from "@/lib/seo";
import { getStaticInternalLinkSuggestions } from "@/lib/linkStrategy";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { getProductBySlugWithCms } from "@/lib/productCms";
import { cleanProductList, cleanProductSpecs, cleanProductText } from "@/lib/productDisplay";
import { getProductCategoryPage, productCategoryPages } from "@/lib/productCategories";
import { ProductCategoryPage } from "@/components/ProductCategoryPage";
import { getProductsWithCms } from "@/lib/productCms";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  return [...products.map((product) => ({ slug: product.slug })), ...productCategoryPages.map((category) => ({ slug: category.slug }))];
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugWithCms(slug);
  const category = getProductCategoryPage(slug);

  if (category) {
    return { title: category.category, description: category.description, alternates: { canonical: `/products/${category.slug}` }, openGraph: { title: `${category.category} | COWIN MAGNET`, description: category.description, url: absoluteUrl(`/products/${category.slug}`) } };
  }

  if (!product) {
    return {};
  }

  const summary = cleanProductText(product.summary, "Contact us for verified specifications and selection support.");

  return {
    title: product.name,
    description: summary,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} | COWIN MAGNET`,
      description: summary,
      url: absoluteUrl(`/products/${product.slug}`),
      images: [product.image]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugWithCms(slug);
  const category = getProductCategoryPage(slug);

  if (category) {
    const catalogue = await getProductsWithCms();
    return <ProductCategoryPage category={category} products={catalogue.filter((item) => item.category === category.category)} />;
  }

  if (!product) {
    notFound();
  }

  const relatedInternalLinks = getStaticInternalLinkSuggestions({ type: "product", slug: product.slug, limit: 5 });
  const summary = cleanProductText(product.summary, "Contact us for verified specifications and selection support.");
  const principle = cleanProductText(product.principle, summary);
  const features = cleanProductList(product.features);
  const specs = cleanProductSpecs(product.specs);
  const applications = cleanProductList(product.applications);
  const customization = cleanProductList(product.customization);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: absoluteUrl(product.image),
    description: summary,
    brand: { "@type": "Brand", name: site.name },
    seller: { "@type": "Organization", name: site.legalName },
    category: product.category,
    url: absoluteUrl(`/products/${product.slug}`),
  };

  return (
    <>
      <JsonLd data={productSchema} />
      {product.faqs?.length ? <JsonLd data={faqSchema(product.faqs)} /> : null}
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: product.name, path: `/products/${product.slug}` }
      ])} />

      <section className="detail-hero">
        <div>
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{summary}</p>
          <div className="hero-actions">
            <Link href={`/request-quote?product=${encodeURIComponent(product.name)}`} className="btn btn-primary">
              Get a Quote for This Product
            </Link>
            <Link href="/contact" className="btn btn-secondary">Contact Sales</Link>
          </div>
        </div>
        <div className="detail-image">
          <Image src={product.image} width={820} height={560} alt={product.name} priority />
        </div>
      </section>

      <section className="section detail-layout">
        <article className="detail-main">
          <div className="content-block">
            <h2>Product Overview</h2>
            <p>{summary}</p>
          </div>
          {features.length ? <div className="content-block"><h2>Key Features</h2><ul className="feature-list">{features.map((feature: string) => <li key={feature}><CheckCircle2 size={18} aria-hidden />{feature}</li>)}</ul></div> : null}
          {principle && principle !== summary ? <div className="content-block"><h2>Working Principle</h2><p>{principle}</p></div> : null}
          {specs.length ? <div className="content-block"><h2>Specifications</h2><div className="spec-table">{specs.map((spec: { label: string; value: string }) => <div key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}</div></div> : null}
          {applications.length ? <div className="content-block"><h2>Application Industries</h2><div className="tag-list">{applications.map((item: string) => <span key={item}>{item}</span>)}</div></div> : null}
          {cleanProductText(product.installation) ? <div className="content-block"><h2>Installation Method</h2><p>{cleanProductText(product.installation)}</p></div> : null}
          {customization.length ? <div className="content-block"><h2>Customization Options</h2><div className="tag-list">{customization.map((item: string) => <span key={item}>{item}</span>)}</div></div> : null}
          {product.faqs?.length ? <div className="content-block"><h2>FAQ</h2><div className="faq-list">{product.faqs.map((faq: { question: string; answer: string }) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></div> : null}
        </article>
        <aside className="quote-panel expert-quote-panel">
          <div className="expert-card">
            <div className="expert-card-photo">
              <Image src="/images/expert-david-sha.jpg" width={420} height={420} alt="David Sha, COWIN MAGNET selection consultant" />
            </div>
            <div className="expert-card-body">
              <span className="expert-label">Selection Consultant</span>
              <h2>Ask David for a suitable configuration</h2>
              <p>Send your conveyor width, material, installation height, and iron contamination level. We will help match the right magnetic separation solution.</p>
              <ul className="expert-card-points">
                <li><BadgeCheck size={16} aria-hidden /> Permanent or electromagnetic selection</li>
                <li><BadgeCheck size={16} aria-hidden /> OEM/ODM sizing suggestion</li>
                <li><BadgeCheck size={16} aria-hidden /> Fast reply by email or WhatsApp</li>
              </ul>
              <div className="expert-card-actions">
                <a href={`https://wa.me/${site.whatsapp}`} className="expert-action" target="_blank" rel="noopener noreferrer nofollow">
                  <MessageCircle size={16} aria-hidden />
                  WhatsApp
                </a>
                <a href={`mailto:${site.email}`} className="expert-action">
                  <Mail size={16} aria-hidden />
                  Email
                </a>
              </div>
            </div>
          </div>
          <div className="quote-form-shell">
            <h3>Quick Product Inquiry</h3>
            <p>Tell us the basic working condition.</p>
            <QuoteForm compact defaultProduct={product.name} />
          </div>
        </aside>
      </section>

      <RelatedInternalLinks
        eyebrow="Product Path"
        title="Related products, applications and buying guides"
        links={relatedInternalLinks}
      />

      <section className="section cta-band">
        <div>
          <span className="eyebrow">Custom Selection</span>
          <h2>Need a separator for a specific conveyor or material?</h2>
          <p>Tell us your working conditions and we will recommend a practical configuration.</p>
        </div>
        <Link href="/request-quote" className="btn btn-primary">Start a Custom Quote <ArrowRight size={17} aria-hidden /></Link>
      </section>
    </>
  );
}
