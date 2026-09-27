import { site } from "@/data/site";
import type { Locale } from "@/lib/i18n";
import { getLegalDocument } from "@/lib/legalLocale";

export function LocalizedLegalPage({ locale, kind }: { locale: Locale; kind: "privacy" | "terms" | "editorial" }) {
  const document = getLegalDocument(locale, kind);
  return <section className="section legal-page" lang={locale}>
    <span className="eyebrow">{document.eyebrow}</span>
    <h1>{document.title}</h1>
    <p>{document.intro}</p>
    {document.sections.map(({ heading, body }) => {
      const [before, after] = body.split("{email}");
      return <div key={heading}><h2>{heading}</h2><p>{before}{after !== undefined ? <><a href={`mailto:${site.email}`}>{site.email}</a>{after}</> : null}</p></div>;
    })}
  </section>;
}
