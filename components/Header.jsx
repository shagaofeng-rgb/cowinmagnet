import Link from "next/link";
import { productCategories } from "@/data/productCatalog";
import { withLocale } from "@/data/i18n";
import { getMessages } from "@/messages";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import OptimizedBannerPicture from "@/components/OptimizedBannerPicture";
import ResponsiveImage from "@/components/ResponsiveImage";

export default function Header({ locale = "en" }) {
  const messages = getMessages(locale);
  const nav = messages.nav;

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
        <Link href={withLocale(locale, "/about")}>{nav.about}</Link>
        <Link href={withLocale(locale, "/blog")}>{nav.blog}</Link>
        <Link href={withLocale(locale, "/news")}>{nav.news}</Link>
        <Link href={withLocale(locale, "/inquiry")}>{nav.inquiry}</Link>
        <Link href={withLocale(locale, "/contact")}>{nav.contact}</Link>
      </nav>

      <MobileNav locale={locale} nav={nav} />

      <div className="header-actions">
        <LanguageSwitcher locale={locale} />
        <Link className="header-cta" href={withLocale(locale, "/inquiry")}>
          {nav.quote}
        </Link>
      </div>
    </header>
  );
}
