import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Globe2, Headphones, Mail, MapPin, MessageCircle, Phone, Settings, ShieldCheck, Truck, Wrench } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import { GlobalCustomerNetwork } from "@/components/GlobalCustomerNetwork";
import { HomeVideoShowcase } from "@/components/HomeVideoShowcase";
import { JsonLd } from "@/components/JsonLd";
import { DateBadge } from "@/components/DateBadge";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { RelatedInternalLinks } from "@/components/RelatedInternalLinks";
import { applications, type Application } from "@/data/applications";
import { blogPosts } from "@/data/blogs";
import { productCategories, products, type Product } from "@/data/products";
import { categoryAnchor } from "@/lib/anchors";
import { site } from "@/data/site";
import { absoluteUrl, breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localizeHref } from "@/lib/i18n";
import { getStaticInternalLinkSuggestions } from "@/lib/linkStrategy";
import { cleanProductList, cleanProductSpecs, cleanProductText } from "@/lib/productDisplay";

const advantageIcons = [ShieldCheck, Settings, Headphones, Globe2];
const serviceIcons = [Headphones, Wrench, Truck, ShieldCheck, BadgeCheck, Globe2];
const homeFeaturedProductSlugs = [
  "suspended-permanent-magnetic-separator",
  "suspended-electromagnetic-conveyor-belt-separator",
  "round-electromagnetic-lifting-magnet",
  "electromagnet-separator",
  "permanent-overband-magnetic-separator"
];

export function LocalizedHomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const featured = homeFeaturedProductSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
  const categoryCards = productCategories.map((category) => ({
    title: category,
    count: products.filter((product) => product.category === category).length,
    href: localizeHref(`/products#${categoryAnchor(category)}`, locale)
  }));

  return (
    <>
      <section className="home-hero">
        <Image src="/images/generated/home-hero-cowinmagnet.webp" fill sizes="100vw" alt={t.home.heroAlt} className="hero-banner-image" priority />
        <div className="hero-copy">
          <span className="eyebrow">{t.home.heroEyebrow}</span>
          <h1>{t.home.h1}</h1>
          <p>{t.home.heroText}</p>
          <div className="hero-actions">
            <Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">{t.common.getQuote}</Link>
            <Link href={localizeHref("/products", locale)} className="btn btn-secondary">{t.common.viewProducts}</Link>
          </div>
          <div className="hero-proof"><span>OEM/ODM</span><span>Mining</span><span>Recycling</span><span>Cement</span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{t.home.whyEyebrow}</span>
          <h2>{t.home.whyTitle}</h2>
        </div>
        <div className="advantage-grid">
          {t.advantages.map(([title, text], index) => {
            const Icon = advantageIcons[index] || ShieldCheck;
            return <article key={title} className="advantage-item"><Icon size={28} aria-hidden /><h3>{title}</h3><p>{text}</p></article>;
          })}
        </div>
      </section>

      <HomeVideoShowcase
        eyebrow={t.home.videoEyebrow}
        title={t.home.videoTitle}
        text={t.home.videoText}
        quoteHref={localizeHref("/request-quote", locale)}
        quoteLabel={t.common.sendRequirements}
      />

      <section className="section section-muted">
        <div className="section-heading">
          <span className="eyebrow">{t.home.featuredEyebrow}</span>
          <h2>{t.home.featuredTitle}</h2>
        </div>
        <div className="product-grid">
          {featured.map((product) => <LocalizedProductCard key={product.slug} product={product} locale={locale} />)}
        </div>
      </section>

      <GlobalCustomerNetwork categories={categoryCards} />

      <section className="section section-split industry-overview-section">
        <div className="industry-overview-copy">
          <span className="eyebrow">{t.home.applicationEyebrow}</span>
          <h2>{t.home.applicationTitle}</h2>
          <p>{t.home.applicationText}</p>
          <Link href={localizeHref("/industries", locale)} className="text-link">Industries <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div className="application-mini-grid">
          {applications.map((application) => (
            <Link key={application.industrySlug} href={localizeHref(`/industries/${application.industrySlug}`, locale)} className="application-mini">
              <Image
                src={application.image}
                width={1024}
                height={768}
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 340px"
                alt={`Magnetic separator used in ${application.name.toLowerCase()} application`}
                loading="lazy"
              />
              {application.iconImage ? (
                <span className="application-mini-icon" aria-hidden="true">
                  <Image src={application.iconImage} width={80} height={80} alt={`${application.name} magnetic separation icon`} loading="lazy" />
                </span>
              ) : null}
              <span>{application.name}</span>
              <p>{application.summary}</p>
              <small>View industry solution <ArrowRight size={14} aria-hidden /></small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section quote-section">
        <div className="quote-intro-card">
          <span className="eyebrow">{t.home.quoteEyebrow}</span>
          <h2>{t.home.quoteTitle}</h2>
          <p>{t.home.quoteText}</p>
          <div className="quote-intro-media">
            <Image
              src="/images/generated/contact-support-cowinmagnet.png"
              width={760}
              height={520}
              alt="Cowinmagnet export service team supporting magnetic separator inquiries"
            />
            <div className="quote-intro-overlay">
              <strong>24-hour response direction</strong>
              <span>Model selection, sourcing coordination and shipment communication.</span>
            </div>
          </div>
          <div className="quote-intro-points">
            <span>Material review</span>
            <span>Model selection</span>
            <span>Export support</span>
          </div>
        </div>
        <QuoteForm compact />
      </section>
    </>
  );
}

export function LocalizedProductsPage({
  locale,
  productList = products,
  categoryList = productCategories
}: {
  locale: Locale;
  productList?: Product[];
  categoryList?: string[];
}) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.products.eyebrow} title={t.products.h1} description={t.products.description} image="/images/catalog/page-3-image-9-1871x840.jpg" imageAlt={t.products.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/request-quote", locale)} secondaryLabel={t.common.requestSelectionSupport} />
      <section className="section">
        {categoryList.map((category) => (
          <div className="product-category-block" id={categoryAnchor(category)} key={category}>
            <div className="section-heading align-left"><span className="eyebrow">{category}</span><h2>{category}</h2></div>
            <div className="product-grid">
              {productList.filter((product) => product.category === category).map((product) => <LocalizedProductCard key={product.slug} product={product} locale={locale} />)}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export function LocalizedProductDetailPage({ locale, product }: { locale: Locale; product: Product }) {
  const t = getDictionary(locale);
  const relatedInternalLinks = getStaticInternalLinkSuggestions({ type: "product", slug: product.slug, limit: 5 });
  const summary = cleanProductText(product.summary);
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
    url: absoluteUrl(localizeHref(`/products/${product.slug}`, locale))
  };

  return (
    <>
      <JsonLd data={productSchema} />
      {product.faqs?.length ? <JsonLd data={faqSchema(product.faqs)} /> : null}
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: `/${locale}` }, { name: t.nav.products, path: `/${locale}/products` }, { name: product.name, path: `/${locale}/products/${product.slug}` }])} />
      <section className="detail-hero">
        <div>
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name} {t.productDetail.manufacturer}</h1>
          <p>{summary}</p>
          <div className="hero-actions">
            <Link href={localizeHref(`/request-quote?product=${encodeURIComponent(product.name)}`, locale)} className="btn btn-primary">{t.common.getQuote}</Link>
            <Link href={localizeHref("/contact", locale)} className="btn btn-secondary">{t.common.contactSales}</Link>
          </div>
        </div>
        <div className="detail-image"><Image src={product.image} width={820} height={560} alt={`${product.name} ${t.productDetail.manufacturer}`} priority /></div>
      </section>
      <section className="section detail-layout">
        <article className="detail-main">
          <ContentBlock title={t.productDetail.overview}><p>{summary}</p></ContentBlock>
          <ContentBlock title={t.productDetail.features}><FeatureList items={features} /></ContentBlock>
          <ContentBlock title={t.productDetail.principle}><p>{principle}</p></ContentBlock>
          <ContentBlock title={t.productDetail.specifications}><SpecTable specs={specs} /></ContentBlock>
          <ContentBlock title={t.productDetail.industries}><TagList items={applications} /></ContentBlock>
          <ContentBlock title={t.productDetail.installation}><p>{product.installation}</p></ContentBlock>
          <ContentBlock title={t.productDetail.customization}><TagList items={customization} /></ContentBlock>
          <ContentBlock title={t.productDetail.faq}><FaqList faqs={product.faqs} /></ContentBlock>
        </article>
        <aside className="quote-panel">
          <h2>{t.productDetail.quoteTitle}</h2>
          <p>{t.productDetail.quoteText}</p>
          <QuoteForm compact defaultProduct={product.name} />
        </aside>
      </section>
      <RelatedInternalLinks
        locale={locale}
        eyebrow="Product Path"
        title="Related products, applications and buying guides"
        links={relatedInternalLinks}
      />
    </>
  );
}

export function LocalizedApplicationsPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.applications.eyebrow} title={t.applications.h1} description={t.applications.description} image="/images/catalog/page-6-image-3-1349x734.jpg" imageAlt={t.applications.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} />
      <section className="section">
        <div className="application-grid">
          {applications.map((application) => (
            <article key={application.slug} className="application-card">
              <Image src={application.image} width={620} height={390} alt={`${application.name} ${t.applications.heroAlt}`} />
              <div><h2>{application.name}</h2><p>{application.summary}</p><Link href={localizeHref(`/applications/${application.slug}`, locale)} className="text-link">{t.common.viewSolution} <ArrowRight size={16} aria-hidden /></Link></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function LocalizedIndustriesPage({ locale }: { locale: Locale }) {
  return (
    <>
      <PageHero
        eyebrow="Industry Solutions"
        title="Magnetic separation solutions by industry"
        description="Review practical magnetic separation layouts for recycling, mining, cement and aggregate, and food processing lines."
        image="/images/catalog/page-6-image-3-1349x734.jpg"
        imageAlt="Magnetic separation solutions for industrial applications"
        primaryHref={localizeHref("/request-quote", locale)}
        primaryLabel="Get a Quote"
        secondaryHref={localizeHref("/contact", locale)}
        secondaryLabel="Contact Us"
      />
      <section className="section">
        <div className="application-grid">
          {applications.map((application) => (
            <article key={application.industrySlug} className="application-card">
              <Image src={application.image} width={620} height={390} alt={application.imageAlt} />
              <div>
                <h2>{application.pageTitle}</h2>
                <p>{application.summary}</p>
                <Link href={localizeHref(`/industries/${application.industrySlug}`, locale)} className="text-link">
                  View industry solution <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function LocalizedApplicationDetailPage({ locale, application }: { locale: Locale; application: Application }) {
  const t = getDictionary(locale);
  const related = products.filter((product) => application.recommendedProducts.includes(product.name));
  return (
    <>
      {application.faqs?.length ? <JsonLd data={faqSchema(application.faqs)} /> : null}
      <section className="detail-hero">
        <div>
          <span className="eyebrow">{t.applications.eyebrow}</span>
          <h1>{application.pageTitle}</h1>
          <p>{application.summary}</p>
          {application.secondaryDescription ? <p>{application.secondaryDescription}</p> : null}
          <div className="hero-actions"><Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">Get a Quote</Link><Link href={localizeHref("/contact", locale)} className="btn btn-secondary">Contact Us</Link></div>
        </div>
        <div className="detail-image"><Image src={application.image} width={820} height={560} alt={application.imageAlt} priority /></div>
      </section>
      <section className="section detail-layout">
        <article className="detail-main">
          <ContentBlock title={t.applications.painPoints}><FeatureList items={application.painPoints} /></ContentBlock>
          <ContentBlock title="Problems We Solve"><IndustrySolutionGrid items={application.solutionPairs} /></ContentBlock>
          <ContentBlock title="Recommended Equipment"><IndustryEquipmentGrid items={application.equipment} /></ContentBlock>
          <ContentBlock title="Application Scenarios"><IndustryScenarioGrid application={application} /></ContentBlock>
          {application.table ? <ContentBlock title={application.table.title}><IndustryTable table={application.table} /></ContentBlock> : null}
          <ContentBlock title={t.applications.recommended}><div className="related-products">{related.map((product) => <Link href={localizeHref(`/products/${product.slug}`, locale)} key={product.slug}>{product.name}</Link>)}</div></ContentBlock>
          <ContentBlock title={t.productDetail.faq}><FaqList faqs={application.faqs} /></ContentBlock>
        </article>
        <aside className="quote-panel"><h2>{t.applications.quoteTitle}</h2><p>{t.applications.quoteText}</p><QuoteForm compact /></aside>
      </section>
      <section className="section industry-bottom-cta">
        <div>
          <span className="eyebrow">Selection Support</span>
          <h2>Need a Magnetic Separation Solution for Your Production Line?</h2>
          <p>Tell us your material type, belt width, installation height, and processing capacity. Our team will help you choose the right magnetic separator.</p>
        </div>
        <div className="hero-actions"><Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">Get a Quote</Link><Link href={localizeHref("/contact", locale)} className="btn btn-secondary">Contact Us</Link></div>
      </section>
    </>
  );
}

export function LocalizedAboutPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <PageHero eyebrow={t.about.eyebrow} title={t.about.h1} description={t.about.description} image="/images/generated/contact-support-cowinmagnet.png" imageAlt={t.about.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/products", locale)} secondaryLabel={t.common.viewProducts} />
      <section className="section section-split">
        <div><span className="eyebrow">{t.about.profileEyebrow}</span><h2>{site.legalName}</h2><p>{t.about.profileText1}</p><p>{t.about.profileText2}</p></div>
        <div className="value-grid">{t.advantages.slice(0, 3).map(([title, text]) => <article key={title} className="value-item"><ShieldCheck size={26} aria-hidden /><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="section section-muted">
        <div className="section-heading"><span className="eyebrow">{t.about.serviceEyebrow}</span><h2>{t.about.serviceTitle}</h2><p>{t.about.serviceText}</p></div>
        <div className="service-grid">
          {t.about.services.map((service, index) => {
            const Icon = serviceIcons[index] || ShieldCheck;
            return <article className="service-card" key={service}><Icon size={22} aria-hidden /><p>{service}</p></article>;
          })}
        </div>
      </section>
    </>
  );
}

export function LocalizedContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.contact.eyebrow} title={t.contact.h1} description={t.contact.description} image="/images/generated/contact-support-cowinmagnet.png" imageAlt={t.contact.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} />
      <section className="section map-section"><GoogleMapCard title="Find COWIN MAGNET in Quzhou, China" /></section>
      <section className="section contact-layout">
        <div className="contact-info"><h2>{t.contact.infoTitle}</h2><a href={`mailto:${site.email}`}><Mail size={18} aria-hidden />{site.email}</a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow"><MessageCircle size={18} aria-hidden />WhatsApp: {site.whatsapp}</a><a href={`tel:${site.phone.replaceAll(" ", "")}`}><Phone size={18} aria-hidden />{site.phone}</a><span><MapPin size={18} aria-hidden />{site.address}</span><p>{t.contact.fastTip}</p></div>
        <QuoteForm />
      </section>
    </>
  );
}

export function LocalizedRequestQuotePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.requestQuote.eyebrow} title={t.requestQuote.h1} description={t.requestQuote.description} image="/images/catalog/page-4-image-9-1537x1023.jpg" imageAlt={t.requestQuote.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/products", locale)} secondaryLabel={t.common.viewProducts} />
      <section className="section quote-page"><div className="section-heading align-left"><span className="eyebrow">{t.requestQuote.formEyebrow}</span><h2>{t.requestQuote.formTitle}</h2><p>{t.requestQuote.formText}</p></div><QuoteForm /></section>
    </>
  );
}

export function LocalizedSimplePage({ locale, page }: { locale: Locale; page: "factory" | "projects" }) {
  const t = getDictionary(locale);
  const data = t[page];
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.h1} description={data.description} image={page === "factory" ? "/images/generated/about-factory-team-cowinmagnet.png" : "/images/generated/recycling-application-cowinmagnet.png"} imageAlt={data.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/products", locale)} secondaryLabel={t.common.viewProducts} />
      <section className="section">
        <div className="advantage-grid">
          {t.advantages.map(([title, text]) => <article key={title} className="advantage-item"><BadgeCheck size={26} aria-hidden /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </>
  );
}

export function LocalizedBlogListPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.blog.eyebrow} title={t.blog.h1} description={t.blog.description} image="/images/generated/recycling-application-cowinmagnet.png" imageAlt={t.blog.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/request-quote", locale)} secondaryLabel={t.common.sendRequirements} />
      <section className="section blog-list-section">
        <div className="section-heading align-left"><span className="eyebrow">{t.blog.hubEyebrow}</span><h2>{t.blog.hubTitle}</h2><p>{t.blog.hubText}</p></div>
        <div className="blog-grid">{blogPosts.map((post) => <article className="blog-card" key={post.slug}><Link href={localizeHref(`/blog/${post.slug}`, locale)} className="blog-card-image"><DateBadge date={post.publishedAt} /><Image src={post.image} width={760} height={460} alt={post.title} /></Link><div className="blog-card-body"><div className="blog-card-meta"><span>{post.category}</span><span>{post.readingTime} {t.common.minRead}</span></div><h3><Link href={localizeHref(`/blog/${post.slug}`, locale)}>{post.title}</Link></h3><p>{post.excerpt}</p><Link href={localizeHref(`/blog/${post.slug}`, locale)} className="text-link">{t.common.readArticle} <ArrowRight size={16} aria-hidden /></Link></div></article>)}</div>
      </section>
    </>
  );
}

export function LocalizedBlogDetailPage({ locale, post }: { locale: Locale; post: (typeof blogPosts)[number] }) {
  const t = getDictionary(locale);
  const relatedInternalLinks = getStaticInternalLinkSuggestions({ type: "blog", slug: post.slug, limit: 5 });
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.metaDescription, image: absoluteUrl(post.image), datePublished: post.publishedAt, dateModified: post.updatedAt, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo.jpg") } } }} />
      <section className="blog-hero"><div className="blog-hero-copy"><span className="eyebrow">{post.category}</span><h1>{post.h1}</h1><p>{post.excerpt}</p><div className="blog-meta"><span>{t.common.updated} {new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(`${post.updatedAt}T00:00:00Z`))}</span><span>{post.readingTime} {t.common.minRead}</span></div></div><div className="blog-hero-image"><Image src={post.image} width={980} height={620} alt={post.title} priority /></div></section>
      <section className="section blog-detail-layout"><article className="blog-article"><MarkdownContent content={post.content} /></article><aside className="blog-sidebar"><div className="blog-quote-card"><span className="eyebrow">{t.footer.quoteSupport}</span><h2>{t.blog.sidebarTitle}</h2><p>{t.blog.sidebarText}</p></div><div className="quote-form-shell blog-form-shell"><h3>{t.common.requestSelectionSupport}</h3><p>{t.productDetail.quoteText}</p><QuoteForm compact /></div></aside></section>
      <RelatedInternalLinks locale={locale} eyebrow="Recommended Reading" title="Related products, solutions and articles" links={relatedInternalLinks} />
    </>
  );
}

function ContentBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="content-block"><h2>{title}</h2>{children}</div>;
}

function FeatureList({ items }: { items: string[] }) {
  return <ul className="feature-list">{items.map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden />{item}</li>)}</ul>;
}

function TagList({ items }: { items: string[] }) {
  return <div className="tag-list">{items.map((item) => <span key={item}>{item}</span>)}</div>;
}

function IndustrySolutionGrid({ items }: { items: Application["solutionPairs"] }) {
  return (
    <div className="industry-solution-grid">
      {items.map((item, index) => (
        <article key={item.issue}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{item.issue}</h3>
          <strong>{item.solution}</strong>
          <p>{item.note}</p>
        </article>
      ))}
    </div>
  );
}

function IndustryEquipmentGrid({ items }: { items: Application["equipment"] }) {
  return (
    <div className="industry-equipment-grid">
      {items.map((item) => (
        <article key={item.name}>
          <h3>{item.name}</h3>
          <p>{item.usage}</p>
        </article>
      ))}
    </div>
  );
}

function IndustryScenarioGrid({ application }: { application: Application }) {
  return (
    <div className={`industry-scenario-grid scenario-count-${application.scenarios.length}`}>
      {application.scenarios.map((scenario) => (
        <article
          key={scenario}
          className={`industry-scenario-card${application.slug === "mining" ? " is-material-scenario" : ""}`}
        >
          <Image
            src={application.scenarioImages?.[scenario] || application.image}
            width={420}
            height={260}
            alt={`${scenario} magnetic separation application`}
          />
          <div>
            <span>{application.name}</span>
            <h3>{scenario}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}

function IndustryTable({ table }: { table: NonNullable<Application["table"]> }) {
  return (
    <div className="industry-table-wrap">
      <table className="industry-table">
        <thead>
          <tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join("-")}>{row.map((cell, index) => <td key={`${cell}-${index}`}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecTable({ specs }: { specs: Product["specs"] }) {
  return <div className="spec-table">{specs.map((spec) => <div key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}</div>;
}

function FaqList({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return <div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>;
}
