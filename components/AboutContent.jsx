import Link from "next/link";
import { aboutContent } from "@/data/aboutContent";
import { withLocale } from "@/data/i18n";
import GoogleMapCard from "@/components/GoogleMapCard";
import QuoteSection from "@/components/QuoteSection";

export default function AboutContent({ locale = "en" }) {
  return (
    <main className="about-page">
      <section className="about-hero about-hero-expanded">
        <div className="section-copy">
          <p className="eyebrow">{aboutContent.hero.eyebrow}</p>
          <h1>{aboutContent.hero.title}</h1>
          <p>{aboutContent.hero.text}</p>
          <div className="hero-actions">
            {aboutContent.ctas.map(([label, href], index) => (
              <Link className={`button ${index === 0 ? "primary" : "ghost"}`} href={withLocale(locale, href)} key={label}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <aside className="about-position-card">
          <span>Flexible sourcing advantage</span>
          <p>{aboutContent.intro}</p>
        </aside>
      </section>

      <section className="about-story-grid">
        {aboutContent.sections.map((section) => (
          <article key={section.title}>
            <p className="eyebrow">{section.eyebrow}</p>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="about-service-section">
        <div className="section-heading">
          <p className="eyebrow">Our Service Value</p>
          <h2>Magnetic separator sourcing, selection and export coordination from the buyer's perspective.</h2>
        </div>
        <div className="about-service-grid">
          {aboutContent.values.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-advantage-section">
        <div className="section-heading">
          <p className="eyebrow">Buyer Advantages</p>
          <h2>Fast quotation, practical order support and responsible export communication.</h2>
          <p>
            These service points are designed for overseas buyers who need clear timing, payment coordination,
            installation preparation and shipment confidence before placing an industrial equipment order.
          </p>
        </div>
        <div className="about-advantage-grid">
          {aboutContent.buyerAdvantages.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-scope-section">
        <div className="section-heading">
          <p className="eyebrow">Product Categories</p>
          <h2>Focused on practical magnetic separation equipment solutions.</h2>
        </div>
        <div className="about-scope-grid">
          {aboutContent.productGroups.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-export-section">
        <div className="section-heading">
          <p className="eyebrow">Export Markets</p>
          <h2>Magnetic separation equipment supplied to buyers in 50+ countries and regions.</h2>
          <p>{aboutContent.exportMarkets.intro}</p>
        </div>
        <div className="about-export-grid">
          {aboutContent.exportMarkets.regions.map(([region, countries]) => (
            <article key={region}>
              <span>{region}</span>
              <p>{countries}</p>
            </article>
          ))}
        </div>
        <p className="about-export-note">{aboutContent.exportMarkets.applicationNote}</p>
      </section>

      <section className="about-industries-section">
        <div>
          <p className="eyebrow">Industries We Serve</p>
          <h2>For bulk material handling and industrial processing buyers.</h2>
        </div>
        <div className="about-chip-list">
          {aboutContent.industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </section>

      <section className="about-promise-section">
        <div>
          <p className="eyebrow">Our Promise</p>
          <h2>Realistic, responsible and service-oriented.</h2>
          <p>{aboutContent.finalCta.text}</p>
          <Link className="button primary" href={withLocale(locale, "/inquiry")}>
            {aboutContent.finalCta.title}
          </Link>
        </div>
        <ul>
          {aboutContent.promises.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </section>

      <GoogleMapCard locale={locale} />
      <QuoteSection locale={locale} title="Talk to Cowinmagnet about your magnetic separation project." />
    </main>
  );
}
