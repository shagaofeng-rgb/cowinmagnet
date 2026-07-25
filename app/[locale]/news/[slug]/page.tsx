import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import { DateBadge } from "@/components/DateBadge";
import { JsonLd } from "@/components/JsonLd";
import { RelatedInternalLinks } from "@/components/RelatedInternalLinks";
import { formatDisplayDate, getNewsCategories, getNewsPost, getNewsPosts, newsPosts } from "@/data/contentHub";
import { site } from "@/data/site";
import { isLocale, locales, localizedPageAlternates, localizeHref, type Locale } from "@/lib/i18n";
import { getInternalLinkSuggestions } from "@/lib/linkStrategy";
import { absoluteUrl, breadcrumbSchema, faqSchema, organizationSchema } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

function NewsDisplayImage({
  src,
  alt,
  width,
  height,
  priority = false
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  if (/^https?:\/\//i.test(src) || src.startsWith("/api/")) {
    return <img src={src} width={width} height={height} alt={alt} loading={priority ? "eager" : "lazy"} referrerPolicy="no-referrer" style={{ objectFit: "contain" }} />;
  }
  return <Image src={src} width={width} height={height} alt={alt} priority={priority} style={{ objectFit: "contain" }} />;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return locales.flatMap((locale) => newsPosts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const current = (isLocale(locale) ? locale : "en") as Locale;
  const post = await getNewsPost(slug);
  if (!post) return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const socialImages = post.coverImage ? [absoluteUrl(post.coverImage)] : [];

  return {
    title,
    description,
    alternates: localizedPageAlternates(current, `/news/${post.slug}`),
    openGraph: {
      title,
      description,
      images: socialImages,
      type: "article"
    },
    twitter: {
      title,
      description,
      images: socialImages
    }
  };
}

export default async function LocalizedNewsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const current = locale as Locale;
  const [post, posts, categories] = await Promise.all([getNewsPost(slug), getNewsPosts(), getNewsCategories()]);

  if (!post) notFound();

  const categoryMap = new Map(categories.map((category) => [category.slug, category.title]));
  const currentIndex = posts.findIndex((item) => item.slug === post.slug);
  const previous = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;
  const related = posts.filter((item) => item.slug !== post.slug && item.category === post.category).slice(0, 3);
  const coverImage = post.coverImage || "";
  const description = post.seoDescription || post.excerpt;
  const sections = (post.sections || []) as { heading: string; body: string }[];
  const sources = (post.sources || []) as { name: string; date: string; title: string; url: string; accessedDate?: string }[];
  const relatedProducts = (post.relatedProducts || []) as string[];
  const seoGeoProfile = (post.seoGeoProfile || {}) as {
    productCategory?: string;
    primaryProducts?: string[];
    industry?: string;
    buyerIntent?: string;
    searchKeywords?: string[];
    selectionParameters?: string[];
    aiSearchSummary?: string;
    serviceScope?: string[];
  };
  const geoEntities = (post.geoEntities || {}) as Record<string, unknown>;
  const bodyImages = (post.bodyImages || []) as {
    imageUrl: string;
    imageAlt: string;
    imageTitle?: string;
    imageCaption: string;
    imageAttributionText?: string;
    relatedSection?: string;
    displayOrder?: number;
  }[];
  const faqs = (post.faqs || []) as { question: string; answer: string }[];
  const relatedInternalLinks = await getInternalLinkSuggestions({ type: "news", slug: post.slug, limit: 5 });
  const articleImages = [coverImage, ...bodyImages.map((image) => image.imageUrl).filter(Boolean)].filter(Boolean).map((imageUrl) => absoluteUrl(imageUrl));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description,
    articleSection: post.categoryTitle || post.category,
    keywords: [
      ...((post.tags || []) as string[]),
      ...((post.seoKeywords || []) as string[]),
      ...(seoGeoProfile.searchKeywords || [])
    ].filter(Boolean).slice(0, 24).join(", "),
    about: [
      seoGeoProfile.productCategory,
      seoGeoProfile.industry,
      seoGeoProfile.buyerIntent
    ].filter(Boolean).map((name) => ({ "@type": "Thing", name })),
    mentions: [
      ...relatedProducts,
      ...(seoGeoProfile.primaryProducts || []),
      ...((geoEntities.technical_terms as string[] | undefined) || []),
      ...((seoGeoProfile.serviceScope as string[] | undefined) || [])
    ].filter(Boolean).slice(0, 24).map((name) => ({ "@type": "Thing", name })),
    citation: sources.map((source) => source.url).filter(Boolean),
    isAccessibleForFree: true,
    ...(articleImages.length ? { image: articleImages } : {}),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": post.author ? "Person" : "Organization", name: post.author || site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/images/cowin-logo.png") }
    },
    mainEntityOfPage: absoluteUrl(localizeHref(`/news/${post.slug}`, current))
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={organizationSchema()} />
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: `/${current}` },
        { name: "News", path: `/${current}/news` },
        { name: post.title, path: `/${current}/news/${post.slug}` }
      ])} />

      <section className="blog-hero news-detail-hero">
        <div className="blog-hero-copy">
          <span className="eyebrow">{categoryMap.get(post.category) || post.categoryTitle || post.category}</span>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="blog-meta">
            <span><CalendarDays size={16} aria-hidden /> {formatDisplayDate(post.publishedAt)}</span>
            {post.author ? <span>Author: {post.author}</span> : <span>By {site.name}</span>}
            {post.source ? <span>Source: {post.source}</span> : null}
          </div>
        </div>
        {coverImage ? (
          <div className="blog-hero-image">
            <NewsDisplayImage src={coverImage} width={980} height={620} alt={post.coverAlt || post.title} priority />
            {post.imageCaption ? <p className="news-image-caption">{post.imageCaption}</p> : null}
          </div>
        ) : null}
      </section>

      <section className="section blog-detail-layout">
        <article className="blog-article news-article">
          {sections.map((section) => {
            const sectionImages = bodyImages.filter((image) => image.relatedSection === section.heading);
            return (
              <section className="news-content-section" key={section.heading}>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
                {sectionImages.map((image) => (
                  <figure className="news-inline-image" key={`${section.heading}-${image.imageUrl || image.displayOrder}`}>
                    {image.imageUrl ? (
                      <NewsDisplayImage src={image.imageUrl} width={920} height={560} alt={image.imageAlt || image.imageTitle || section.heading} />
                    ) : null}
                    <figcaption>
                      {image.imageCaption}
                      {image.imageAttributionText ? <span>{image.imageAttributionText}</span> : null}
                    </figcaption>
                  </figure>
                ))}
              </section>
            );
          })}

          {sources.length ? (
            <section className="news-source-box">
              <h2>Source References</h2>
              <p>External references are cited for context. Cowinmagnet adds its own analysis and buyer-focused interpretation.</p>
              <ul>
                {sources.map((source) => (
                  <li key={`${source.name}-${source.title}`}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer nofollow">
                      {source.name}, {source.date}: {source.title} <ExternalLink size={14} aria-hidden />
                    </a>
                    {source.accessedDate ? <span>Accessed: {source.accessedDate}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {faqs.length ? (
            <section className="news-source-box news-faq-section">
              <h2>FAQ</h2>
              {faqs.map((faq) => (
                <div className="news-faq-item" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))}
            </section>
          ) : null}

          {relatedProducts.length ? (
            <section className="news-source-box news-related-products">
              <h2>Related Cowinmagnet Solutions</h2>
              <p>{post.relatedProductRationale || "Product links are selected by topic match and should be reviewed against site conditions before final model selection."}</p>
              <ul>
                {relatedProducts.map((product) => (
                  <li key={product}>{product}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside className="blog-sidebar">
          <div className="blog-quote-card">
            <span className="eyebrow">News Insight</span>
            <h2>Turn market signals into product selection questions</h2>
            <p>Send your material type, conveyor data and target application. We will help review the suitable magnetic separation direction.</p>
            <Link href={localizeHref("/request-quote", current)} className="btn btn-primary">Send Requirements</Link>
          </div>
        </aside>
      </section>

      <RelatedInternalLinks
        locale={current}
        eyebrow="Buyer Context"
        title="Related products, guides and application pages"
        links={relatedInternalLinks}
      />

      <section className="section article-nav-section">
        <div className="article-prev-next">
          {previous ? <Link href={localizeHref(`/news/${previous.slug}`, current)}><ArrowLeft size={16} aria-hidden /> Previous: {previous.title}</Link> : <span />}
          {next ? <Link href={localizeHref(`/news/${next.slug}`, current)}>Next: {next.title} <ArrowRight size={16} aria-hidden /></Link> : <span />}
        </div>
        {related.length ? (
          <>
            <div className="section-heading align-left">
              <span className="eyebrow">Related News</span>
              <h2>More updates in this category</h2>
            </div>
            <div className="blog-grid">
              {related.map((item) => (
                <article className="blog-card news-card" key={item.slug}>
                  <Link href={localizeHref(`/news/${item.slug}`, current)} className="blog-card-image">
                    <DateBadge date={item.publishedAt} />
                    {item.coverImage ? <NewsDisplayImage src={item.coverImage} width={760} height={460} alt={item.coverAlt || item.title} /> : null}
                  </Link>
                  <div className="blog-card-body">
                    <div className="blog-card-meta"><span>{categoryMap.get(item.category) || item.category}</span><time>{formatDisplayDate(item.publishedAt)}</time></div>
                    <h3><Link href={localizeHref(`/news/${item.slug}`, current)}>{item.title}</Link></h3>
                    <p>{item.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}
