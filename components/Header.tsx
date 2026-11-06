"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Factory, Menu, MessageCircle, Search, Sparkles, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { site } from "@/data/site";
import { homeProductFamilies } from "@/lib/homeProductTaxonomy";
import { getDictionary, getDirection, getLocaleFromPath, localizeHref, stripLocale } from "@/lib/i18n";
import { getPublicUi } from "@/lib/publicUi";

// Keep the interactive header bundle independent from the full product and industry datasets.
const featuredProducts = [
  { slug: "suspended-permanent-magnetic-separator", name: "Suspended Permanent Magnetic Separator" },
  { slug: "suspended-electromagnetic-conveyor-belt-separator", name: "Suspended Electromagnetic Conveyor Belt Separator" },
  { slug: "round-electromagnetic-lifting-magnet", name: "Round Electromagnetic Lifting Magnet" },
  { slug: "permanent-overband-magnetic-separator", name: "Permanent Overband Magnetic Separator" }
];

const industryMenuItems = [
  { slug: "recycling", name: "Recycling Industry", summary: "Recover ferrous material and protect sorting equipment." },
  { slug: "mining", name: "Mining Industry", summary: "Protect crushers and support magnetic mineral recovery." },
  { slug: "cement-aggregate", name: "Cement & Aggregates", summary: "Remove tramp iron from conveyors and process lines." },
  { slug: "food", name: "Food & Grain Processing", summary: "Control ferrous contamination in dry and flowing materials." }
];

export function Header() {
  const pathname = usePathname();
  const locale = getLocaleFromPath(pathname);
  const t = getDictionary(locale);
  const ui = getPublicUi(locale);
  const dir = getDirection(locale);
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const pagePath = stripLocale(pathname);
  const isCurrent = (path: string) => pagePath === path || pagePath.startsWith(`${path}/`);
  const pageLinks = [
    ["/about", ui.aboutUs],
    ["/blog", t.nav.blog],
    ["/news", t.nav.news],
    ["/contact", ui.contact]
  ] as const;
  const megaCloseTimer = useRef<number | null>(null);
  const [activeMega, setActiveMega] = useState<"products" | "industries" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const clearMegaCloseTimer = () => {
    if (megaCloseTimer.current) {
      window.clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
  };

  const openMega = (menu: "products" | "industries") => {
    clearMegaCloseTimer();
    setActiveMega(menu);
  };

  const scheduleMegaClose = () => {
    clearMegaCloseTimer();
    megaCloseTimer.current = window.setTimeout(() => setActiveMega(null), 140);
  };

  useEffect(() => {
    const closeMega = () => {
      clearMegaCloseTimer();
      setActiveMega(null);
    };
    window.addEventListener("scroll", closeMega, { passive: true });
    window.addEventListener("resize", closeMega);
    return () => {
      window.removeEventListener("scroll", closeMega);
      window.removeEventListener("resize", closeMega);
      clearMegaCloseTimer();
    };
  }, []);

  useEffect(() => {
    clearMegaCloseTimer();
    const resetNavigation = window.setTimeout(() => {
      setActiveMega(null);
      setMobileOpen(false);
    }, 0);
    return () => window.clearTimeout(resetNavigation);
  }, [pathname]);

  useEffect(() => {
    function closeMobileMenu(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileOpen(false);
        setActiveMega(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (mobileOpen) mobileToggle.current?.focus();
      if (activeMega) headerRef.current?.querySelector<HTMLElement>(".mega-open .nav-trigger")?.focus();
      clearMegaCloseTimer();
      setMobileOpen(false);
      setActiveMega(null);
    }

    document.addEventListener("pointerdown", closeMobileMenu);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMobileMenu);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeMega, mobileOpen]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="site-header" dir={dir} key={pathname} ref={headerRef}>
      <nav className="navbar" aria-label={ui.navigation}>
        <Link href={localizeHref("/", locale)} className="brand" aria-label={`COWIN MAGNET — ${ui.home}`}>
          <Image src="/images/cowin-logo.png" width={52} height={52} alt="COWIN MAGNET logo" />
          <span>COWIN MAGNET</span>
        </Link>
        <button
          type="button"
          className="mobile-nav-toggle"
          ref={mobileToggle}
          aria-label={mobileOpen ? ui.closeMenu : ui.openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-site-navigation"
          title={mobileOpen ? ui.closeMenu : ui.openMenu}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
        </button>
        <div className="nav-links">
          <div
            className={`nav-item has-mega${activeMega === "products" ? " mega-open" : ""}`}
            onMouseEnter={() => openMega("products")}
            onMouseLeave={scheduleMegaClose}
            onFocusCapture={() => openMega("products")}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMega(null); }}
          >
            <Link
              href={localizeHref("/products", locale)}
              className="nav-trigger"
              aria-expanded={activeMega === "products"}
              aria-controls="site-product-menu"
              aria-current={isCurrent("/products") ? "location" : undefined}
              onClick={() => setActiveMega(null)}
            >
              {t.nav.products}
            </Link>
            <div className="mega-menu mega-products" id="site-product-menu" inert={activeMega !== "products"}>
              <div className="mega-panel">
                <div className="mega-intro">
                  <span><Sparkles size={15} aria-hidden /> {ui.productCenter}</span>
                  <h3>{t.products.h1}</h3>
                  <p>{t.products.description}</p>
                  <Link href={localizeHref("/products", locale)} className="mega-cta" onClick={() => setActiveMega(null)}>
                    {t.common.viewProducts} <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
                <div className="mega-section">
                  <h4>{ui.categories}</h4>
                  <div className="mega-chip-list">
                    {homeProductFamilies.map((family, index) => family === "other" ? null : (
                      <Link key={family} href={`${localizeHref("/products", locale)}?family=${family}`} onClick={() => setActiveMega(null)}>{ui.homeCategories[index + 1]}</Link>
                    ))}
                  </div>
                </div>
                <div className="mega-section mega-link-grid">
                  <h4>{ui.popularProducts}</h4>
                  {featuredProducts.map((product, index) => (
                    <Link key={product.slug} href={localizeHref(`/products/${product.slug}`, locale)} onClick={() => setActiveMega(null)}>
                      {ui.featuredProducts[index]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div
            className={`nav-item has-mega${activeMega === "industries" ? " mega-open" : ""}`}
            onMouseEnter={() => openMega("industries")}
            onMouseLeave={scheduleMegaClose}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActiveMega(null); }}
          >
            <button
              type="button"
              className="nav-trigger nav-trigger-button"
              aria-expanded={activeMega === "industries"}
              aria-controls="site-industry-menu"
              aria-current={isCurrent("/industries") ? "location" : undefined}
              onClick={() => activeMega === "industries" ? setActiveMega(null) : openMega("industries")}
            >
              {ui.industries}
            </button>
            <div className="mega-menu mega-applications" id="site-industry-menu" inert={activeMega !== "industries"}>
              <div className="mega-panel mega-panel-compact">
                <div className="mega-intro">
                  <span><Factory size={15} aria-hidden /> {ui.industrySolutions}</span>
                  <h3>{ui.industryHeadline}</h3>
                  <p>{ui.industryDescription}</p>
                  <Link href={localizeHref("/industries", locale)} className="mega-cta" onClick={() => setActiveMega(null)}>
                    {t.common.viewSolution} <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
                <div className="mega-section mega-card-grid">
                  {industryMenuItems.map((industry, index) => (
                    <Link key={industry.slug} href={localizeHref(`/industries/${industry.slug}`, locale)} onClick={() => setActiveMega(null)}>
                      <strong>{ui.industryMenu[index][0]}</strong>
                      <span>{ui.industryMenu[index][1]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {pageLinks.map(([path, label]) => (
            <Link key={path} href={localizeHref(path, locale)} aria-current={isCurrent(path) ? "location" : undefined}>{label}</Link>
          ))}
          <Link href={localizeHref("/search", locale)} className="nav-search-link" aria-label={`${ui.search} COWIN MAGNET`}>
            <Search size={16} aria-hidden />
            <span className="nav-search-label">{ui.search}</span>
          </Link>
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <Link href={localizeHref("/request-quote", locale)} className="btn btn-primary">
            {t.common.getQuote}
          </Link>
        </div>
        {mobileOpen ? (
          <div className="mobile-site-nav" id="mobile-site-navigation">
            {([["/products", t.nav.products], ["/industries", ui.industries], ...pageLinks] as const).map(([path, label]) => (
              <Link key={path} href={localizeHref(path, locale)} aria-current={isCurrent(path) ? "location" : undefined} onClick={closeMobile}>{label}</Link>
            ))}
            <Link href={localizeHref("/search", locale)} onClick={closeMobile}><Search size={16} aria-hidden /> {ui.search}</Link>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer nofollow" onClick={closeMobile} data-whatsapp-placement="mobile-menu" data-whatsapp-component="site-header">
              <MessageCircle size={16} aria-hidden /> WhatsApp
            </a>
            <div className="mobile-site-actions">
              <LanguageSwitcher onSelect={closeMobile} />
              <Link href={localizeHref("/request-quote", locale)} className="btn btn-primary" onClick={closeMobile}>
                {t.common.getQuote}
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
