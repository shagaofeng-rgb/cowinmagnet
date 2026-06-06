import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";

export type RelatedInternalLink = {
  type: string;
  title: string;
  href: string;
  category?: string;
  description?: string;
  anchor?: string;
};

type RelatedInternalLinksProps = {
  eyebrow?: string;
  title?: string;
  links: RelatedInternalLink[];
  locale?: Locale;
};

const typeLabels: Record<string, string> = {
  product: "Product",
  application: "Application",
  blog: "Blog",
  news: "News"
};

export function RelatedInternalLinks({
  eyebrow = "Recommended Links",
  title = "Continue exploring related products and resources",
  links,
  locale
}: RelatedInternalLinksProps) {
  if (!links.length) return null;

  return (
    <section className="section related-link-panel" aria-labelledby="related-internal-links-title">
      <div className="related-link-heading">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="related-internal-links-title">{title}</h2>
      </div>
      <div className="related-link-grid">
        {links.map((link) => {
          const href = locale ? localizeHref(link.href, locale) : link.href;
          return (
            <Link className="related-link-card" href={href} key={`${link.type}-${link.href}`}>
              <span>{typeLabels[link.type] || link.type}</span>
              <h3>{link.anchor || link.title}</h3>
              {link.description ? <p>{link.description}</p> : null}
              <strong>
                Open related page <ArrowRight size={15} aria-hidden />
              </strong>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
