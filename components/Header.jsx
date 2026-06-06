import Link from "next/link";
import { getProductCategories } from "@/data/productCatalog";
import { withLocale } from "@/data/i18n";
import { getMessages } from "@/messages";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import OptimizedBannerPicture from "@/components/OptimizedBannerPicture";
import ResponsiveImage from "@/components/ResponsiveImage";

const solutionsLinks = [
  ["/factory", "Sourcing & Quality Control", "Supplier coordination, inspection and export preparation"],
  ["/contact", "OEM/ODM Coordination", "Logo, color, size, magnetic strength and packaging coordination"],
  ["/contact", "Export Project Support", "Documents, packaging confirmation and logistics communication"],
  ["/inquiry", "Equipment Selection Support", "Send material and conveyor details for model matching"],
  ["/applications", "Installation Guidance", "Cross belt, inline, overhead and head pulley layouts"]
];

const resourceLinks = [
  ["/news", "News", "Industry news and market observations"],
  ["/blog", "Blog", "Product knowledge and company articles"],
  ["/cases", "Case Studies", "Typical project scenarios"],
  ["/factory", "Technical Guides", "Sourcing, QC and export support workflow"]
];

export default async function Header({ locale = "en" }) {
  const messages = getMessages(locale);
  const nav = messages.nav;
  const productCategories = await getProductCategories();

  return (
    <header className="site-header">
      <Link className="brand" href={withLocale(locale, "/")}>
        <ResponsiveImage
          src="/assets/logo.jpg"
          alt="Cowinmagnet logo"
          width={52}
          height={52}
          sizes="52px"
          priority
          quality={85}
        />
        <span>Cowinmagnet</span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link href={withLocale(locale, "/")}>Home</Link>
        <div className="nav-item has-mega">
          <Link className="nav-trigger nav-trigger-link" href={withLocale(locale, "/products")} aria-haspopup="true">
            {nav.products}
          </Link>
          <div className="mega-panel" role="menu" aria-label="Products mega menu">
            <div className="mega-feature">
              <span>{nav.featured}</span>
              <OptimizedBannerPicture
                alt="Permanent overband magnetic separator"
                sizes="270px"
              />
              <h3>Permanent Overband Magnetic Separator</h3>
              <p>{nav.featuredText}</p>
              <Link href={withLocale(locale, "/products/permanent-overband-magnetic-separator")}>{nav.viewProduct}</Link>
            </div>
            <div className="mega-columns">
              {productCategories.map((category) => (
                <section key={category.id}>
                  <Link className="mega-category-link" href={withLocale(locale, `/products#${category.id}`)}>
                    {category.title}
                  </Link>
                  {category.products.map((product) => (
                    <Link key={product.slug} href={withLocale(locale, `/products/${product.slug}`)}>
                      {product.shortTitle}
                    </Link>
                  ))}
                </section>
              ))}
              <section>
                <p>{nav.buyerPages}</p>
                <Link href={withLocale(locale, "/products")}>{nav.allProducts}</Link>
                <Link href={withLocale(locale, "/applications")}>{nav.applications}</Link>
                <Link href={withLocale(locale, "/factory")}>{nav.factory}</Link>
                <Link href={withLocale(locale, "/cases")}>{nav.cases}</Link>
              </section>
            </div>
          </div>
        </div>
        <Link href={withLocale(locale, "/applications")}>{nav.applications}</Link>
        <div className="nav-item has-simple-menu">
          <Link className="nav-trigger nav-trigger-link" href={withLocale(locale, "/factory")} aria-haspopup="true">
            Solutions
          </Link>
          <div className="simple-menu-panel" role="menu" aria-label="Solutions menu">
            {solutionsLinks.map(([href, title, text]) => (
              <Link href={withLocale(locale, href)} key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </div>
        <Link href={withLocale(locale, "/factory")}>Sourcing & QC</Link>
        <Link href={withLocale(locale, "/blog")}>{nav.blog || "Blog"}</Link>
        <Link href={withLocale(locale, "/news")}>{nav.news || "News"}</Link>
        <div className="nav-item has-simple-menu">
          <Link className="nav-trigger nav-trigger-link" href={withLocale(locale, "/news")} aria-haspopup="true">
            Resources
          </Link>
          <div className="simple-menu-panel" role="menu" aria-label="Resources menu">
            {resourceLinks.map(([href, title, text]) => (
              <Link href={withLocale(locale, href)} key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </div>
        <Link href={withLocale(locale, "/about")}>{nav.about}</Link>
        <Link href={withLocale(locale, "/contact")}>{nav.contact}</Link>
      </nav>

      <MobileNav locale={locale} nav={nav} productCategories={productCategories} />

      <div className="header-actions">
        <LanguageSwitcher locale={locale} />
        <Link className="header-cta" href={withLocale(locale, "/inquiry")}>
          {nav.quote}
        </Link>
      </div>
    </header>
  );
}
