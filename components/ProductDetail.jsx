import Link from "next/link";
import OptimizedBannerPicture from "@/components/OptimizedBannerPicture";
import ProductConversionSection, { ProductJsonLd } from "@/components/ProductConversionSection";
import { absoluteLocalizedUrl, withLocale } from "@/data/i18n";
import { getProductBySlug } from "@/data/productCatalog";
import { getMessages } from "@/messages";

const specs = [
  ["RCYD(C)-5", "500 mm", "4.5 m/s", "150 mm", "1.5 kW"],
  ["RCYD(C)-6", "600 mm", "4.5 m/s", "175 mm", "1.5 kW"],
  ["RCYD(C)-8", "800 mm", "4.5 m/s", "250 mm", "2.2 kW"],
  ["RCYD(C)-10", "1000 mm", "4.5 m/s", "300 mm", "3 kW"],
  ["RCYD(C)-12", "1200 mm", "4.5 m/s", "300 mm", "3 kW"]
];

const tabAnchors = ["#overview", "#why", "#selection", "#specs", "#video", "#quote"];

const homeApplications = [
  ["Mining & Mineral Processing", "Tramp iron protection and magnetic separation support for ore conveyors and processing lines."],
  ["Recycling Industry", "Ferrous recovery and equipment protection for mixed waste, scrap and C&D recycling plants."],
  ["Aggregate & Quarry", "Remove metal contamination before crushers, screens and transfer points."],
  ["Cement & Building Materials", "Protect raw material, clinker, coal and additive conveying systems."],
  ["Coal Handling", "Reduce downstream equipment risk on coal conveyors and bunker feeding lines."],
  ["Power Plant", "Support bulk fuel handling systems with reliable iron removal before critical equipment."],
  ["Plastic & Rubber Recycling", "Capture ferrous contamination before shredding, granulating and sorting processes."],
  ["Bulk Material Handling", "Match magnetic equipment to conveyor width, burden depth and installation space."]
];

const installationOptions = [
  ["Cross Belt Installation", "A self-cleaning separator is installed across the conveyor to discharge captured iron to the side."],
  ["Inline Belt Installation", "The separator is positioned along the material flow direction for longer magnetic exposure."],
  ["Overhead Suspension", "Manual or self-cleaning suspended magnets protect crushers, shredders and screens from tramp iron."],
  ["Magnetic Head Pulley", "A magnetic pulley replaces the conveyor head pulley for continuous separation at discharge."]
];

function MountingSketch({ index }) {
  const magnetX = [106, 138, 122, 196][index];
  const magnetY = [54, 44, 36, 88][index];

  return (
    <svg viewBox="0 0 320 180" role="img" aria-label={`${installationOptions[index][0]} diagram`}>
      <rect x="24" y="104" width="230" height="34" rx="17" className="mounting-belt" />
      <path d="M44 121h192" className="mounting-flow" />
      <circle cx="252" cy="121" r="24" className={index === 3 ? "mounting-magnet-pulley" : "mounting-roller"} />
      {index !== 3 && (
        <>
          <rect x={magnetX} y={magnetY} width="92" height="42" rx="8" className="mounting-magnet" />
          <path d={`M${magnetX + 16} ${magnetY + 42} C${magnetX + 38} 110 ${magnetX + 62} 110 ${magnetX + 80} ${magnetY + 42}`} className="mounting-field" />
        </>
      )}
      {index === 3 && <path d="M238 103c22 14 32 29 30 52" className="mounting-field" />}
      <g className="mounting-material">
        <circle cx="70" cy="96" r="4" />
        <circle cx="94" cy="94" r="3" />
        <circle cx="116" cy="98" r="4" />
        <circle cx="140" cy="96" r="3" />
      </g>
    </svg>
  );
}

function GlobalMarketSection({ locale }) {
  const regions = ["North America", "South America", "Europe", "Middle East", "Southeast Asia", "Africa", "Australia"];

  return (
    <section className="global-market-section">
      <div className="section-copy">
        <p className="eyebrow">Serving global customers</p>
        <h2>Magnetic separation equipment sourcing and export support for worldwide projects.</h2>
        <p>
          Cowinmagnet supports overseas buyers with product matching, OEM/ODM coordination, quality inspection
          communication and export logistics for mining, recycling, cement, coal and bulk material handling projects.
        </p>
        <Link className="button primary" href={withLocale(locale, "/contact")}>
          Talk to Export Support
        </Link>
      </div>
      <div className="global-map-visual" aria-label="Global market route map">
        <svg viewBox="0 0 760 420" role="img">
          <title>Cowinmagnet global market support map</title>
          <path className="global-land" d="M88 112l90-42 126 24 34 62-68 54-126-18-56-80Zm238-24 116-24 118 44-28 76-128 12-92-52 14-56Zm246 74 92-38 72 48 14 84-62 52-88-34-46-80 18-32ZM96 268l102-36 92 44 26 72-68 42-112-18-62-62 22-42Zm332 52 112-46 98 60 22 70-96 18-102-38-48-44 14-20Z" />
          <g className="global-grid">
            <path d="M48 132h664M48 220h664M48 308h664M160 60v300M304 60v300M448 60v300M592 60v300" />
          </g>
          <g className="global-origin">
            <circle cx="512" cy="190" r="8" />
            <text x="526" y="194">China</text>
          </g>
          {[
            ["M512 190 C420 122 318 114 214 142", 214, 142],
            ["M512 190 C424 246 320 288 208 318", 208, 318],
            ["M512 190 C450 128 392 106 344 112", 344, 112],
            ["M512 190 C552 164 594 162 636 190", 636, 190],
            ["M512 190 C558 236 604 286 664 332", 664, 332]
          ].map(([d, x, y], index) => (
            <g className="global-route" style={{ "--route-delay": `${index * 0.32}s` }} key={d}>
              <path d={d} />
              <circle cx={x} cy={y} r="6" />
            </g>
          ))}
        </svg>
        <div className="global-region-list">
          {regions.map((region) => <span key={region}>{region}</span>)}
        </div>
      </div>
    </section>
  );
}

export default function ProductDetail({ locale = "en", context = "detail" }) {
  const messages = getMessages(locale);
  const t = messages.home;
  const product = getProductBySlug("permanent-overband-magnetic-separator");
  const isHome = context === "home";
  const shownTabs = t.tabs
    .map((tab, index) => [tab, tabAnchors[index]])
    .filter(([tab]) => !isHome || !["Selection Data", "Specifications"].includes(tab));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteLocalizedUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: "Products", item: absoluteLocalizedUrl(locale, "/products") },
      { "@type": "ListItem", position: 3, name: product.title, item: absoluteLocalizedUrl(locale, `/products/${product.slug}`) }
    ]
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faqs.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };

  return (
    <main>
      <ProductJsonLd product={product} locale={locale} />
      {!isHome && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}
      {!isHome && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <section className="product-hero" id="overview">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="breadcrumb">{t.breadcrumb}</p>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.h1}</h1>
            <p className="hero-text">{t.text}</p>
            <div className="hero-actions">
              <Link className="button primary" href={withLocale(locale, "/products")}>
                {t.primaryCta}
              </Link>
              <Link className="button ghost" href={withLocale(locale, "/inquiry")}>
                {t.secondaryCta}
              </Link>
              <Link className="button ghost" href={withLocale(locale, "/contact")}>
                Contact Export Support
              </Link>
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

      <nav className={`product-tabs ${isHome ? "product-tabs-compact" : ""}`} aria-label="Product detail sections">
        {shownTabs.map(([tab, anchor]) => (
          <a key={tab} href={anchor}>
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

      <section className={`selection-band ${isHome ? "selection-band-compact" : ""}`} id="selection">
        <div className="selection-copy">
          <p className="eyebrow">{t.selectionEyebrow}</p>
          <h2>{isHome ? "Key data for model recommendation" : t.selectionTitle}</h2>
          <p>{t.selectionText}</p>
          {isHome && (
            <Link className="button ghost selection-detail-link" href={withLocale(locale, "/products/permanent-overband-magnetic-separator")}>
              View Product Details
            </Link>
          )}
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

      {!isHome && (
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
      )}

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
          <h2>Applications across industrial material handling lines.</h2>
          <p>
            Cowinmagnet magnetic separation equipment is widely used in mining, recycling, cement, coal,
            aggregate processing and bulk material handling industries.
          </p>
        </div>
        <div className="home-application-grid">
          {homeApplications.map(([title, text], index) => (
            <article key={title} style={{ "--app-index": index }}>
              <h3>{title}</h3>
              <p>{text}</p>
              <Link href={withLocale(locale, "/applications")}>Learn More</Link>
            </article>
          ))}
        </div>
        <div className="section-actions">
          <Link className="button ghost" href={withLocale(locale, "/applications")}>
            View All Applications
          </Link>
        </div>
      </section>

      <GlobalMarketSection locale={locale} />

      <section className="mounting-section">
        <div className="section-heading">
          <p className="eyebrow">Installation options</p>
          <h2>Mounting methods for conveyor magnetic separation projects.</h2>
          <p>
            Installation direction depends on conveyor layout, burden depth, discharge side, available space and
            whether automatic cleaning is required.
          </p>
        </div>
        <div className="mounting-grid">
          {installationOptions.map(([title, text], index) => (
            <article key={title}>
              <MountingSketch index={index} />
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

      <ProductConversionSection currentSlug="permanent-overband-magnetic-separator" locale={locale} />
    </main>
  );
}
