"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import BrandIcon from "@/components/BrandIcon";
import { site } from "@/data/site";
import { getDictionary, getDirection, getLocaleFromPath, localizeHref } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

const whatsappChatUrl = `https://wa.me/${site.whatsapp}`;
const whatsappQrUrl = "/images/qr-whatsapp-cowinmagnet.png";
const wechatQrUrl = "/images/qr-wechat-david.png";

export function Footer() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const dir = getDirection(locale);
  const infoLinks = [
    { label: ui.home, href: "/" },
    { label: t.nav.products, href: "/products" },
    { label: ui.industries, href: "/industries" },
    { label: t.nav.blog, href: "/blog" },
    { label: t.nav.news, href: "/news" },
    { label: ui.search, href: "/search" },
    { label: t.nav.about, href: "/about" },
    { label: t.nav.contact, href: "/contact" },
    { label: ui.privacy, href: "/privacy-policy" },
    { label: ui.terms, href: "/terms" }
  ];
  const productLinks = [
    ui.permanentSeries,
    ui.electromagneticSeries,
    ui.rollersBars
  ];

  return (
    <footer className="footer" dir={dir}>
      <div className="footer-cta">
        <div>
          <span className="eyebrow">{t.footer.quoteSupport}</span>
          <h2>{ui.footerHelp}</h2>
          <p>{t.footer.quoteText}</p>
        </div>
        <Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">
          {t.common.getQuote} <ArrowRight size={17} aria-hidden />
        </Link>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <Link href={localizeHref("/", locale)} className="footer-brand-mark" aria-label={`COWIN MAGNET — ${ui.home}`}>
            <Image src="/images/cowin-logo.png" width={82} height={82} alt="COWIN MAGNET logo" />
            <span>COWIN MAGNET</span>
          </Link>
          <p>{t.footer.brandText}</p>
          <div className="footer-badges">
            <span>OEM/ODM</span>
            <span>{ui.globalB2b}</span>
            <span>{ui.serviceFirst}</span>
          </div>
        </div>

        <div className="footer-links">
          <h3>{ui.navigationLinks}</h3>
          <ul>
            {infoLinks.map((item) => (
              <li key={item.href}>
                <Link href={localizeHref(item.href, locale)}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-links">
          <h3>{t.nav.products}</h3>
          <ul>
            {productLinks.map((item) => (
              <li key={item}>
                <Link href={localizeHref("/products", locale)}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-contact-card">
          <h3>{ui.contacts}</h3>
          <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer nofollow" className="footer-contact-line">
            <MapPin size={19} aria-hidden />
            <span>{site.address}</span>
          </a>
          <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer nofollow" className="footer-contact-line" data-whatsapp-placement="footer-phone" data-whatsapp-component="site-footer">
            <Phone size={19} aria-hidden />
            <span>{site.whatsapp}</span>
          </a>
          <a href={`mailto:${site.email}`} className="footer-contact-line">
            <Mail size={19} aria-hidden />
            <span>{site.email}</span>
          </a>
          <div className="footer-chat">
            <span>{ui.chatNow}</span>
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer nofollow" data-whatsapp-placement="footer-chat" data-whatsapp-component="site-footer">WhatsApp</a>
          </div>
        </div>

        <div className="footer-connect">
          <h3>{ui.connect}</h3>
          <div className="footer-qr-grid">
            <figure>
              <Image src={whatsappQrUrl} width={168} height={168} alt={`WhatsApp — ${ui.connect} COWIN MAGNET`} />
              <figcaption>WhatsApp</figcaption>
            </figure>
            <figure>
              <Image src={wechatQrUrl} width={168} height={168} alt="WeChat — David, COWIN MAGNET" />
              <figcaption>WeChat</figcaption>
            </figure>
          </div>
          <div className="footer-social-buttons" aria-label={ui.connect}>
            <a href={whatsappChatUrl} target="_blank" rel="noopener noreferrer nofollow" aria-label="WhatsApp" data-whatsapp-placement="footer-social" data-whatsapp-component="site-footer">
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
        <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer nofollow">{site.address}</a>
      </div>
    </footer>
  );
}
