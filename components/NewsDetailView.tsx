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

type NewsDetailViewProps = {
  post: any;
  posts: any[];
  categories: Array<{ slug: string; title: string }>;
  locale?: string;
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

export function NewsDetailView({ post, posts, categories, locale }: NewsDetailViewProps) {
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

  return <>
    <JsonLd data={articleSchema} />
    <JsonLd data={organizationSchema()} />
    {document.faq.length ? <JsonLd data={faqSchema(document.faq)} /> : null}
    <JsonLd data={breadcrumbSchema([
      { name: "Home", path: basePath || "/" },
      { name: document.contentType === "news" ? "News" : "Technical Guides", path: `${basePath}/news` },
      { name: document.title, path: canonicalPath }
    ])} />
    <section className="blog-hero news-detail-hero">
      <div className="blog-hero-copy">
        <span className="eyebrow">{document.contentType === "news" ? categoryMap.get(post.category) || post.categoryTitle || "Industry News" : contentTypeLabel(document.contentType)}</span>
        <h1>{document.title}</h1>
        <p>{document.summary}</p>
        <div className="blog-meta">
          <span><CalendarDays size={16} aria-hidden /> {formatDisplayDate(document.publishedAt || post.publishedAt)}</span>
          <span>By <Link href={`${basePath}/editorial-policy`}>{document.author.name}</Link></span>
        </div>
      </div>
      {coverImage ? <div className="blog-hero-image"><NewsDisplayImage src={coverImage} alt={coverAlt} priority />{document.heroImage?.caption || post.imageCaption ? <p className="news-image-caption">{document.heroImage?.caption || post.imageCaption}</p> : null}</div> : null}
    </section>
    <section className="section blog-detail-layout">
      <article className="blog-article news-article"><ArticleDocument document={document} /></article>
    </section>
    <section className="section article-nav-section">
      <div className="article-prev-next">
        {previous ? <Link href={`${basePath}/news/${previous.slug}`}><ArrowLeft size={16} aria-hidden /> Previous: {previous.title}</Link> : <span />}
        {next ? <Link href={`${basePath}/news/${next.slug}`}>Next: {next.title} <ArrowRight size={16} aria-hidden /></Link> : <span />}
      </div>
      {related.length ? <div className="article-more-grid">{related.map((item) => <Link href={`${basePath}/news/${item.slug}`} className="article-more-card" key={item.slug}>{item.coverImage ? <Image src={item.coverImage} width={420} height={240} alt={item.coverAlt || item.title} /> : null}<div><DateBadge date={item.publishedAt} /><h2>{item.title}</h2><p>{item.excerpt}</p></div></Link>)}</div> : null}
    </section>
  </>;
}
