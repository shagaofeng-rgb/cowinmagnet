import Link from "next/link";
import OptimizedBannerPicture from "@/components/OptimizedBannerPicture";
import { withLocale } from "@/data/i18n";
import { getMessages } from "@/messages";

const specs = [
  ["RCYD(C)-5", "500 mm", "4.5 m/s", "150 mm", "1.5 kW"],
  ["RCYD(C)-6", "600 mm", "4.5 m/s", "175 mm", "1.5 kW"],
  ["RCYD(C)-8", "800 mm", "4.5 m/s", "250 mm", "2.2 kW"],
  ["RCYD(C)-10", "1000 mm", "4.5 m/s", "300 mm", "3 kW"],
  ["RCYD(C)-12", "1200 mm", "4.5 m/s", "300 mm", "3 kW"]
];

const tabAnchors = ["#overview", "#why", "#selection", "#specs", "#video", "#quote"];

export default function ProductDetail({ locale = "en" }) {
  const messages = getMessages(locale);
  const t = messages.home;

  return (
    <main>
      <section className="product-hero" id="overview">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="breadcrumb">{t.breadcrumb}</p>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.h1}</h1>
            <p className="hero-text">{t.text}</p>
            <div className="hero-actions">
              <Link className="button primary" href={withLocale(locale, "/contact")}>
                {t.primaryCta}
              </Link>
              <a className="button ghost" href="#video">
                {t.secondaryCta}
              </a>
            </div>
          </div>

          <aside className="hero-stack" aria-label="Key product facts">
            <figure className="hero-visual">
              <OptimizedBannerPicture alt={t.imageAlt} eager />
              <figcaption>{t.imageCaption}</figcaption>
            </figure>
            <div className="hero-panel">
              <p className="panel-label">{t.quickFit}</p>
              <dl className="fit-grid">
                <div><dt>{t.beltWidth}</dt><dd>500-2000 mm</dd></div>
                <div><dt>{t.cleaningType}</dt><dd>{t.automatic}</dd></div>
                <div><dt>{t.magnetType}</dt><dd>{t.permanent}</dd></div>
                <div><dt>{t.bestFor}</dt><dd>{t.continuousLines}</dd></div>
              </dl>
              <div className="panel-note">
                <strong>{t.needHelp}</strong>
                <span>{t.helpText}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <nav className="product-tabs" aria-label="Product detail sections">
        {t.tabs.map((tab, index) => (
          <a key={tab} href={tabAnchors[index]}>
            {tab}
          </a>
        ))}
      </nav>

      <section className="trust-strip" aria-label="Product advantages">
        {t.trust.map((item, index) => (
          <div key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item}</strong>
          </div>
        ))}
      </section>

      <section className="split-section" id="why">
        <div className="section-copy">
          <p className="eyebrow">{t.whyEyebrow}</p>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
        </div>
        <div className="value-grid">
          {t.values.map(([label, title, text]) => (
            <article key={title}>
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="selection-band" id="selection">
        <div className="selection-copy">
          <p className="eyebrow">{t.selectionEyebrow}</p>
          <h2>{t.selectionTitle}</h2>
          <p>{t.selectionText}</p>
        </div>
        <div className="selection-grid">
          {t.selectionCards.map(([label, text]) => (
            <article key={label}>
              <span>{label}</span>
              <strong>{text}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="spec-section" id="specs">
        <div className="section-heading">
          <p className="eyebrow">{t.specsEyebrow}</p>
          <h2>{t.specsTitle}</h2>
          <p>{t.specsText}</p>
        </div>
        <div className="spec-table" role="table" aria-label="Permanent overband magnetic separator specifications">
          <div className="spec-head" role="row">
            <span>Model</span><span>Belt Width</span><span>Belt Speed</span><span>Suspension Height</span><span>Motor Power</span>
          </div>
          {specs.map((row) => (
            <div role="row" key={row[0]}>
              {row.map((cell) => <span key={cell}>{cell}</span>)}
            </div>
          ))}
        </div>
      </section>

      <section className="media-section" id="video">
        <div className="video-copy">
          <p className="eyebrow">{t.videoEyebrow}</p>
          <h2>{t.videoTitle}</h2>
          <p>{t.videoText}</p>
        </div>
        <video controls preload="none" poster="/assets/magnetic-separator-banner-800.webp">
          <source src="/assets/self-unloading-product-video.mp4" type="video/mp4" />
        </video>
      </section>

      <section className="application-section" id="applications">
        <div className="section-heading">
          <p className="eyebrow">{t.applicationsEyebrow}</p>
          <h2>{t.applicationsTitle}</h2>
        </div>
        <div className="application-grid">
          {t.applications.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading">
          <p className="eyebrow">{t.faqEyebrow}</p>
          <h2>{t.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {t.faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
