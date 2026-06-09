import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { withLocale } from "@/data/i18n";
import { getMessages } from "@/messages";
import ResponsiveImage from "@/components/ResponsiveImage";

const footerProductGroups = [
  {
    title: "Permanent Magnetic Separation Equipment",
    items: [
      { label: "Suspended Permanent Magnetic Separator", href: "/products/suspended-permanent-magnetic-separator" },
      { label: "Self-Cleaning Permanent Magnetic Separator", href: "/products/permanent-overband-magnetic-separator" },
      { label: "Permanent Magnetic Drum", href: "/products/permanent-magnetic-drum" },
      { label: "Permanent Magnetic Roller / Pulley", href: "/products/permanent-magnetic-pulley" },
      { label: "Pipeline Magnetic Separator", href: "/products/pipeline-permanent-magnetic-separator" }
    ]
  },
  {
    title: "Permanent Magnetic Filtration Equipment",
    items: [
      { label: "Magnetic Bar", href: "/products/magnetic-bar-magnetic-rod" },
      { label: "Magnetic Grate", href: "/products/magnetic-grid-magnetic-grate" },
      { label: "Magnetic Drawer Separator", href: "/products/magnetic-drawer-separator" },
      { label: "Magnetic Trap / Liquid Separator", href: "/products/magnetic-trap-liquid-line-separator" },
      { label: "Rotary Pipe Magnet", href: "/products/rotary-pipe-magnet" }
    ]
  },
  {
    title: "Electromagnetic Separation Equipment",
    items: [
      { label: "Suspended Electromagnetic Separator", href: "/products/suspended-electromagnetic-separator" },
      { label: "Self-Cleaning Electromagnetic Separator", href: "/products/self-cleaning-electromagnetic-separator" },
      { label: "Air-Cooled Electromagnetic Separator", href: "/products/air-cooled-electromagnetic-separator" },
      { label: "Oil-Cooled Electromagnetic Separator", href: "/products/oil-cooled-electromagnetic-separator" },
      { label: "Explosion-Proof Electromagnetic Separator", href: "/products/explosion-proof-electromagnetic-separator" }
    ]
  },
  {
    title: "Mineral & Recycling Separation Equipment",
    items: [
      { label: "Wet Drum Magnetic Separator", href: "/products/wet-drum-magnetic-separator" },
      { label: "Dry Drum Magnetic Separator", href: "/products/dry-drum-magnetic-separator" },
      { label: "High-Intensity Magnetic Separator", href: "/products/high-intensity-magnetic-separator" },
      { label: "Eddy Current Separator", href: "/products/eddy-current-separator" },
      { label: "Conveyor Metal Detector", href: "/products/dls-type-window-metal-detector" }
    ]
  }
];

export default function Footer({ locale = "en" }) {
  const messages = getMessages(locale);
  const footer = messages.footer;
  const companyLinks = [
    { href: "/products", label: footer.productCenter },
    { href: "/about", label: messages.nav.about },
    { href: "/applications", label: messages.nav.applications },
    { href: "/factory", label: messages.nav.factory },
    { href: "/blog", label: messages.nav.blog },
    { href: "/news", label: messages.nav.news },
    { href: "/contact", label: messages.nav.contact }
  ];

  return (
    <footer className="site-footer">
      <div className="footer-topline">
        <div className="footer-brand">
          <Link className="footer-logo" href={withLocale(locale, "/")}>
            <ResponsiveImage
              src="/assets/logo.jpg"
              alt="Cowinmagnet logo"
              width={52}
              height={52}
              sizes="52px"
              quality={85}
            />
            <span>Cowinmagnet</span>
          </Link>
          <p>{footer.text}</p>
        </div>

        <div className="footer-action">
          <span>{footer.ready}</span>
          <Link className="button primary" href={withLocale(locale, "/inquiry")}>
            {footer.cta}
          </Link>
        </div>
      </div>

      <div className="footer-product-map">
        <div className="footer-product-columns">
          {footerProductGroups.map((category) => (
            <section key={category.title} className="footer-product-card">
              <h3>
                <Link href={withLocale(locale, "/products")}>{category.title}</Link>
              </h3>
              <ul>
                {category.items.map((item) => (
                  <li key={item.label}>
                    <Link href={withLocale(locale, item.href)}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <nav className="footer-company-row" aria-label="Company links">
          <strong>{footer.company}</strong>
          <div>
            {companyLinks.map((item) => (
              <Link key={item.href} href={withLocale(locale, item.href)}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>www.cowinmagnet.com</p>
        <div className="footer-social">
          <span>{footer.follow}</span>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
}
