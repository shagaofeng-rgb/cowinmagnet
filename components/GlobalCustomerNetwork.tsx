import Image from "next/image";
import Link from "next/link";

type Category = {
  title: string;
  count: number;
  href: string;
};

type GlobalCustomerNetworkProps = {
  categories: Category[];
};

const partners = [
  { name: "China", x: 72, y: 47, core: true },
  { name: "United States", x: 19, y: 41 },
  { name: "Canada", x: 17, y: 25 },
  { name: "United Kingdom", x: 46, y: 31 },
  { name: "Netherlands", x: 48, y: 32 },
  { name: "Germany", x: 50, y: 34 },
  { name: "Switzerland", x: 50.5, y: 38 },
  { name: "Israel", x: 56, y: 45 },
  { name: "Singapore", x: 68.5, y: 64 },
  { name: "Hong Kong", x: 73.7, y: 52 },
  { name: "Australia", x: 79, y: 78 }
];

const routes = [
  "M720 260 Q520 120 190 215",
  "M720 260 Q520 72 170 135",
  "M720 260 Q640 125 462 168",
  "M720 260 Q640 125 492 175",
  "M720 260 Q626 132 508 187",
  "M720 260 Q625 160 512 208",
  "M720 260 Q640 190 560 246",
  "M720 260 Q715 292 688 352",
  "M720 260 Q732 270 738 286",
  "M720 260 Q780 335 792 430"
];

export function GlobalCustomerNetwork({ categories }: GlobalCustomerNetworkProps) {
  return (
    <section className="global-network-section" aria-labelledby="global-network-title">
      <div className="global-network-grid">
        <div className="global-network-copy">
          <span className="eyebrow">Global Customer Network</span>
          <h2 id="global-network-title">Connected from China to partners worldwide</h2>
          <p>
            Cowinmagnet supports buyers across major industrial markets with magnetic separator selection,
            sourcing coordination, inspection communication and export follow-up.
          </p>
          <div className="network-metrics" aria-label="Global customer network summary">
            <span><strong>10+</strong> export regions</span>
            <span><strong>3</strong> product families</span>
            <span><strong>OEM</strong> support</span>
          </div>
          <div className="network-category-list" aria-label="Product category links">
            {categories.map((category) => (
              <Link href={category.href} className="network-category-card" key={category.title}>
                <span>{category.title}</span>
                <small>{category.count} product options</small>
              </Link>
            ))}
          </div>
        </div>

        <div className="network-map-panel" aria-label="Global customer distribution map">
          <div className="network-map-title">
            <span>China hub</span>
            <strong>Active partner locations</strong>
          </div>
          <div className="network-map-stage">
            <Image
              src="/images/global-customer-map-template.jpg"
              alt="World map template for Cowinmagnet customer distribution"
              width={1000}
              height={560}
              sizes="(max-width: 1080px) 100vw, 48vw"
              loading="lazy"
            />
            <svg className="network-route-layer" viewBox="0 0 1000 560" aria-hidden="true">
              {routes.map((route) => (
                <g key={route}>
                  <path className="network-route-base" d={route} />
                  <path className="network-route-flow" d={route} />
                </g>
              ))}
            </svg>
            <div className="network-marker-layer" aria-label="Highlighted customer countries and regions">
              {partners.map((partner) => (
                <span
                  className={`network-marker${partner.core ? " network-marker-core" : ""}`}
                  style={{ left: `${partner.x}%`, top: `${partner.y}%` }}
                  title={partner.name}
                  aria-label={partner.name}
                  key={partner.name}
                >
                  <span>{partner.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
