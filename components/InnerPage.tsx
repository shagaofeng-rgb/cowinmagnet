import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { getDictionary, localizeHref, type Locale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

export function InnerBreadcrumb({ locale, items }: { locale: Locale; items: Array<{ label: string; href?: string }> }) {
  const ui = getPublicUi(locale);
  return <nav className="inner-crumb inner-container" aria-label={ui.navigation}>
    <ol><li><Link href={`/${locale}`}>{ui.home}</Link></li>
      {items.map(({ label, href }, index) => <li key={index}><ChevronRight size={13} aria-hidden />{href ? <Link href={localizeHref(href, locale)}>{label}</Link> : <span aria-current="page">{label}</span>}</li>)}
    </ol>
  </nav>;
}

export function InnerPage({ locale, title, parent, variant, children }: { locale: Locale; title: string; parent?: { label: string; href: string }; variant?: string; children: ReactNode }) {
  return <div className={`inner-page${variant ? ` inner-page--${variant}` : ""}`}>
    <InnerBreadcrumb locale={locale} items={[...(parent ? [parent] : []), { label: title }]} />
    {children}
  </div>;
}

export function InnerAction({ locale, title, text, product }: { locale: Locale; title?: string; text?: string; product?: string }) {
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const quoteHref = localizeHref("/request-quote", locale);
  return <div className="inner-action">
    <div><h2>{title || ui.catalogHelp}</h2><p>{text || ui.productInstruction}</p></div>
    <div className="hero-actions">
      <Link className="btn btn-primary" href={product ? `${quoteHref}?product=${encodeURIComponent(product)}` : quoteHref}>{t.common.getQuote} <ArrowRight size={16} aria-hidden /></Link>
      <Link className="btn btn-secondary" href={localizeHref("/contact", locale)}>{ui.contact}</Link>
    </div>
  </div>;
}
