import GoogleMapCard from "@/components/GoogleMapCard";
import QuoteSection from "@/components/QuoteSection";
import { createSeoMetadata } from "@/data/i18n";
import { getMessages } from "@/messages";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  return createSeoMetadata(locale, "/about", messages.seo.about);
}

export default async function LocaleAboutPage({ params }) {
  const { locale } = await params;
  const messages = getMessages(locale);
  const about = messages.about;

  return (
    <main>
      <section className="about-hero">
        <div className="section-copy">
          <p className="eyebrow">{about.eyebrow}</p>
          <h1>{about.h1}</h1>
          <p>{about.intro}</p>
        </div>
        <div className="value-grid">
          {about.cards.map(([label, title, text]) => (
            <article key={title}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <GoogleMapCard locale={locale} />
      <QuoteSection locale={locale} />
    </main>
  );
}
