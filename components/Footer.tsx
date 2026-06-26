"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import BrandIcon from "@/components/BrandIcon";
import { site } from "@/data/site";
import { getDictionary, getDirection, getLocaleFromPath, localizeHref } from "@/lib/i18n";

const whatsappChatUrl = "https://wa.me/message/FROFUJEVUZDOC1";
const whatsappQrUrl = "/images/qr-whatsapp-cowinmagnet.png";
const wechatQrUrl = "/images/qr-wechat-david.png";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = getDictionary(locale);
  const dir = getDirection(locale);
  const infoLinks = [
    { label: "Home", href: "/" },
    { label: t.nav.products, href: "/products" },
    { label: "Industries", href: "/industries" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.news || "News", href: "/news" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" }
  ];
  const productLinks = [
    "Permanent Magnet Series",
    "Electromagnetic Series",
    "Magnetic Rollers & Magnetic Bars"
  ];

  return (
    <footer className="footer" dir={dir}>
      <div className="footer-cta">
        <div>
          <span className="eyebrow">{t.footer.quoteSupport}</span>
          <h2>Need help selecting industrial equipment?</h2>
          <p>{t.footer.quoteText}</p>
        </div>
        <Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">
          {t.common.getQuote} <ArrowRight size={17} aria-hidden />
        </Link>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link href={localizeHref("/", locale)} className="footer-brand-mark" aria-label="COWIN MAGNET home">
            <img src="/images/logo.jpg" width={82} height={82} alt="COWIN MAGNET logo" />
            <span>COWIN MAGNET</span>
          </Link>
          <p>{site.tagline}</p>
          <div className="footer-badges">
            <span>OEM/ODM</span>
            <span>Global B2B</span>
            <span>Service First</span>
          </div>
        </div>

        <div className="footer-links">
          <h3>Navigation</h3>
          <ul>
            {infoLinks.map((item) => (
              <li key={item.href}>
                <Link href={localizeHref(item.href, locale)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h3>Products</h3>
          <ul>
            {productLinks.map((item) => (
              <li key={item}>
                <Link href={localizeHref("/products", locale)}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-contact-card">
          <h3>Contacts</h3>
          <div className="footer-contact-line">
            <MapPin size={19} aria-hidden />
            <span>{site.address}</span>
          </div>
          <a href={`tel:${site.phone.replaceAll(" ", "")}`} className="footer-contact-line">
            <Phone size={19} aria-hidden />
            <span>{site.whatsapp}</span>
          </a>
          <a href={`mailto:${site.email}`} className="footer-contact-line">
            <Mail size={19} aria-hidden />
            <span>{site.email}</span>
          </a>
          <div className="footer-chat">
            <span>Chat now</span>
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer nofollow">WhatsApp</a>
          </div>
        </div>

        <div className="footer-connect">
          <h3>Connect</h3>
          <div className="footer-qr-grid">
            <figure>
              <img src={whatsappQrUrl} width={168} height={168} alt="WhatsApp QR code for COWIN MAGNET" loading="lazy" />
              <figcaption>WhatsApp</figcaption>
            </figure>
            <figure>
              <img src={wechatQrUrl} width={168} height={168} alt="WeChat QR code for David at COWIN MAGNET" loading="lazy" />
              <figcaption>WeChat</figcaption>
            </figure>
          </div>
          <div className="footer-social-buttons" aria-label="Social links">
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer nofollow" aria-label="WhatsApp">
              <BrandIcon name="whatsapp" />
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer nofollow" aria-label="TikTok">
              <BrandIcon name="tiktok" />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer nofollow" aria-label="Facebook">
              <BrandIcon name="facebook" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; {new Date().getFullYear()} {site.legalName}</span>
        <span>{site.address}</span>
      </div>
    </footer>
  );
}
