import { BookOpenCheck, FileCheck2, ShieldCheck } from "lucide-react";
import { InnerPage } from "@/components/InnerPage";
import { site } from "@/data/site";
import type { Locale } from "@/lib/i18n";
import { getLegalDocument } from "@/lib/legalLocale";
import { catalogLabels } from "@/lib/interiorLocale";

export function LocalizedLegalPage({ locale, kind }: { locale: Locale; kind: "privacy" | "terms" | "editorial" }) {
  const document = getLegalDocument(locale, kind);
  const labels = catalogLabels[locale];
  const Icon = { privacy: ShieldCheck, terms: FileCheck2, editorial: BookOpenCheck }[kind];
  const contents = <ol>{document.sections.map(({ heading }, index) => <li key={heading}><a href={`#policy-${index + 1}`}>{heading}</a></li>)}</ol>;
  return <InnerPage locale={locale} title={document.title} variant={`legal inner-legal--${kind}`}>
    <section className="inner-legal-hero" id="policy-top" lang={locale}><div className="inner-container">
      <div className="inner-icon"><Icon size={34} aria-hidden /></div><div><span className="eyebrow">{document.eyebrow}</span><h1>{document.title}</h1><p>{document.intro}</p></div>
    </div></section>
    <div className="inner-container inner-legal-layout">
      <aside className="inner-legal-rail"><nav aria-label={labels.contents}><h2>{labels.contents}</h2>{contents}</nav></aside>
      <details className="inner-legal-mobile"><summary>{labels.contents}</summary>{contents}</details>
      <article className="inner-legal-body">
        {document.sections.map(({ heading, body }, index) => {
          const [before, after] = body.split("{email}");
          return <section id={`policy-${index + 1}`} key={heading}><div className="inner-icon"><Icon size={21} aria-hidden /></div><div><h2>{heading}</h2><p>{before}{after !== undefined ? <><a href={`mailto:${site.email}`}>{site.email}</a>{after}</> : null}</p></div></section>;
        })}
        <a className="text-link" href="#policy-top">{labels.backTop}</a>
      </article>
    </div>
  </InnerPage>;
}
