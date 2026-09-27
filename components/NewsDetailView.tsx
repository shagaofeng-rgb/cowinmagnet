import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { ArticleDocument } from "@/components/ArticleDocument";
import { DateBadge } from "@/components/DateBadge";
import { JsonLd } from "@/components/JsonLd";
import { formatDisplayDate } from "@/data/contentHub";
import { site } from "@/data/site";
import { getArticleDocument, articleSchemaType } from "@/lib/articleDocument";
import { absoluteUrl, breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";
import { getArticleLabels } from "@/lib/articleLocale";

type NewsDetailViewProps = {
  post: any;
  posts: any[];
  categories: Array<{ slug: string; title: string }>;
  locale?: string;
  visualVariant?: "product-first";
};

function NewsDisplayImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const controlled = src.startsWith("/") || src.startsWith("/api/") || (() => { try { return /(^|\.)cowinmagnet\.com$/i.test(new URL(src).hostname); } catch { return false; } })();
  if (!controlled) return null;
  if (/^https?:\/\//i.test(src) || src.startsWith("/api/")) return <img src={src} width={980} height={620} alt={alt} loading={priority ? "eager" : "lazy"} referrerPolicy="no-referrer" style={{ objectFit: "contain" }} />;
  return <Image src={src} width={980} height={620} alt={alt} priority={priority} style={{ objectFit: "contain" }} />;
}

function contentTypeLabel(type: string) {
  return type.split("-").map((part) => part.slice(0, 1).toUpperCase() + part.slice(1)).join(" ");
}

function navigationId(heading: string, index: number) {
  const slug = heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `article-section-${slug || index + 1}`;
}

export function NewsDetailView({ post, posts, categories, locale, visualVariant }: NewsDetailViewProps) {
  const currentLocale = isLocale(locale) ? locale : "en";
  const ui = getPublicUi(currentLocale);
  const labels = getArticleLabels(currentLocale);
  const document: any = getArticleDocument(post);
  const articleType = articleSchemaType(document);
  const categoryMap = new Map(categories.map((category) => [category.slug, category.title]));
  const currentIndex = posts.findIndex((item) => item.slug === post.slug);
  const previous = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const related = posts.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3);
  const basePath = locale ? `/${locale}` : "";
  const canonicalPath = `${basePath}/news/${post.slug}`;
  const coverImage = document.heroImage?.assetId || post.coverImage || "";
  const coverAlt = document.heroImage?.alt || post.coverAlt || document.title;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": articleType,
    headline: document.title,
    description: document.summary,
    articleSection: contentTypeLabel(document.contentType),
    datePublished: document.publishedAt || post.publishedAt,
    dateModified: document.modifiedAt || post.updatedAt || post.publishedAt,
    author: { "@type": "Organization", name: document.author.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/images/cowin-logo.png") } },
    mainEntityOfPage: absoluteUrl(canonicalPath),
    ...(coverImage ? { image: [absoluteUrl(coverImage)] } : {}),
    ...(document.contentType === "news" && document.sources[0]?.url ? { isBasedOn: document.sources[0].url, citation: document.sources.map((source: any) => source.url) } : {})
  };

  const previewVariant = visualVariant === "product-first";

  return <div className={previewVariant ? "product-first-news-preview" : undefined}>
    <JsonLd data={articleSchema} />
    <JsonLd data={organizationSchema()} />
    {document.faq.length ? <JsonLd data={faqSchema(document.faq)} /> : null}
    <JsonLd data={breadcrumbSchema([
      { name: ui.home, path: basePath || "/" },
      { name: document.contentType === "news" ? ui.news[0] : labels.technicalGuides, path: `${basePath}/news` },
      { name: document.title, path: canonicalPath }
    ])} />
    {currentLocale !== "en" ? <p className="section">{ui.news[8]}</p> : null}
    <section className="blog-hero news-detail-hero">
      <div className="blog-hero-copy">
        <span className="eyebrow" lang="en">{document.contentType === "news" ? categoryMap.get(post.category) || post.categoryTitle || labels.industryNews : contentTypeLabel(document.contentType)}</span>
        <h1 lang="en">{document.title}</h1>
        <p lang="en">{document.summary}</p>
        <div className="blog-meta">
          <span><CalendarDays size={16} aria-hidden /> {formatDisplayDate(document.publishedAt || post.publishedAt)}</span>
          <span>{labels.by} <Link href={`${basePath}/editorial-policy`} lang="en">{document.author.name}</Link></span>
        </div>
      </div>
      {coverImage ? <div className="blog-hero-image"><NewsDisplayImage src={coverImage} alt={coverAlt} priority />{document.heroImage?.caption || post.imageCaption ? <p className="news-image-caption" lang="en">{document.heroImage?.caption || post.imageCaption}</p> : null}</div> : null}
    </section>
    <section className={`section blog-detail-layout${previewVariant ? " product-first-reading-layout" : ""}`}>
      {previewVariant ? <aside className="product-first-reading-rail" aria-label={labels.contents}>
        <p>{labels.inGuide}</p>
        <nav lang="en">{document.sections.slice(0, 7).map((section: any, index: number) => <a href={`#${navigationId(section.heading, index)}`} key={section.heading}>{section.heading}</a>)}</nav>
        <a className="product-first-rail-link" href={document.cta.href} lang="en">{document.cta.label}</a>
      </aside> : null}
      <article className="blog-article news-article" lang="en"><ArticleDocument document={document} /></article>
    </section>
    <section className="section article-nav-section">
      <div className="article-prev-next">
        {previous ? <Link href={`${basePath}/news/${previous.slug}`}><ArrowLeft size={16} aria-hidden /> {ui.previous}: <span lang="en">{previous.title}</span></Link> : <span />}
        {next ? <Link href={`${basePath}/news/${next.slug}`}>{ui.next}: <span lang="en">{next.title}</span> <ArrowRight size={16} aria-hidden /></Link> : <span />}
      </div>
      {related.length ? <div className="article-more-grid">{related.map((item) => <Link href={`${basePath}/news/${item.slug}`} className="article-more-card" key={item.slug}>{item.coverImage ? <Image src={item.coverImage} width={420} height={240} alt={item.coverAlt || item.title} /> : null}<div><DateBadge date={item.publishedAt} /><h2 lang="en">{item.title}</h2><p lang="en">{item.excerpt}</p></div></Link>)}</div> : null}
    </section>
  </div>;
}
