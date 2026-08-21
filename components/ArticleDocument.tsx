import Image from "next/image";
import Link from "next/link";

type TextBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets" | "numbered-list" | "checklist"; items: string[] }
  | { type: "callout"; title: string; text: string; tone: "info" | "warning" }
  | { type: "image"; assetId: string; alt: string; caption?: string }
  | { type: "table"; columns: string[]; rows: string[][] };

type ArticleDocumentShape = {
  contentType: string;
  sections: Array<{ heading: string; level?: 2 | 3; blocks: TextBlock[] }>;
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{ title: string; publisher: string; url: string; publishedAt?: string; relevanceNote?: string; editorialSummary?: string; keyFacts?: string[] }>;
  relatedContent?: Array<{ contentId: string; relationship: "product" | "application" | "guide" }>;
  cta: { heading: string; text: string; label: string; href: string };
};

function isControlledMedia(src: string) {
  if (src.startsWith("/") || src.startsWith("/api/")) return true;
  try { return /(^|\.)cowinmagnet\.com$/i.test(new URL(src).hostname); } catch { return false; }
}

function DocumentImage({ src, alt }: { src: string; alt: string }) {
  if (!isControlledMedia(src)) return null;
  if (/^https?:\/\//i.test(src) || src.startsWith("/api/")) return <img src={src} alt={alt} loading="lazy" />;
  return <Image src={src} alt={alt} width={920} height={560} />;
}

function BlockRenderer({ block }: { block: any }) {
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "bullets" || block.type === "checklist") {
    return <ul className={block.type === "checklist" ? "article-checklist" : undefined}>{block.items.map((item: string, index: number) => <li key={`${item}-${index}`}>{item}</li>)}</ul>;
  }
  if (block.type === "numbered-list") return <ol>{block.items.map((item: string, index: number) => <li key={`${item}-${index}`}>{item}</li>)}</ol>;
  if (block.type === "callout") return <aside className={`article-callout article-callout-${block.tone}`}><strong>{block.title}</strong><p>{block.text}</p></aside>;
  if (block.type === "image") return <figure className="news-inline-image"><DocumentImage src={block.assetId} alt={block.alt} />{block.caption ? <figcaption>{block.caption}</figcaption> : null}</figure>;
  return <div className="markdown-table-wrap"><table><thead><tr>{block.columns.map((column: string) => <th key={column}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row: string[], rowIndex: number) => <tr key={rowIndex}>{row.map((cell: string, cellIndex: number) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function ArticleDocument({ document }: { document: any }) {
  return <>
    {document.sections.map((section: any, index: number) => {
      const Heading = section.level === 3 ? "h3" : "h2";
      return <section className="news-content-section" key={`${section.heading}-${index}`}><Heading>{section.heading}</Heading>{section.blocks.map((block: any, blockIndex: number) => <BlockRenderer key={`${block.type}-${blockIndex}`} block={block} />)}</section>;
    })}
    {document.faq.length ? <section className="news-source-box news-faq-section"><h2>FAQ</h2>{document.faq.map((entry: any) => <div className="news-faq-item" key={entry.question}><h3>{entry.question}</h3><p>{entry.answer}</p></div>)}</section> : null}
    {document.contentType === "news" && document.sources.length ? <section className="news-source-box"><h2>Sources</h2>{document.sources.map((source: any) => <article className="news-source-card" key={source.url}><p><strong>{source.publisher}</strong>{source.publishedAt ? ` | ${source.publishedAt}` : ""}</p><h3>{source.title}</h3><p>{source.editorialSummary}</p>{source.keyFacts?.length ? <ul>{source.keyFacts.map((fact: string, index: number) => <li key={`${source.url}-${index}`}>{fact}</li>)}</ul> : null}<a href={source.url} target="_blank" rel="noopener noreferrer nofollow">Read the original report</a></article>)}<p className="news-reporting-note">This article combines COWIN MAGNET product information with recent industry reporting from the sources listed above. External developments are cited for context and do not indicate a commercial relationship with COWIN MAGNET.</p></section> : null}
    {document.relatedContent?.length ? <section className="news-source-box article-related-content"><h2>Related equipment and guidance</h2><ul>{document.relatedContent.map((item: any) => <li key={`${item.relationship}-${item.contentId}`}><Link href={item.contentId}>{item.relationship === "product" ? "View the related product" : "View related guidance"}</Link></li>)}</ul></section> : null}
    {document.cta.label ? <section className="news-source-box article-document-cta"><h2>{document.cta.heading}</h2><p>{document.cta.text}</p><Link href={document.cta.href} className="btn btn-primary">{document.cta.label}</Link></section> : null}
  </>;
}
