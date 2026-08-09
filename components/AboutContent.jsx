import Link from "next/link";
import { aboutContent } from "@/data/aboutContent";
import { withLocale } from "@/data/i18n";
import GoogleMapCard from "@/components/GoogleMapCard";
import QuoteSection from "@/components/QuoteSection";

const valueIcons = ["01", "02", "03", "04", "05", "06", "07", "08"];
const advantageMetrics = ["24h", "10d", "30%", "QC", "TEST", "CARE"];

function ExportWorldMap() {
  const routes = [
    { label: "Southeast Asia", d: "M380 220 C470 250 560 280 650 350", x: 650, y: 350 },
    { label: "Middle East", d: "M380 220 C470 180 555 170 650 210", x: 650, y: 210 },
    { label: "Africa", d: "M380 220 C500 270 585 345 650 455", x: 650, y: 455 },
    { label: "South America", d: "M380 220 C540 210 730 300 840 430", x: 840, y: 430 },
    { label: "North America", d: "M380 220 C535 120 710 95 850 150", x: 850, y: 150 }
  ];

  return (
    <div className="export-map-card" aria-label="Animated export route map from China to global buyers">
      <svg viewBox="0 0 980 560" role="img">
        <title>Cowinmagnet export routes from China</title>
        <defs>
          <radialGradient id="mapGlow" cx="38%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#2bb7ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#07111f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="980" height="560" rx="26" fill="url(#mapGlow)" />
        <path className="map-land" d="M156 145l86-45 122 23 31 72-70 42-114-12-55-80Zm246-31 117-18 102 45-28 62-112 14-89-42 10-61Zm225 88 92-34 96 46 45 88-72 58-108-35-66-71 13-52ZM160 326l95-33 94 35 29 85-63 58-118-15-62-66 25-64Zm367 58 105-42 98 63 28 112-82 38-107-46-52-79 10-46Zm204-252 107-51 94 32 16 77-78 43-102-14-37-87Z" />
        <g className="map-grid-lines">
          <path d="M80 170h830M80 280h830M80 390h830M230 72v416M390 72v416M550 72v416M710 72v416" />
        </g>
        <g className="china-pin">
          <circle cx="380" cy="220" r="15" />
          <circle cx="380" cy="220" r="5" />
          <text x="402" y="216">China</text>
          <text x="402" y="237">Quzhou export coordination</text>
        </g>
        {routes.map((route, index) => (
          <g className="export-route" style={{ "--route-delay": `${index * 0.36}s` }} key={route.label}>
            <path d={route.d} />
            <circle cx={route.x} cy={route.y} r="8" />
            <text x={route.x + 14} y={route.y + 5}>{route.label}</text>
          </g>
        ))}
      </svg>
      <div className="export-map-stats">
        <span><strong>50+</strong> countries</span>
        <span><strong>5</strong> key regions</span>
        <span><strong>Export</strong> coordination</span>
      </div>
    </div>
  );
}

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
          <div className="about-position-points">
            <b>Selection</b>
            <b>Inspection</b>
            <b>Export</b>
          </div>
        </aside>
      </section>

      <section className="about-story-grid">
        {aboutContent.sections.map((section, index) => (
          <article key={section.title}>
            <span className="about-card-index">0{index + 1}</span>
            <p className="eyebrow">{section.eyebrow}</p>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="about-service-section">
        <div className="section-heading">
          <p className="eyebrow">Our Service Value</p>
          <h2>Magnetic separator sourcing, selection and export coordination from the buyer&apos;s perspective.</h2>
        </div>
        <div className="about-service-grid">
          {aboutContent.values.map(([title, text], index) => (
            <article key={title}>
              <span>{valueIcons[index]}</span>
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
          {aboutContent.buyerAdvantages.map(([title, text], index) => (
            <article key={title}>
              <span>{advantageMetrics[index]}</span>
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
        <div className="about-export-layout">
          <div className="section-heading">
            <p className="eyebrow">Export Markets</p>
            <h2>Magnetic separation equipment supplied to buyers in 50+ countries and regions.</h2>
            <p>{aboutContent.exportMarkets.intro}</p>
          </div>
          <ExportWorldMap />
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
          <p>Choose the industry, then send material and conveyor details. We match the equipment direction around real working conditions.</p>
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
          {aboutContent.promises.map((promise, index) => (
            <li key={promise}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {promise}
            </li>
          ))}
        </ul>
      </section>

      <GoogleMapCard locale={locale} />
      <QuoteSection locale={locale} title="Talk to Cowinmagnet about your magnetic separation project." />
    </main>
  );
}
