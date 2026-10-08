import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, Globe2, Headphones, Mail, MapPin, MessageCircle, Phone, Settings, ShieldCheck, Truck, Wrench } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import { BlogImage } from "@/components/BlogImage";
import { GlobalCustomerNetwork } from "@/components/GlobalCustomerNetwork";
import { HomeVideoShowcase } from "@/components/HomeVideoShowcase";
import { HomeProductShowcase } from "@/components/HomeProductShowcase";
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
import { getPublicUi } from "@/lib/publicUi";
import { getArticleLabels } from "@/lib/articleLocale";
import { getOriginalContentLabels } from "@/lib/contentOriginalLocale";
import { getStaticInternalLinkSuggestions } from "@/lib/linkStrategy";
import { cleanProductList, cleanProductSpecs, cleanProductText } from "@/lib/productDisplay";
import { isIndexableBlog, stripLegacyEditorialSections } from "@/lib/blogContentPolicy";

const advantageIcons = [ShieldCheck, Settings, Headphones, Globe2];
const serviceIcons = [Headphones, Wrench, Truck, ShieldCheck, BadgeCheck, Globe2];
const homeProductCards = [
  { slug: "suspended-permanent-magnetic-separator" },
  { slug: "magnetic-head-pulley" },
  { slug: "dry-drum-magnetic-separator" },
  { slug: "magnetic-grid" },
  { slug: "rcdb-type-self-cooling-plate-electromagnetic-iron-remover" },
  { slug: "suspended-electromagnetic-conveyor-belt-separator" }
];

const homeIndustryTiles = [
  { href: "/industries/mining", image: "/images/industries/mining-industry-magnetic-separation-cover-clean-20261001-cowin-brand-20261001.webp", alt: "Mining material conveyor" },
  { href: "/industries/recycling", image: "/images/industries/recycling-industry-magnetic-separation-cover-clean-20261001-cowin-brand-20261001.webp", alt: "Recycling sorting line" },
  { href: "/industries/cement-aggregate", image: "/images/generated/home-industry-cement-20261009-cowin-brand.webp", alt: "Illustration of cement plant bulk material handling" },
  { href: "/industries", image: "/images/generated/home-industry-power-20261009-cowin-brand.webp", alt: "Illustration of power generation material handling" },
  { href: "/industries/cement-aggregate", image: "/images/generated/home-industry-aggregates-20261009-cowin-brand.webp", alt: "Illustration of aggregate processing stockpile" },
  { href: "/industries", image: "/images/industries/recycling-scenarios/construction-waste-recycling-line-cowin-brand-20261001.jpg", alt: "Industrial material handling conveyor" }
];

export function LocalizedHomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const featured = homeProductCards.flatMap((card, cardIndex) => {
    const product = products.find((item) => item.slug === card.slug);
    return product ? [{ ...card, product, cardIndex }] : [];
  });
  return (
    <main className="localized-home home-option-two">
      <section className="home2-hero" aria-labelledby="home2-title">
        <div className="home2-hero-copy">
          <span className="home2-eyebrow">{locale === "en" ? "Global OEM/ODM Partner" : t.home.heroEyebrow}</span>
          {locale === "en" ? <h1 id="home2-title"><span>Magnetic</span><span>Separation for a</span><span className="home2-accent">Cleaner,</span><span className="home2-accent home2-overlap">Stronger Tomorrow</span></h1> : <h1 id="home2-title">{t.home.h1}</h1>}
          <p>{t.home.heroText}</p>
          <div className="home2-actions">
            <Link href={localizeHref("/products", locale)} className="home2-button home2-button-primary">{locale === "en" ? "Explore Products" : t.common.viewProducts} <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link href={localizeHref("/request-quote", locale)} className="home2-button home2-button-outline">{t.common.getQuote}</Link>
          </div>
        </div>
        <div className="home2-hero-art">
          <Image src="/images/generated/home-hero-option-two-branded-20261009.webp" fill sizes="(max-width: 760px) 100vw, 62vw" alt={t.home.heroAlt} priority fetchPriority="high" />
          <p className="home2-metal-slogan" aria-hidden="true">{ui.homeSlogan[0]}<br />{ui.homeSlogan[1]}<br />{ui.homeSlogan[2]}</p>
          <p className="home2-hero-signature" aria-hidden="true"><strong>COWIN MAGNET</strong><span>MAGNETIC SOLUTIONS<br />FOR A BRIGHTER INDUSTRY</span></p>
        </div>
        <div className="home2-hero-proof" aria-label={t.home.whyTitle}>
          {[Settings, BadgeCheck, ShieldCheck, Headphones].map((Icon, index) => <div key={index}><Icon size={25} aria-hidden="true" /><span>{ui.homeProof[index]}</span></div>)}
        </div>
      </section>

      <section className="home2-products" aria-labelledby="home2-products-title">
        <div className="home2-container">
          <div className="home2-section-head">
            <div><span className="home2-eyebrow">{locale === "en" ? "Our Products" : t.home.featuredEyebrow}</span><h2 id="home2-products-title">{locale === "en" ? <>Explore Our Magnetic<br />Separation Equipment</> : t.home.featuredTitle}</h2></div>
            <p>{locale === "en" ? "A complete range of magnetic separation equipment for different industries and applications." : t.home.applicationText}</p>
          </div>
          <HomeProductShowcase locale={locale} cards={featured.map(({ product, cardIndex }) => ({ slug: product.slug, image: product.image, title: ui.homeCards[cardIndex][0], summary: ui.homeCards[cardIndex][1] }))} />
        </div>
      </section>

      <section className="home2-industries" aria-labelledby="home2-industry-title">
        <div className="home2-container home2-industry-layout">
          <div className="home2-industry-copy">
            <span className="home2-eyebrow">{locale === "en" ? "Industries We Serve" : t.home.applicationEyebrow}</span>
            <h2 id="home2-industry-title">{locale === "en" ? <>Proven in<br />real-world industries</> : t.home.applicationTitle}</h2>
            <p>{t.home.applicationText}</p>
            <Link href={localizeHref("/industries", locale)} className="home2-button home2-button-outline">{locale === "en" ? "Explore by Industry" : t.common.viewSolution} <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="home2-industry-grid">
            {homeIndustryTiles.map((industry, index) => <Link key={industry.image} href={localizeHref(industry.href, locale)} className="home2-industry-tile">
              <Image src={industry.image} fill sizes="(max-width: 760px) 46vw, 20vw" alt={industry.alt} loading="lazy" />
              <span>{ui.homeIndustries[index]}</span>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="home2-video-quote" aria-label={t.home.videoTitle}>
        <div className="home2-container home2-video-layout">
          <HomeVideoShowcase eyebrow={locale === "en" ? "Cowin Magnet in Action" : t.home.videoEyebrow} title={locale === "en" ? "See our magnetic solutions in action" : t.home.videoTitle} locale={locale} />
          <aside className="home2-quote-card">
            <span className="home2-eyebrow">{locale === "en" ? "Get a Quote" : t.home.quoteEyebrow}</span>
            <h2>{locale === "en" ? "Tell us about your project" : t.home.quoteTitle}</h2>
            <QuoteForm compact variant="home" />
          </aside>
        </div>
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
      <PageHero eyebrow={t.products.eyebrow} title={t.products.h1} description={t.products.description} image="/images/catalog/page-3-image-9-1871x840-cowin-brand-20261001.jpg" imageAlt={t.products.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/request-quote", locale)} secondaryLabel={t.common.requestSelectionSupport} />
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
  const ui = getPublicUi(locale);
  return (
    <>
      <PageHero eyebrow={t.applications.eyebrow} title={t.applications.h1} description={t.applications.description} image="/images/catalog/page-6-image-3-1349x734-cowin-brand-20261001.jpg" imageAlt={t.applications.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} />
      <section className="section">
        <div className="application-grid">
          {applications.map((application, index) => (
            <article key={application.slug} className="application-card">
              <Image src={application.image} width={620} height={390} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 31vw" alt={`${ui.industryMenu[index]?.[0] || application.name} ${t.applications.heroAlt}`} />
              <div><h2>{ui.industryMenu[index]?.[0] || application.name}</h2><p>{ui.industryMenu[index]?.[1] || application.summary}</p><Link href={localizeHref(`/industries/${application.industrySlug || application.slug}`, locale)} className="text-link">{t.common.viewSolution} <ArrowRight size={16} aria-hidden /></Link></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function LocalizedIndustriesPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  return (
    <>
      <PageHero
        eyebrow={ui.industrySolutions}
        title={ui.industryHeadline}
        description={t.applications.description}
        image="/images/catalog/page-6-image-3-1349x734-cowin-brand-20261001.jpg"
        imageAlt={t.applications.heroAlt}
        primaryHref={localizeHref("/request-quote", locale)}
        primaryLabel={t.common.getQuote}
        secondaryHref={localizeHref("/contact", locale)}
        secondaryLabel={ui.contact}
      />
      <section className="section">
        <div className="application-grid">
          {applications.map((application, index) => (
            <article key={application.industrySlug} className="application-card">
              <Image src={application.image} width={620} height={390} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 31vw" alt={`${ui.industryMenu[index]?.[0] || application.pageTitle} ${t.applications.heroAlt}`} />
              <div>
                <h2>{ui.industryMenu[index]?.[0] || application.pageTitle}</h2>
                <p>{ui.industryMenu[index]?.[1] || application.summary}</p>
                <Link href={localizeHref(`/industries/${application.industrySlug}`, locale)} className="text-link">
                  {t.common.viewSolution} <ArrowRight size={16} aria-hidden />
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
  const ui = getPublicUi(locale);
  const related = products.filter((product) => application.recommendedProducts.includes(product.name));
  const industryIndex = applications.findIndex((item) => item.industrySlug === application.industrySlug);
  const industryName = ui.industryMenu[industryIndex]?.[0] || application.name;
  const industrySummary = ui.industryMenu[industryIndex]?.[1] || application.summary;
  const original = getOriginalContentLabels(locale);

  if (locale !== "en") {
    return <>
      <section className="detail-hero">
        <div><span className="eyebrow">{ui.industrySolutions}</span><h1>{industryName}</h1><p>{industrySummary}</p><p>{t.applications.description}</p><div className="hero-actions"><Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">{t.common.getQuote}</Link><Link href={localizeHref("/contact", locale)} className="btn btn-secondary">{ui.contact}</Link></div></div>
        <div className="detail-image"><Image src={application.image} width={820} height={560} sizes="(max-width: 900px) 100vw, 52vw" alt={`${industryName} — ${t.applications.heroAlt}`} priority /></div>
      </section>
      <section className="section detail-layout">
        <article className="detail-main">
          <ContentBlock title={t.applications.recommended}><p>{industrySummary}</p><div className="related-products">{related.map((product) => <Link href={localizeHref(`/products/${product.slug}`, locale)} key={product.slug} lang="en">{product.name}</Link>)}</div><p>{original.industry} <Link href={`/en/industries/${application.industrySlug}`} hrefLang="en">{original.link}</Link></p></ContentBlock>
          <ContentBlock title={t.productDetail.ctaTitle}><p>{t.applications.quoteText}</p></ContentBlock>
        </article>
        <aside className="quote-panel"><h2>{t.applications.quoteTitle}</h2><p>{t.applications.quoteText}</p><QuoteForm compact /></aside>
      </section>
    </>;
  }
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
        <div className="detail-image"><Image src={application.image} width={820} height={560} sizes="(max-width: 900px) 100vw, 52vw" alt={application.imageAlt} priority /></div>
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
      <PageHero eyebrow={t.about.eyebrow} title={t.about.h1} description={t.about.description} image="/images/generated/contact-support-cowinmagnet-clean-20261001-cowin-brand-20261001.webp" imageAlt={t.about.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/products", locale)} secondaryLabel={t.common.viewProducts} />
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
      <PageHero eyebrow={t.contact.eyebrow} title={t.contact.h1} description={t.contact.description} image="/images/generated/contact-support-cowinmagnet-clean-20261001-cowin-brand-20261001.webp" imageAlt={t.contact.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} />
      <section className="section map-section"><GoogleMapCard locale={locale} /></section>
      <section className="section contact-layout">
        <div className="contact-info"><h2>{t.contact.infoTitle}</h2><a href={`mailto:${site.email}`}><Mail size={18} aria-hidden />{site.email}</a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="contact-page" data-whatsapp-component="localized-contact-page"><MessageCircle size={18} aria-hidden />WhatsApp: {site.whatsapp}</a><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="contact-phone" data-whatsapp-component="localized-contact-page"><Phone size={18} aria-hidden />{site.phone}</a><a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer nofollow"><MapPin size={18} aria-hidden />{site.address}</a><p>{t.contact.fastTip}</p></div>
        <QuoteForm />
      </section>
    </>
  );
}

export function LocalizedRequestQuotePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero eyebrow={t.requestQuote.eyebrow} title={t.requestQuote.h1} description={t.requestQuote.description} image="/images/catalog/page-4-image-9-1537x1023-cowin-brand-20261001.jpg" imageAlt={t.requestQuote.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/products", locale)} secondaryLabel={t.common.viewProducts} />
      <section className="section quote-page"><div className="section-heading align-left"><span className="eyebrow">{t.requestQuote.formEyebrow}</span><h2>{t.requestQuote.formTitle}</h2><p>{t.requestQuote.formText}</p></div><QuoteForm /></section>
    </>
  );
}

export function LocalizedSimplePage({ locale, page }: { locale: Locale; page: "factory" | "projects" }) {
  const t = getDictionary(locale);
  const data = t[page];
  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.h1} description={data.description} image={page === "factory" ? "/images/generated/about-factory-team-cowinmagnet-clean-20261001-cowin-brand-20261001.webp" : "/images/generated/recycling-application-cowinmagnet-clean-20261001-cowin-brand-20261001.webp"} imageAlt={data.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/products", locale)} secondaryLabel={t.common.viewProducts} />
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
  const ui = getPublicUi(locale);
  const startItem = pagination && pagination.totalItems ? (pagination.currentPage - 1) * 9 + 1 : 0;
  const endItem = pagination ? Math.min(pagination.totalItems, pagination.currentPage * 9) : posts.length;
  return (
    <>
      <PageHero eyebrow={t.blog.eyebrow} title={t.blog.h1} description={t.blog.description} image="/images/generated/recycling-application-cowinmagnet-clean-20261001-cowin-brand-20261001.webp" imageAlt={t.blog.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/request-quote", locale)} secondaryLabel={t.common.sendRequirements} />
      <section className="section blog-list-section">
        <div className="section-heading align-left"><span className="eyebrow">{t.blog.hubEyebrow}</span><h2>{t.blog.hubTitle}</h2><p>{t.blog.hubText}</p></div>
        {locale !== "en" ? <p>{ui.news[8]}</p> : null}
        {pagination ? <div className="catalog-list-summary"><p>{startItem}–{endItem} / {pagination.totalItems}</p></div> : null}
        <div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post.slug}><Link href={localizeHref(`/blog/${post.slug}`, locale)} className="blog-card-image"><DateBadge date={post.publishedAt} /><BlogImage src={post.image} width={760} height={460} alt={post.title} /></Link><div className="blog-card-body"><div className="blog-card-meta"><span lang="en">{post.category}</span><span>{post.readingTime} {t.common.minRead}</span></div><h3 lang="en"><Link href={localizeHref(`/blog/${post.slug}`, locale)}>{post.title}</Link></h3><p lang="en">{post.excerpt}</p><Link href={localizeHref(`/blog/${post.slug}`, locale)} className="text-link">{t.common.readArticle} <ArrowRight size={16} aria-hidden /></Link></div></article>)}</div>
        {pagination ? <PaginationNav currentPage={pagination.currentPage} totalPages={pagination.totalPages} hrefForPage={(page) => page > 1 ? `${localizeHref("/blog", locale)}?page=${page}` : localizeHref("/blog", locale)} label={t.nav.blog} summary={`${ui.page} ${pagination.currentPage} / ${pagination.totalPages}`} locale={locale} /> : null}
      </section>
    </>
  );
}

export function LocalizedBlogDetailPage({ locale, post }: { locale: Locale; post: BlogPost }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const articleLabels = getArticleLabels(locale);
  const indexable = isIndexableBlog(post);
  const relatedInternalLinks = indexable ? getStaticInternalLinkSuggestions({ type: "blog", slug: post.slug, limit: 5 }) : [];
  const publicContent = stripLegacyEditorialSections(post.content);
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.metaDescription, image: absoluteUrl(post.image), datePublished: post.publishedAt, dateModified: post.updatedAt, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/images/cowin-logo.png") } } }} />
      {locale !== "en" ? <p className="section">{ui.news[8]}</p> : null}
      <section className="blog-hero"><div className="blog-hero-copy"><span className="eyebrow" lang="en">{post.category}</span><h1 lang="en">{post.h1}</h1><p lang="en">{post.excerpt}</p><div className="blog-meta"><span>{t.common.updated} {new Intl.DateTimeFormat(locale, { month: "short", day: "2-digit", year: "numeric" }).format(new Date(`${post.updatedAt}T00:00:00Z`))}</span><span>{post.readingTime} {t.common.minRead}</span></div></div><div className="blog-hero-image"><BlogImage src={post.image} width={980} height={620} alt={post.title} priority /></div></section>
      <section className="section blog-detail-layout"><article className="blog-article" lang="en"><MarkdownContent content={publicContent} /></article><aside className="blog-sidebar"><div className="blog-quote-card"><span className="eyebrow">{t.footer.quoteSupport}</span><h2>{t.blog.sidebarTitle}</h2><p>{t.blog.sidebarText}</p></div><div className="quote-form-shell blog-form-shell"><h3>{t.common.requestSelectionSupport}</h3><p>{t.productDetail.quoteText}</p><QuoteForm compact /></div></aside></section>
      {relatedInternalLinks.length ? <RelatedInternalLinks locale={locale} eyebrow={articleLabels.recommended} title={articleLabels.related} links={relatedInternalLinks} /> : null}
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
