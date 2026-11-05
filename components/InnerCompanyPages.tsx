import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Boxes, ClipboardCheck, FileText, Headphones, Mail, MapPin, MessageCircle, Settings2, Truck } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import { InnerAction, InnerPage } from "@/components/InnerPage";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PaginationNav } from "@/components/PaginationNav";
import { QuoteForm, type ProductInquiryContext } from "@/components/QuoteForm";
import { products } from "@/data/products";
import { applications } from "@/data/applications";
import { site } from "@/data/site";
import { organizationSchema } from "@/lib/seo";
import { getDictionary, localizeHref, type Locale } from "@/lib/i18n";
import { catalogLabels } from "@/lib/interiorLocale";
import { getPublicUi } from "@/lib/publicUi";

const conveyor = "/images/industries/recycling-industry-magnetic-separation-cover-clean-20261001-cowin-brand-20261001.webp";
const overband = products.find((item) => item.slug === "permanent-overband-magnetic-separator")?.image || conveyor;
const about = "/images/interiors/about-context.webp";
const quality = "/images/interiors/quality-context.webp";
const productAssembly = "/images/catalog/page-3-image-9-1871x840-cowin-brand-20261001.jpg";
const icons = [Settings2, ClipboardCheck, Boxes, Truck, FileText, Headphones];

export function LocalizedAboutPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const labels = catalogLabels[locale];
  return <InnerPage locale={locale} title={ui.aboutUs} variant="about">
    <JsonLd data={organizationSchema()} />
    <PageHero eyebrow={t.about.eyebrow} title={t.about.h1} description={t.about.description} image={about} imageAlt={labels.illustration} imageNote={labels.illustration} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} secondaryHref={localizeHref("/factory", locale)} secondaryLabel={t.factory.eyebrow} />
    <div className="inner-container inner-stack">
      <section className="inner-story-list">
        <article><Image src={conveyor} alt={t.applications.heroAlt} width={710} height={360} sizes="(max-width: 760px) 100vw, 48vw" /><div><span className="eyebrow">{labels.profile}</span><h2>{site.legalName}</h2><p>{t.about.profileText1}</p></div></article>
        <article><Image src={productAssembly} alt={t.products.heroAlt} width={710} height={360} sizes="(max-width: 760px) 100vw, 48vw" /><div><span className="eyebrow">{ui.oem}</span><h2>{t.about.serviceTitle}</h2><p>{t.about.profileText2}</p><Link className="text-link" href={localizeHref("/products", locale)}>{t.common.viewProducts}<ArrowRight size={16} aria-hidden /></Link></div></article>
        <article><Image src={quality} alt={labels.illustration} width={710} height={360} sizes="(max-width: 760px) 100vw, 48vw" /><div><span className="eyebrow">{labels.illustration}</span><h2>{t.factory.h1}</h2><p>{t.factory.description}</p><Link className="text-link" href={localizeHref("/factory", locale)}>{t.factory.eyebrow}<ArrowRight size={16} aria-hidden /></Link></div></article>
      </section>
      <section><h2>{ui.oem} · {t.about.serviceEyebrow}</h2><div className="inner-steps">{t.about.services.map((service, index) => { const Icon = icons[index % icons.length]; return <article key={service}><Icon size={23} aria-hidden /><span>{String(index + 1).padStart(2, "0")}</span><p>{service}</p></article>; })}</div></section>
      <InnerAction locale={locale} />
    </div>
  </InnerPage>;
}

export function LocalizedSupplyPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const labels = catalogLabels[locale];
  const photos = [productAssembly, quality, conveyor];
  const steps = locale === "en" ? [
    ["Configuration review", "Review the operating conditions and the equipment interface before finalizing the selection."],
    ["Pre-shipment checks", "Confirm the agreed configuration, dimensions and key inspection items with the supplier."],
    ["Protective packaging", "Review packing requirements for handling and the agreed transport route."],
    ["Delivery documentation", "Coordinate the documents agreed for the order and shipment."],
  ] : t.advantages;
  const checklist = locale === "en" ? ["Equipment configuration", "Inspection scope", "Packing requirements", "Delivery documents"] : t.about.services.slice(0, 4);
  return <InnerPage locale={locale} title={t.factory.eyebrow} variant="quality">
    <PageHero eyebrow={t.factory.eyebrow} title={locale === "en" ? "From requirements to delivery, every detail matters." : t.factory.h1} description={t.factory.description} image={quality} imageAlt={labels.illustration} imageNote={labels.illustration} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} />
    <div className="inner-container inner-stack">
      <section className="inner-story-list">{steps.map(([title, detail], index) => { const Icon = icons[index % icons.length]; return <article key={title}><Image src={photos[index % photos.length]} alt={photos[index % photos.length] === quality ? labels.illustration : t.factory.heroAlt} width={710} height={360} sizes="(max-width: 760px) 100vw, 48vw" /><div><div className="inner-icon"><Icon size={22} aria-hidden /></div><h2>{title}</h2><p>{detail}</p></div></article>; })}</section>
      <section className="inner-process-band"><h2>{labels.delivery}</h2><ul>{checklist.map((item) => <li key={item}><BadgeCheck size={19} aria-hidden />{item}</li>)}</ul></section>
      <InnerAction locale={locale} />
    </div>
  </InnerPage>;
}

const PROJECTS_PER_PAGE = 6;
export function LocalizedProjectsPage({ locale, requestedPage, industry }: { locale: Locale; requestedPage?: string; industry?: string }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const all = applications.flatMap((app, index) => locale === "en"
    ? app.scenarios.map((scenario) => ({ app, title: scenario, description: app.summary, image: app.scenarioImages?.[scenario] || app.image, label: ui.industryMenu[index][0] }))
    : [{ app, title: ui.industryMenu[index][0], description: ui.industryMenu[index][1], image: app.image, label: ui.industryMenu[index][0] }]);
  const selected = applications.some((item) => item.industrySlug === industry) ? industry : undefined;
  const filtered = selected ? all.filter(({ app }) => app.industrySlug === selected) : all;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PROJECTS_PER_PAGE));
  const page = Math.min(pageCount, Math.max(1, Math.floor(Number(requestedPage) || 1)));
  const href = (current: number, filter?: string) => {
    const params = new URLSearchParams();
    if (current > 1) params.set("page", String(current));
    if (filter) params.set("industry", filter);
    return `${localizeHref("/projects", locale)}${params.size ? `?${params}` : ""}`;
  };
  return <InnerPage locale={locale} title={t.projects.eyebrow} variant="projects">
    <PageHero eyebrow={t.projects.eyebrow} title={locale === "en" ? "See where magnetic separation fits" : t.projects.h1} description={t.projects.description} image={conveyor} imageAlt={t.projects.heroAlt} primaryHref={localizeHref("/request-quote", locale)} primaryLabel={t.common.getQuote} />
    <div className="inner-container inner-stack">
      <nav className="inner-pills" aria-label={ui.industries}><Link href={href(1)} aria-current={!selected ? "true" : undefined}>{ui.industries}</Link>{applications.map((item, index) => <Link href={href(1, item.industrySlug)} aria-current={item.industrySlug === selected ? "true" : undefined} key={item.industrySlug}>{ui.industryMenu[index][0]}</Link>)}</nav>
      <section className="inner-project-grid">{filtered.slice((page - 1) * PROJECTS_PER_PAGE, page * PROJECTS_PER_PAGE).map(({ app, title, description, image, label }) => <article className="blog-card" key={`${app.slug}-${title}`}><Link className="blog-card-image" href={localizeHref(`/industries/${app.industrySlug}`, locale)}><Image src={image} alt={title} width={620} height={370} sizes="(max-width: 760px) 100vw, 32vw" /></Link><div className="blog-card-body"><span className="eyebrow">{label}</span><h2>{title}</h2><p>{description}</p><Link className="text-link" href={localizeHref(`/industries/${app.industrySlug}`, locale)}>{t.common.viewSolution} <ArrowRight size={16} aria-hidden /></Link></div></article>)}</section>
      <PaginationNav currentPage={page} totalPages={pageCount} hrefForPage={(value) => href(value, selected)} label={t.projects.eyebrow} summary={`${ui.page} ${page} / ${pageCount}`} locale={locale} />
      <InnerAction locale={locale} />
    </div>
  </InnerPage>;
}

function ContactLinks({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  return <div className="inner-contact-links">
    <h2>{t.contact.infoTitle}</h2>
    <a href={`mailto:${site.email}`}><div className="inner-icon"><Mail size={20} aria-hidden /></div><span>{site.email}</span></a>
    <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="contact-page" data-whatsapp-component="localized-contact-page"><div className="inner-icon"><MessageCircle size={20} aria-hidden /></div><span>WhatsApp <bdi>{site.phone}</bdi></span></a>
    <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer nofollow"><div className="inner-icon"><MapPin size={20} aria-hidden /></div><span>{site.address}</span></a>
    <p>{t.contact.fastTip}</p>
    <div className="inner-contact-actions"><a className="btn btn-primary" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="contact-direct" data-whatsapp-component="localized-contact-page"><MessageCircle size={17} aria-hidden />WhatsApp</a><a className="btn btn-secondary" href={`mailto:${site.email}`}><Mail size={17} aria-hidden />{getPublicUi(locale).email}</a></div>
  </div>;
}

export function LocalizedContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  return <InnerPage locale={locale} title={ui.contact} variant="contact">
    <PageHero eyebrow={t.contact.eyebrow} title={locale === "en" ? "Let’s discuss your application" : t.contact.h1} description={t.contact.description} image={overband} imageAlt={t.products.heroAlt} mediaStyle="equipment" primaryHref="" />
    <div className="inner-container inner-stack">
      <section className="inner-contact-layout">
        <ContactLinks locale={locale} />
        <div className="inner-form-panel"><h2>{catalogLabels[locale].message}</h2><QuoteForm variant="contact" /></div>
      </section>
      <GoogleMapCard locale={locale} />
    </div>
  </InnerPage>;
}

export function LocalizedRequestQuotePage({ locale, selected, defaultProduct }: { locale: Locale; selected?: { context: ProductInquiryContext; image: string; title: string }; defaultProduct?: string }) {
  const t = getDictionary(locale);
  const labels = catalogLabels[locale];
  return <InnerPage locale={locale} title={t.requestQuote.eyebrow} variant="quote">
    <PageHero compact eyebrow={t.requestQuote.eyebrow} title={locale === "en" ? "Tell us about your application" : t.requestQuote.h1} description={locale === "en" ? "Share what you know. We will help clarify the configuration." : t.requestQuote.description} primaryHref="" />
    <div className="inner-container inner-quote-layout">
      <div className="inner-form-panel"><QuoteForm variant="project" productContext={selected?.context} defaultProduct={defaultProduct} /></div>
      <aside className="inner-quote-side">
        {selected ? <section><h2>{labels.selected}</h2><Image src={selected.image} alt={selected.title} width={430} height={280} sizes="(max-width: 760px) 65vw, 300px" /><strong>{selected.title}</strong>{selected.context.model ? <p>{getPublicUi(locale).productModel}: <bdi>{selected.context.model}</bdi></p> : null}</section> : null}
        <ContactLinks locale={locale} />
      </aside>
    </div>
  </InnerPage>;
}
