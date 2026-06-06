import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import { allProducts } from "@/data/productCatalog";
import { withLocale } from "@/data/i18n";

const heroStats = [
  ["50+", "export markets and regions"],
  ["24h", "quotation direction after clear requirements"],
  ["QC", "photo, video and inspection communication support"]
];

const productEntryCards = [
  {
    title: "Magnetic Separation",
    text: "Overband separators, suspended magnets, magnetic drums and pulleys for conveyor iron removal.",
    href: "/products#permanent-magnetic-equipment",
    label: "Conveyor protection"
  },
  {
    title: "Electromagnetic Separators",
    text: "Higher-force separator options for heavy-duty bulk material lines and demanding working conditions.",
    href: "/products#electromagnetic-equipment",
    label: "Heavy-duty lines"
  },
  {
    title: "Magnetic Filtration",
    text: "Magnetic rods, grids, plates and pipeline separators for powder, granule and fine contamination capture.",
    href: "/products#magnetic-rollers-bars-components",
    label: "Fine iron removal"
  },
  {
    title: "Selection & Export Support",
    text: "Send material and conveyor data. Cowinmagnet helps match equipment, coordinate QC and prepare export details.",
    href: "/inquiry",
    label: "Buyer support"
  }
];

const industries = [
  ["Recycling", "Ferrous recovery and shredder protection for mixed waste and scrap handling.", "/applications#waste-recycling"],
  ["Mining", "Tramp iron removal before crushers, screens and transfer points.", "/applications#mining-mineral-processing"],
  ["Quarry & Aggregate", "Protect conveyor and crushing equipment from metal contamination.", "/applications#quarry-aggregate"],
  ["Cement & Coal", "Raw material, coal and clinker conveying protection.", "/applications#cement-building-materials"],
  ["Food & Powder", "Magnetic rods and grids for fine iron capture in hoppers and chutes.", "/applications#food-grain-powder"],
  ["Bulk Material Handling", "Separator selection around belt width, burden depth and discharge layout.", "/applications"]
];

const proofPoints = [
  ["Flexible sourcing", "We are not limited to one fixed factory range, so buyers can compare more suitable equipment options."],
  ["Technical communication", "We translate working conditions into practical selection data before quotation."],
  ["Inspection support", "Production photos, videos, dimensions and packaging checks can be coordinated before shipment."],
  ["Export coordination", "Commercial documents, packaging confirmation and shipment communication stay connected."]
];

const selectionData = [
  "Material type and particle size",
  "Conveyor belt width and speed",
  "Material layer thickness",
  "Iron size and iron amount",
  "Installation height and available space",
  "Cleaning method preference",
  "Working environment",
  "Photos, drawings or video"
];

const featuredSlugs = [
  "permanent-overband-magnetic-separator",
  "suspended-permanent-magnetic-separator",
  "suspended-electromagnetic-separator",
  "self-cleaning-electromagnetic-separator",
  "permanent-magnetic-drum",
  "permanent-magnetic-pulley",
  "magnetic-bar-magnetic-rod",
  "eddy-current-separator"
];

export default function HomePage({ locale = "en" }) {
  const featuredProducts = featuredSlugs
    .map((slug) => allProducts.find((product) => product.slug === slug))
    .filter(Boolean);

  return (
    <main className="home-page bunting-inspired-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Quzhou Qiying Import & Export Co., Ltd.",
            alternateName: "Cowinmagnet",
            url: "https://www.cowinmagnet.com",
            logo: "https://www.cowinmagnet.com/assets/logo.jpg",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Room 110, 1st Floor, Building 2, Qushidai Future Building, Kecheng District",
              addressLocality: "Quzhou",
              addressRegion: "Zhejiang Province",
              addressCountry: "CN"
            },
            description:
              "Cowinmagnet is a magnetic separation equipment sourcing and export service partner for global industrial buyers."
          })
        }}
      />

      <section className="bunting-hero">
        <div className="bunting-hero-copy">
          <p className="eyebrow">Magnetic separator sourcing from China</p>
          <h1>Get Iron Out of Your Material Flow</h1>
          <p>
            Cowinmagnet helps overseas buyers source magnetic separation equipment, compare suitable product types,
            coordinate customization, review inspection details and prepare export communication.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href={withLocale(locale, "/inquiry")}>
              Send Requirements
            </Link>
            <Link className="button ghost" href={withLocale(locale, "/products")}>
              Explore Products
            </Link>
          </div>
        </div>
        <aside className="bunting-hero-panel" aria-label="Fast equipment selection routes">
          <ResponsiveImage
            src="/assets/products/automatic-cleaning-magnetic-separator.webp"
            alt="Self-cleaning magnetic separator for conveyor belt iron removal"
            width={900}
            height={640}
            sizes="(max-width: 860px) 92vw, 46vw"
            priority
          />
          <div className="bunting-hero-routes">
            {productEntryCards.slice(0, 3).map((card) => (
              <Link key={card.title} href={withLocale(locale, card.href)}>
                <span>{card.label}</span>
                <strong>{card.title}</strong>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="bunting-stat-strip" aria-label="Cowinmagnet export support proof">
        {heroStats.map(([value, label]) => (
          <div key={value}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="bunting-section bunting-product-entry">
        <div className="bunting-section-heading">
          <p className="eyebrow">Products</p>
          <h2>Start With the Equipment Family That Matches Your Problem</h2>
          <p>
            B2B buyers usually do not start with a model number. They start with a material problem, a conveyor layout
            and a separation target. These four entry points make the path faster.
          </p>
        </div>
        <div className="bunting-product-entry-grid">
          {productEntryCards.map((card) => (
            <Link key={card.title} href={withLocale(locale, card.href)}>
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <b>View route</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="bunting-section">
        <div className="bunting-section-heading bunting-heading-row">
          <div>
            <p className="eyebrow">Industries</p>
            <h2>Magnetic Separation Applications by Industry</h2>
          </div>
          <Link className="button ghost bunting-light-button" href={withLocale(locale, "/applications")}>
            View All Applications
          </Link>
        </div>
        <div className="bunting-industry-grid">
          {industries.map(([title, text, href]) => (
            <Link key={title} href={withLocale(locale, href)}>
              <span>{title.slice(0, 2).toUpperCase()}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bunting-section bunting-trust-section">
        <div>
          <p className="eyebrow">Trusted sourcing workflow</p>
          <h2>Magnetic Solutions Supported Through Selection, QC and Export Communication</h2>
          <p>
            Cowinmagnet is not presented as a single factory catalog. We are a service-led export partner that helps
            buyers reduce selection mistakes and communication friction before they place an industrial order.
          </p>
          <Link className="button primary" href={withLocale(locale, "/about")}>
            Learn About Cowinmagnet
          </Link>
        </div>
        <div className="bunting-proof-grid">
          {proofPoints.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bunting-section">
        <div className="bunting-section-heading bunting-heading-row">
          <div>
            <p className="eyebrow">Featured products</p>
            <h2>Common Magnetic Separator Products Buyers Compare First</h2>
          </div>
          <Link className="button ghost bunting-light-button" href={withLocale(locale, "/products")}>
            Product Center
          </Link>
        </div>
        <div className="bunting-featured-grid">
          {featuredProducts.map((product) => (
            <Link href={withLocale(locale, `/products/${product.slug}`)} key={product.slug}>
              <ResponsiveImage
                src={product.image}
                alt={product.imageAlt || product.title}
                width={520}
                height={360}
                sizes="(max-width: 760px) 88vw, (max-width: 1180px) 30vw, 280px"
              />
              <span>{product.categoryTitle}</span>
              <h3>{product.shortTitle}</h3>
              <p>{product.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bunting-section bunting-test-section">
        <figure>
          <ResponsiveImage
            src="/assets/products/suspended-electromagnetic-conveyor-belt-separator.webp"
            alt="Electromagnetic separator product inspection and selection support"
            width={900}
            height={640}
            sizes="(max-width: 860px) 92vw, 42vw"
          />
        </figure>
        <div>
          <p className="eyebrow">Validate before you buy</p>
          <h2>Use Material Data, Photos and Inspection Video Before Confirming a Model</h2>
          <p>
            Instead of guessing from a catalog, send your working conditions. We can review application data, coordinate
            production progress photos, testing information and shipment inspection communication when requirements are confirmed.
          </p>
          <ul>
            {selectionData.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Link className="button primary" href={withLocale(locale, "/inquiry")}>
            Send Working Conditions
          </Link>
        </div>
      </section>

      <section className="bunting-final-help">
        <p className="eyebrow">We are here to help</p>
        <h2>Not Sure Which Magnetic Separator Fits Your Line?</h2>
        <p>
          Tell us your material type, belt width, installation position and target separation result. Cowinmagnet will
          help organize the next step for model selection and quotation communication.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href={withLocale(locale, "/inquiry")}>Request Recommendation</Link>
          <Link className="button ghost bunting-light-button" href={withLocale(locale, "/contact")}>Contact Us</Link>
        </div>
      </section>
    </main>
  );
}
