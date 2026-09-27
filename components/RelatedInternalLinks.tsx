import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localizeHref, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

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

export function RelatedInternalLinks({
  eyebrow = "Recommended Links",
  title = "Continue exploring related products and resources",
  links,
  locale
}: RelatedInternalLinksProps) {
  if (!links.length) return null;
  const currentLocale = locale || "en";
  const t = getDictionary(currentLocale);
  const ui = getPublicUi(currentLocale);
  const typeLabels: Record<string, string> = {
    product: t.nav.products,
    application: t.nav.applications,
    blog: t.nav.blog,
    news: t.nav.news
  };

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
              <h3 lang="en">{link.anchor || link.title}</h3>
              {link.description ? <p lang="en">{link.description}</p> : null}
              <strong>
                {ui.searchUi[8]} <ArrowRight size={15} aria-hidden />
              </strong>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
