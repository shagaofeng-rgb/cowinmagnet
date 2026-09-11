import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Globe2, Headphones, Mail, MapPin, MessageCircle, Phone, Settings, ShieldCheck, Truck, Wrench } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import { BlogImage } from "@/components/BlogImage";
import { GlobalCustomerNetwork } from "@/components/GlobalCustomerNetwork";
import { HomeVideoShowcase } from "@/components/HomeVideoShowcase";
import { JsonLd } from "@/components/JsonLd";
import { DateBadge } from "@/components/DateBadge";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { MarkdownContent } from "@/components/MarkdownContent";
import { PageHero } from "@/components/PageHero";
import { PaginationNav } from "@/components/PaginationNav";
import { QuoteForm } from "@/components/QuoteForm";
import { ProductDetailExperience } from "@/components/ProductDetailExperience";
import { RelatedInternalLinks } from "@/components/RelatedInternalLinks";
import { applications, type Application } from "@/data/applications";
import type { BlogPost } from "@/data/blogs";
import { productCategories, products, type Product } from "@/data/products";
import { categoryAnchor } from "@/lib/anchors";
import { site } from "@/data/site";
import { absoluteUrl, breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import { getDictionary, localizeHref } from "@/lib/i18n";
import { getStaticInternalLinkSuggestions } from "@/lib/linkStrategy";
import { cleanProductList, cleanProductSpecs, cleanProductText } from "@/lib/productDisplay";
import { isIndexableBlog, stripLegacyEditorialSections } from "@/lib/blogContentPolicy";

const advantageIcons = [ShieldCheck, Settings, Headphones, Globe2];
const serviceIcons = [Headphones, Wrench, Truck, ShieldCheck, BadgeCheck, Globe2];
const homeProductCards = [
  { slug: "suspended-permanent-magnetic-separator", title: "Suspended Magnets", description: "Remove ferrous metals from bulk materials." },
  { slug: "magnetic-head-pulley", title: "Magnetic Pulleys", description: "Continuous iron removal in conveyor systems." },
  { slug: "dry-drum-magnetic-separator", title: "Drum Magnetic Separators", description: "Efficient separation for wet and dry materials." },
  { slug: "magnetic-grid", title: "Magnetic Bars & Grates", description: "Protect equipment and improve product purity." },
  { slug: "rcdb-type-self-cooling-plate-electromagnetic-iron-remover", title: "Magnetic Plates & Chutes", description: "Simple, effective iron removal." },
  { slug: "suspended-electromagnetic-conveyor-belt-separator", title: "Customized Solutions", description: "Tailored designs for your specific needs." }
];

const homeIndustryTiles = [
  { title: "Mining", href: "/industries/mining", image: "/images/industries/mining-scenarios/iron-ore.jpg", alt: "Iron ore mining magnetic separation application", size: "large" },
  { title: "Recycling", href: "/industries/recycling", image: "/images/industries/recycling-scenarios/non-metal-recycling-sorting-line.jpg", alt: "Recycling magnetic separation application", size: "large" },
  { title: "Cement", href: "/industries/cement-aggregate", image: "/images/industries/cement-aggregate-scenarios/cement-raw-material-processing.jpg", alt: "Cement magnetic separation application", size: "small" },
  { title: "Power Generation", href: "/industries", image: "/images/catalog/page-6-image-3-1349x734.jpg", alt: "Industrial bulk material handling application", size: "small" },
  { title: "Aggregates", href: "/industries/cement-aggregate", image: "/images/industries/cement-aggregate-scenarios/finished-aggregate-purification.jpg", alt: "Aggregate processing magnetic separation application", size: "small" },
  { title: "Other Industries", href: "/industries", image: "/images/industries/recycling-scenarios/construction-waste-recycling-line.jpg", alt: "Industrial magnetic separation application", size: "small" }
];

export function LocalizedHomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const featured = homeProductCards.flatMap((card) => {
    const product = products.find((item) => item.slug === card.slug);
    return product ? [{ ...card, product }] : [];
  });
  const categoryCards = productCategories.map((category) => ({
    title: category,
    count: products.filter((product) => product.category === category).length,
    href: localizeHref(`/products#${categoryAnchor(category)}`, locale)
  }));

  return (
    <main className="localized-home">
      <section className="home-hero industrial-hero">
        <Image src="/images/generated/home-hero-cowinmagnet.webp" fill sizes="100vw" alt={t.home.heroAlt} className="hero-banner-image" priority />
        <div className="hero-copy">
          <span className="eyebrow industrial-kicker">{locale === "en" ? "Global OEM/ODM Partner" : t.home.heroEyebrow}</span>
          {locale === "en" ? <h1 className="template-hero-title">Magnetic<br />Separation<br />for a <em>Cleaner,</em><br /><em>Stronger Tomorrow</em></h1> : <h1>{t.home.h1}</h1>}
          <p>{t.home.heroText}</p>
          <div className="hero-actions">
            <Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">{t.common.getQuote}</Link>
            <Link href={localizeHref("/products", locale)} className="btn btn-secondary">{locale === "en" ? "Explore Products" : t.common.viewProducts}</Link>
          </div>
        </div>
        <p className="industrial-hero-slogan" aria-hidden="true">Metal<br />out.<br /><strong>Purity in.</strong></p>
        <div className="industrial-hero-proof" aria-label={t.home.whyTitle}>
          <article><Globe2 size={26} aria-hidden /><strong>OEM/ODM<br />for global buyers</strong></article>
          <article><Settings size={26} aria-hidden /><strong>Reliable industrial<br />solutions</strong></article>
          <article><ShieldCheck size={26} aria-hidden /><strong>Focused on your<br />separation challenges</strong></article>
          <article><Headphones size={26} aria-hidden /><strong>Responsive support<br />worldwide</strong></article>
        </div>
      </section>

      <section className="section industrial-products-section" aria-labelledby="industrial-products-title">
        <div className="section-heading industrial-section-heading">
          <span className="eyebrow">{t.home.featuredEyebrow}</span>
          <h2 id="industrial-products-title">{locale === "en" ? "Find the right magnetic separator" : t.home.featuredTitle}</h2>
          <div><p>{locale === "en" ? "A complete range of magnetic separation equipment for different industries and applications." : t.home.applicationText}</p><Link href={localizeHref("/products", locale)} className="text-link">{locale === "en" ? "View All Products" : t.common.viewProducts} <ArrowRight size={16} aria-hidden /></Link></div>
        </div>
        <nav className="industrial-category-nav" aria-label="Product categories">
          <Link href={localizeHref("/products", locale)} className="is-active">{locale === "en" ? "All Products" : t.common.viewProducts}</Link>
          <Link href={categoryCards[0]?.href || localizeHref("/products", locale)}>Suspended Magnets</Link>
          <Link href={localizeHref("/products/magnetic-head-pulley", locale)}>Magnetic Pulleys</Link>
          <Link href={categoryCards[1]?.href || localizeHref("/products", locale)}>Magnetic Separators</Link>
          <Link href={categoryCards[3]?.href || localizeHref("/products", locale)}>Magnetic Bars</Link>
          <Link href={localizeHref("/request-quote", locale)}>Customized Solutions</Link>
        </nav>
        <div className="template-product-grid">
          {featured.map(({ product, title, description }) => <article className="template-product-card" key={product.slug}>
            <Link href={localizeHref(`/products/${product.slug}`, locale)} className="template-product-image"><Image src={product.image} width={400} height={300} sizes="(max-width: 700px) 82vw, (max-width: 1100px) 30vw, 16vw" alt={product.name} loading="lazy" /></Link>
            <div><h3><Link href={localizeHref(`/products/${product.slug}`, locale)}>{title}</Link></h3><p>{description}</p><Link href={localizeHref(`/products/${product.slug}`, locale)} className="text-link">{locale === "en" ? "View Products" : t.common.viewProduct} <ArrowRight size={14} aria-hidden /></Link></div>
          </article>)}
        </div>
      </section>

      <section className="industrial-industry-section" aria-labelledby="industrial-industry-title">
        <div className="industrial-industry-heading">
          <span className="eyebrow">{t.home.applicationEyebrow}</span>
          <h2 id="industrial-industry-title">{locale === "en" ? "Proven in real-world industries" : t.home.applicationTitle}</h2>
          <p>{t.home.applicationText}</p>
          <Link href={localizeHref("/industries", locale)} className="btn btn-secondary">{locale === "en" ? "Explore by Industry" : t.common.viewSolution} <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div className="industrial-industry-grid">
          {homeIndustryTiles.map((industry) => (
            <Link key={industry.title} href={localizeHref(industry.href, locale)} className={`industrial-industry-card industrial-industry-card-${industry.size}`}>
              <Image src={industry.image} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 22vw" alt={industry.alt} loading="lazy" />
              <span>{industry.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section industrial-video-quote" aria-labelledby="industrial-video-title">
        <div className="industrial-video-stack">
          <HomeVideoShowcase eyebrow={locale === "en" ? "Industries Video" : t.home.videoEyebrow} title={locale === "en" ? "See COWIN MAGNET in action" : t.home.videoTitle} />
          <article className="template-service-card">
            <div><span className="eyebrow">Service &amp; Support</span><h2>From inquiry to operation,<br />we&apos;re with you</h2><p>Technical consultation, customized design, manufacturing, and after-sales support — all in one place.</p><Link href={localizeHref("/contact", locale)} className="btn btn-secondary">Contact Support <ArrowRight size={16} aria-hidden /></Link></div>
            <Image src="/images/generated/contact-support-cowinmagnet.png" width={760} height={520} sizes="(max-width: 700px) 100vw, 32vw" alt="Cowinmagnet technical service team" loading="lazy" />
          </article>
        </div>
        <aside className="industrial-quote-card">
          <span className="eyebrow">{locale === "en" ? "Get a Quote" : t.home.quoteEyebrow}</span>
          <h2 id="industrial-video-title">{locale === "en" ? "Tell us about your project" : t.home.quoteTitle}</h2>
          <QuoteForm compact variant="home" />
        </aside>
      </section>
    </main>
  );
}

export function LocalizedProductsPage({
  locale,
  productList = products,
  categoryList = productCategories,
  heroOnly = false
}: {
  locale: Locale;
  productList?: Product[];
  categoryList?: string[];
  heroOnly?: boolean;
}) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.products.eyebrow} title={t.products.h1} description={t.products.description} image="/images/catalog/page-3-image-9-1871x840.jpg" imageAlt={t.products.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/request-quote", locale)} secondaryLabel={t.common.requestSelectionSupport} />
      {heroOnly ? null : <section className="section">
        {categoryList.map((category) => (
          <div className="product-category-block" id={categoryAnchor(category)} key={category}>
            <div className="section-heading align-left"><span className="eyebrow">{category}</span><h2>{category}</h2></div>
            <div className="product-grid">
              {productList.filter((product) => product.category === category).map((product) => <LocalizedProductCard key={product.slug} product={product} locale={locale} />)}
            </div>
          </div>
        ))}
      </section>}
    </>
  );
}

export function LocalizedProductDetailPage({ locale, product }: { locale: Locale; product: Product }) {
  return <ProductDetailExperience locale={locale} product={product} />;
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
              <div><h2>{application.name}</h2><p>{application.summary}</p><Link href={localizeHref(`/industries/${application.industrySlug || application.slug}`, locale)} className="text-link">{t.common.viewSolution} <ArrowRight size={16} aria-hidden /></Link></div>
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
        <div className="contact-info"><h2>{t.contact.infoTitle}</h2><a href={`mailto:${site.email}`}><Mail size={18} aria-hidden />{site.email}</a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="contact-page" data-whatsapp-component="localized-contact-page"><MessageCircle size={18} aria-hidden />WhatsApp: {site.whatsapp}</a><a href={`tel:${site.phone.replaceAll(" ", "")}`}><Phone size={18} aria-hidden />{site.phone}</a><span><MapPin size={18} aria-hidden />{site.address}</span><p>{t.contact.fastTip}</p></div>
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

export function LocalizedBlogListPage({ locale, posts, pagination }: { locale: Locale; posts: BlogPost[]; pagination?: { currentPage: number; totalPages: number; totalItems: number } }) {
  const t = getDictionary(locale);
  const startItem = pagination && pagination.totalItems ? (pagination.currentPage - 1) * 9 + 1 : 0;
  const endItem = pagination ? Math.min(pagination.totalItems, pagination.currentPage * 9) : posts.length;
  return (
    <>
      <PageHero eyebrow={t.blog.eyebrow} title={t.blog.h1} description={t.blog.description} image="/images/generated/recycling-application-cowinmagnet.png" imageAlt={t.blog.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/request-quote", locale)} secondaryLabel={t.common.sendRequirements} />
      <section className="section blog-list-section">
        <div className="section-heading align-left"><span className="eyebrow">{t.blog.hubEyebrow}</span><h2>{t.blog.hubTitle}</h2><p>{t.blog.hubText}</p></div>
        {pagination ? <div className="catalog-list-summary"><p>{startItem}-{endItem} of {pagination.totalItems} articles</p></div> : null}
        <div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post.slug}><Link href={localizeHref(`/blog/${post.slug}`, locale)} className="blog-card-image"><DateBadge date={post.publishedAt} /><BlogImage src={post.image} width={760} height={460} alt={post.title} /></Link><div className="blog-card-body"><div className="blog-card-meta"><span>{post.category}</span><span>{post.readingTime} {t.common.minRead}</span></div><h3><Link href={localizeHref(`/blog/${post.slug}`, locale)}>{post.title}</Link></h3><p>{post.excerpt}</p><Link href={localizeHref(`/blog/${post.slug}`, locale)} className="text-link">{t.common.readArticle} <ArrowRight size={16} aria-hidden /></Link></div></article>)}</div>
        {pagination ? <PaginationNav currentPage={pagination.currentPage} totalPages={pagination.totalPages} hrefForPage={(page) => page > 1 ? `${localizeHref("/blog", locale)}?page=${page}` : localizeHref("/blog", locale)} label="Blog pagination" summary={`Page ${pagination.currentPage} of ${pagination.totalPages}`} /> : null}
      </section>
    </>
  );
}

export function LocalizedBlogDetailPage({ locale, post }: { locale: Locale; post: BlogPost }) {
  const t = getDictionary(locale);
  const indexable = isIndexableBlog(post);
  const relatedInternalLinks = indexable ? getStaticInternalLinkSuggestions({ type: "blog", slug: post.slug, limit: 5 }) : [];
  const publicContent = stripLegacyEditorialSections(post.content);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.metaDescription, image: absoluteUrl(post.image), datePublished: post.publishedAt, dateModified: post.updatedAt, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/images/cowin-logo.png") } } }} />
      <section className="blog-hero"><div className="blog-hero-copy"><span className="eyebrow">{post.category}</span><h1>{post.h1}</h1><p>{post.excerpt}</p><div className="blog-meta"><span>{t.common.updated} {new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(`${post.updatedAt}T00:00:00Z`))}</span><span>{post.readingTime} {t.common.minRead}</span></div></div><div className="blog-hero-image"><BlogImage src={post.image} width={980} height={620} alt={post.title} priority /></div></section>
      <section className="section blog-detail-layout"><article className="blog-article"><MarkdownContent content={publicContent} /></article><aside className="blog-sidebar"><div className="blog-quote-card"><span className="eyebrow">{t.footer.quoteSupport}</span><h2>{t.blog.sidebarTitle}</h2><p>{t.blog.sidebarText}</p></div><div className="quote-form-shell blog-form-shell"><h3>{t.common.requestSelectionSupport}</h3><p>{t.productDetail.quoteText}</p><QuoteForm compact /></div></aside></section>
      {relatedInternalLinks.length ? <RelatedInternalLinks locale={locale} eyebrow="Recommended Reading" title="Related products, solutions and articles" links={relatedInternalLinks} /> : null}
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
