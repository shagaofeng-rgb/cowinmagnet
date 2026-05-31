import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { productCategories } from "@/data/productCatalog";
import { withLocale } from "@/data/i18n";
import { getMessages } from "@/messages";
import ResponsiveImage from "@/components/ResponsiveImage";

export default function Footer({ locale = "en" }) {
  const messages = getMessages(locale);
  const footer = messages.footer;

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
        {productCategories.map((category) => (
          <section key={category.id}>
            <h3>
              <Link href={withLocale(locale, `/products#${category.id}`)}>{category.title}</Link>
            </h3>
            {category.products.map((product) => (
              <Link key={product.slug} href={withLocale(locale, `/products/${product.slug}`)}>
                {product.shortTitle}
              </Link>
            ))}
          </section>
        ))}

        <section>
          <h3>{footer.company}</h3>
          <Link href={withLocale(locale, "/products")}>{footer.productCenter}</Link>
          <Link href={withLocale(locale, "/about")}>{messages.nav.about}</Link>
          <Link href={withLocale(locale, "/applications")}>{messages.nav.applications}</Link>
          <Link href={withLocale(locale, "/factory")}>{messages.nav.factory}</Link>
          <Link href={withLocale(locale, "/blog")}>{messages.nav.blog}</Link>
          <Link href={withLocale(locale, "/news")}>{messages.nav.news}</Link>
          <Link href={withLocale(locale, "/contact")}>{messages.nav.contact}</Link>
        </section>
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
