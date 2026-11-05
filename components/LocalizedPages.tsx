import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CheckCircle2, ClipboardCheck, Factory, Globe2, Magnet, Recycle, Wheat, Workflow, Headphones, Mail, MapPin, MessageCircle, Phone, Settings, ShieldCheck, Truck, Wrench } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import { BlogImage } from "@/components/BlogImage";
import { GlobalCustomerNetwork } from "@/components/GlobalCustomerNetwork";
import { HomeVideoShowcase } from "@/components/HomeVideoShowcase";
import { HomeProductShowcase } from "@/components/HomeProductShowcase";
import { InnerAction, InnerPage } from "@/components/InnerPage";
import { catalogLabels } from "@/lib/interiorLocale";
import { JsonLd } from "@/components/JsonLd";
import { LocalizedProductCard } from "@/components/LocalizedProductCard";
import { InnerArticleCard } from "@/components/InnerArticleCard";
import { MarkdownContent, markdownHeadings } from "@/components/MarkdownContent";
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
import { getHomeProductFamily } from "@/lib/homeProductTaxonomy";
import { getLocalizedProductSummary } from "@/lib/productLocale";
import { getLocalizedProductTitle } from "@/lib/productLocalizedTitle";
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

const homeIndustryOrder = ["mining", "recycling", "cement-aggregate", "food"];
const homeHeroImage = "/images/generated/home-hero-option-two-branded-20261009.webp";

export function LocalizedHomePage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const featuredSlugs = homeProductCards.map((card) => card.slug);
  const orderedProducts = [
    ...featuredSlugs.flatMap((slug) => products.find((product) => product.slug === slug) || []),
    ...products.filter((product) => !featuredSlugs.includes(product.slug))
  ];
  const homeCards = orderedProducts.map((product) => {
    const featuredIndex = featuredSlugs.indexOf(product.slug);
    return {
      slug: product.slug,
      image: product.image,
      title: featuredIndex >= 0 ? ui.homeCards[featuredIndex][0] : getLocalizedProductTitle(product, locale),
      summary: featuredIndex >= 0 ? ui.homeCards[featuredIndex][1] : getLocalizedProductSummary(product, locale),
      family: getHomeProductFamily(product),
      featuredIndex
    };
  });
  return (
    <div className="localized-home home-option-two">
      <section className="home2-hero" aria-labelledby="home2-title">
        <div className="home2-container">
          <div className="home2-hero-panel">
            <div className="home2-hero-copy">
              <span className="home2-eyebrow">{locale === "en" ? "Global OEM/ODM partner" : t.home.heroEyebrow}</span>
              <h1 id="home2-title">
                {locale === "en" ? <>Magnetic separation{" "}<span>Built for your line.</span></> : t.home.h1}
              </h1>
              <p>{t.home.heroText}</p>
              <div className="home2-actions">
                <Link href={localizeHref("/request-quote", locale)} className="home2-button home2-button-primary">
                  {t.common.getQuote} <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a href="#home-equipment" className="home2-text-link">
                  {locale === "en" ? "Browse products" : t.common.viewProducts} <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="home2-hero-art">
              <Image src={homeHeroImage} fill sizes="(max-width: 860px) 92vw, (max-width: 1440px) 54vw, 735px" alt={t.home.heroAlt} priority fetchPriority="high" />
            </div>
          </div>
          <ul className="home2-hero-proof" aria-label={t.home.whyTitle}>
            {[Settings, BadgeCheck, ShieldCheck, Headphones].map((Icon, index) => (
              <li key={ui.homeProof[index]}><Icon size={22} aria-hidden="true" /><span>{ui.homeProof[index]}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section id="home-equipment" className="home2-products" aria-labelledby="home2-products-title">
        <div className="home2-container">
          <div className="home2-section-head">
            <div>
              <span className="home2-eyebrow">{locale === "en" ? "Equipment catalogue" : t.home.featuredEyebrow}</span>
              <h2 id="home2-products-title">{locale === "en" ? "Find the right equipment" : ui.homeProductRangeTitle}</h2>
            </div>
            <p>{ui.homeProductRangeText}</p>
          </div>
          <HomeProductShowcase locale={locale} cards={homeCards} />
        </div>
      </section>

      <section className="home2-industries" aria-labelledby="home2-industry-title">
        <div className="home2-container home2-industry-layout">
          <div className="home2-industry-copy">
            <span className="home2-eyebrow">{locale === "en" ? "Industry applications" : t.home.applicationEyebrow}</span>
            <h2 id="home2-industry-title">{locale === "en" ? "Separation in practice" : ui.homeIndustryTitle}</h2>
            <p>{ui.industryDescription}</p>
            <Link href={localizeHref("/industries", locale)} className="home2-text-link">
              {locale === "en" ? "See all industries" : t.common.viewSolution} <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="home2-industry-grid">
            {homeIndustryOrder.map((slug) => {
              const index = applications.findIndex((application) => application.industrySlug === slug);
              const industry = applications[index];
              const name = ui.industryMenu[index]?.[0] || industry.name;
              return (
                <Link key={slug} href={localizeHref(`/industries/${slug}`, locale)} className="home2-industry-tile">
                  <Image src={industry.image} fill sizes="(max-width: 760px) 46vw, (max-width: 860px) 45vw, 30vw" alt="" loading="lazy" />
                  <span>{name}<ArrowRight size={17} aria-hidden="true" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home2-video-quote" aria-labelledby="home2-quote-title">
        <div className="home2-container home2-video-layout">
          <HomeVideoShowcase eyebrow={locale === "en" ? "Product showcase" : t.home.videoEyebrow} title={locale === "en" ? "See the equipment in action" : t.home.videoTitle} locale={locale} />
          <div className="home2-quote-card">
            <span className="home2-eyebrow">{locale === "en" ? "Project inquiry" : t.home.quoteEyebrow}</span>
            <h2 id="home2-quote-title">{locale === "en" ? "Tell us about your project" : t.home.quoteTitle}</h2>
            <QuoteForm compact variant="home" />
          </div>
        </div>
      </section>
    </div>
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

const industryIcons = [Recycle, Magnet, Factory, Wheat];
const industryHeadlines: Record<string, string> = {
  recycling: "Recover metal. Protect your recycling line.",
  mining: "Protect your process. Review mineral separation.",
  "cement-aggregate": "Remove tramp iron before it interrupts your line.",
  food: "Control ferrous contamination in flowing materials."
};

export function LocalizedIndustriesPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const labels = catalogLabels[locale];
  return <InnerPage locale={locale} title={ui.industries} variant="industries">
    <PageHero eyebrow={ui.industrySolutions} title={locale === "en" ? "Magnetic solutions for your industry" : ui.industryHeadline} description={ui.industryDescription} image={applications[0].image} imageAlt={applications[0].imageAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/contact", locale)} secondaryLabel={ui.contact} />
    <div className="inner-container inner-stack">
      <section><h2>{ui.industrySolutions}</h2><div className="inner-industry-grid">
        {applications.map((application, index) => {
          const Icon = industryIcons[index];
          const name = ui.industryMenu[index]?.[0] || application.name;
          return <article key={application.industrySlug}>
            <Link className="inner-industry-image" href={localizeHref(`/industries/${application.industrySlug}`, locale)} aria-label={name}><Image src={application.image} width={520} height={350} sizes="(max-width: 760px) 40vw, 24vw" alt={name} /></Link>
            <div><div className="inner-icon"><Icon size={23} aria-hidden /></div><h3>{name}</h3><p>{ui.industryMenu[index]?.[1] || application.summary}</p><Link href={localizeHref(`/industries/${application.industrySlug}`, locale)} className="text-link">{t.common.viewSolution}<ArrowRight size={16} aria-hidden /></Link></div>
          </article>;
        })}
      </div></section>
      <section className="inner-process-band"><h2>{labels.selection}</h2><p>{ui.productInstruction}</p><div className="inner-steps">
        {[[ClipboardCheck, ui.material], [Workflow, ui.installation], [Settings, labels.operation], [Headphones, ui.support]].map(([icon, label], index) => {
          const Icon = icon as typeof ClipboardCheck;
          return <article key={String(label)}><Icon size={22} aria-hidden /><span>{String(index + 1).padStart(2, "0")}</span><p>{String(label)}</p></article>;
        })}
      </div></section>
      <InnerAction locale={locale} />
    </div>
  </InnerPage>;
}

export function LocalizedApplicationDetailPage({ locale, application }: { locale: Locale; application: Application }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const labels = catalogLabels[locale];
  const english = locale === "en";
  const related = application.recommendedProducts.flatMap((name) => products.find((product) => product.name === name) || []).slice(0, 4);
  const industryIndex = applications.findIndex((item) => item.industrySlug === application.industrySlug);
  const industryName = ui.industryMenu[industryIndex]?.[0] || application.name;
  const industrySummary = ui.industryMenu[industryIndex]?.[1] || application.summary;
  const original = getOriginalContentLabels(locale);
  return <InnerPage locale={locale} title={industryName} parent={{ label: ui.industries, href: "/industries" }} variant="industry">
    {english && application.faqs?.length ? <JsonLd data={faqSchema(application.faqs)} /> : null}
    <PageHero eyebrow={industryName} title={english ? industryHeadlines[application.industrySlug] || application.pageTitle : industryName} description={english ? application.summary : industrySummary} image={application.image} imageAlt={english ? application.imageAlt : industryName} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/contact", locale)} secondaryLabel={ui.contact} />
    <div className="inner-container inner-stack">
      {english ? <>
        <section className="inner-guide-grid inner-industry-points" aria-label={t.applications.painPoints}>
          {application.solutionPairs.slice(0, 3).map((item, index) => {
            const Icon = [Magnet, Settings, ShieldCheck][index];
            return <article key={item.issue}><div className="inner-icon"><Icon size={23} aria-hidden /></div><div><h3>{item.issue}</h3><p>{item.solution}</p></div></article>;
          })}
        </section>
        <section className="inner-process-band"><h2>{labels.process}</h2>{application.secondaryDescription ? <p>{application.secondaryDescription}</p> : null}
          <IndustryEquipmentGrid items={application.equipment.slice(0, 4)} />
        </section>
      </> : null}
      <section><h2>{t.applications.recommended}</h2><div className="product-grid inner-category-grid">{related.map((product) => <LocalizedProductCard key={product.slug} product={product} locale={locale} />)}</div></section>
      {english ? <>
        <section><h2>Application scenarios</h2><IndustryScenarioGrid application={application} /></section>
        <details className="inner-detail-disclosure"><summary>{t.applications.painPoints}</summary><FeatureList items={application.painPoints} /><IndustrySolutionGrid items={application.solutionPairs} /></details>
        {application.table ? <details className="inner-detail-disclosure"><summary>{application.table.title}</summary><IndustryTable table={application.table} /></details> : null}
      </> : <p>{original.industry} <Link className="text-link" href={`/en/industries/${application.industrySlug}`} hrefLang="en">{original.link}</Link></p>}
      <section className="inner-contact-layout">
        <div className="inner-process-band"><h2>{t.productDetail.ctaTitle}</h2><p>{t.applications.quoteText}</p><ul>{[ui.material, ui.beltWidth, ui.installation].map((item) => <li key={item}><CheckCircle2 size={18} aria-hidden />{item}</li>)}</ul></div>
        <div className="inner-form-panel"><h2>{t.applications.quoteTitle}</h2><QuoteForm compact /></div>
      </section>
      {english && application.faqs.length ? <section><h2>{t.productDetail.faq}</h2><FaqList faqs={application.faqs} /></section> : null}
    </div>
  </InnerPage>;
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

export function LocalizedBlogListPage({ locale, posts, categories = [], selectedCategory, pagination }: { locale: Locale; posts: BlogPost[]; categories?: string[]; selectedCategory?: string; pagination?: { currentPage: number; totalPages: number; totalItems: number } }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const labels = getArticleLabels(locale);
  const featured = pagination?.currentPage === 1 ? posts[0] : undefined;
  const pageHref = (page: number, category = selectedCategory) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (page > 1) params.set("page", String(page));
    return `${localizeHref("/blog", locale)}${params.size ? `?${params}` : ""}`;
  };
  const card = (post: BlogPost, lead = false) => <InnerArticleCard key={post.slug} href={localizeHref(`/blog/${post.slug}`, locale)} title={post.title} category={post.category} excerpt={post.excerpt} image={post.image} date={post.publishedAt} action={t.common.readArticle} featured={lead} />;
  return <InnerPage locale={locale} title={t.nav.blog} variant="blog">
    <PageHero eyebrow={labels.technicalGuides} title={locale === "en" ? "Practical insights for better separation" : t.blog.h1} description={t.blog.description} image={products.find((item) => item.slug === "suspended-permanent-magnetic-separator")?.image} imageAlt={t.products.heroAlt} mediaStyle="equipment" primaryHref="" compact />
    <div className="inner-container inner-stack">
      {locale !== "en" ? <p>{ui.news[8]}</p> : null}
      {featured ? <section aria-label={labels.recommended}>{card(featured, true)}</section> : null}
      {categories.length > 1 ? <nav className="inner-pills" aria-label={ui.categories}><Link href={localizeHref("/blog", locale)} aria-current={!selectedCategory ? "true" : undefined}>{catalogLabels[locale].allResults}</Link>{categories.map((category) => <Link lang="en" href={pageHref(1, category)} key={category} aria-current={category === selectedCategory ? "true" : undefined}>{category}</Link>)}</nav> : null}
      <section><div className="inner-results-heading"><h2>{t.blog.hubTitle}</h2>{pagination ? <p>{pagination.totalItems ? (pagination.currentPage - 1) * 9 + 1 : 0}–{Math.min(pagination.totalItems, pagination.currentPage * 9)} / {pagination.totalItems}</p> : null}</div>
        <div className="blog-grid">{(featured ? posts.slice(1) : posts).map((post) => card(post))}</div>
        {pagination ? <PaginationNav currentPage={pagination.currentPage} totalPages={pagination.totalPages} hrefForPage={pageHref} label={t.nav.blog} summary={`${ui.page} ${pagination.currentPage} / ${pagination.totalPages}`} locale={locale} /> : null}
      </section>
      <InnerAction locale={locale} />
    </div>
  </InnerPage>;
}

export function LocalizedBlogDetailPage({ locale, post }: { locale: Locale; post: BlogPost }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const articleLabels = getArticleLabels(locale);
  const indexable = isIndexableBlog(post);
  const relatedInternalLinks = indexable ? getStaticInternalLinkSuggestions({ type: "blog", slug: post.slug, limit: 5 }) : [];
  const publicContent = stripLegacyEditorialSections(post.content);
  const headings = markdownHeadings(publicContent);
  return (
    <InnerPage locale={locale} title={post.title} parent={{ label: t.nav.blog, href: "/blog" }} variant="blog-detail">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.metaDescription, image: absoluteUrl(post.image), datePublished: post.publishedAt, dateModified: post.updatedAt, author: { "@type": "Organization", name: site.name }, publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/images/cowin-logo.png") } } }} />
      {locale !== "en" ? <p className="inner-container inner-original-note">{ui.news[8]}</p> : null}
      <section className="blog-hero"><div className="blog-hero-copy"><span className="eyebrow" lang="en">{post.category}</span><h1 lang="en">{post.h1}</h1><p lang="en">{post.excerpt}</p><div className="blog-meta"><span>{t.common.updated} {new Intl.DateTimeFormat(locale, { month: "short", day: "2-digit", year: "numeric" }).format(new Date(`${post.updatedAt}T00:00:00Z`))}</span><span>{post.readingTime} {t.common.minRead}</span></div></div><div className="blog-hero-image"><BlogImage src={post.image} width={980} height={620} alt={post.title} priority /></div></section>
      <div className="inner-container inner-article-layout">
        <aside className="inner-article-rail">
          {headings.length ? <nav aria-label={articleLabels.contents}><strong>{articleLabels.contents}</strong><ol>{headings.map((heading) => <li key={heading.id} lang="en"><a href={`#${heading.id}`}>{heading.label}</a></li>)}</ol></nav> : null}
          <Link className="btn btn-primary" href={localizeHref("/request-quote", locale)}>{t.common.requestSelectionSupport}</Link>
        </aside>
        <article className="blog-article" lang="en"><MarkdownContent content={publicContent} /></article>
      </div>
      <div className="inner-container"><InnerAction locale={locale} /></div>
      {relatedInternalLinks.length ? <RelatedInternalLinks locale={locale} eyebrow={articleLabels.recommended} title={articleLabels.related} links={relatedInternalLinks} /> : null}
    </InnerPage>
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
