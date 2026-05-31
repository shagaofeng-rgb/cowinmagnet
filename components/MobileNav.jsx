"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { productCategories } from "@/data/productCatalog";
import { withLocale } from "@/data/i18n";

const menuEventName = "cowin:header-menu-open";

const panels = {
  products: {
    title: "Products",
    intro: "Browse product families, then open the exact equipment page.",
    links: []
  },
  company: {
    title: "Company",
    intro: "Learn how Cowinmagnet supports sourcing, inspection and export coordination.",
    links: [
      { href: "/about", label: "About Us", meta: "Company positioning" },
      { href: "/applications", label: "Applications", meta: "Buyer use cases" },
      { href: "/factory", label: "Factory", meta: "Sourcing and QC support" },
      { href: "/cases", label: "Cases / Projects", meta: "Project references" }
    ]
  },
  resources: {
    title: "Resources",
    intro: "Read product knowledge, company updates and industry news.",
    links: [
      { href: "/blog", label: "Blog", meta: "Product and company articles" },
      { href: "/news", label: "News", meta: "Industry news categories" }
    ]
  },
  contact: {
    title: "Contact",
    intro: "Choose a direct contact page or send conveyor details for model selection.",
    links: [
      { href: "/inquiry", label: "Inquiry", meta: "Send product requirements" },
      { href: "/contact", label: "Contact Us", meta: "Phone, email and office location" }
    ]
  }
};

export default function MobileNav({ locale = "en", nav = {} }) {
  const detailsRef = useRef(null);
  const [activePanel, setActivePanel] = useState("main");

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
    setActivePanel("main");
    document.body.classList.remove("mobile-menu-open");
  }

  function handleToggle() {
    if (detailsRef.current?.open) {
      setActivePanel("main");
      document.body.classList.add("mobile-menu-open");
      window.dispatchEvent(new CustomEvent(menuEventName, { detail: "mobile-nav" }));
    } else {
      document.body.classList.remove("mobile-menu-open");
    }
  }

  function handleMouseLeave() {
    if (window.matchMedia?.("(hover: hover)").matches) closeMenu();
  }

  useEffect(() => {
    function handleOutsidePointer(event) {
      if (!detailsRef.current?.open) return;
      if (!detailsRef.current.contains(event.target)) closeMenu();
    }

    function handleEscape(event) {
      if (event.key === "Escape") closeMenu();
    }

    function handleExclusiveMenu(event) {
      if (event.detail !== "mobile-nav") closeMenu();
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener(menuEventName, handleExclusiveMenu);

    return () => {
      document.body.classList.remove("mobile-menu-open");
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener(menuEventName, handleExclusiveMenu);
    };
  }, []);

  const productLinks = [
    { href: "/products", label: nav.allProducts || "All Products", meta: "Product center" },
    ...productCategories.flatMap((category) => [
      { href: `/products#${category.id}`, label: category.title, meta: "Category" },
      ...category.products.map((product) => ({
        href: `/products/${product.slug}`,
        label: product.shortTitle,
        meta: category.title
      }))
    ])
  ];

  const menuCards = [
    { key: "products", label: nav.products || "Products", meta: "Product families and detail pages" },
    { key: "company", label: nav.about || "Company", meta: "About, applications, factory and cases" },
    { key: "resources", label: `${nav.blog || "Blog"} / ${nav.news || "News"}`, meta: "Articles and industry updates" },
    { key: "contact", label: nav.contact || "Contact", meta: "Inquiry form and direct contact" }
  ];

  const panelLinks = activePanel === "products" ? productLinks : panels[activePanel]?.links || [];
  const panel = panels[activePanel];

  return (
    <details className="mobile-nav" ref={detailsRef} onToggle={handleToggle} onMouseLeave={handleMouseLeave}>
      <summary>Menu</summary>
      <div className="mobile-nav-panel">
        {activePanel === "main" ? (
          <div className="mobile-nav-page" data-panel="main">
            <p className="mobile-menu-kicker">Navigation</p>
            {menuCards.map((item) => (
              <button className="mobile-menu-card" type="button" key={item.key} onClick={() => setActivePanel(item.key)}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.meta}</small>
                </span>
                <b aria-hidden="true">&gt;</b>
              </button>
            ))}
            <Link className="mobile-menu-primary-link" href={withLocale(locale, "/inquiry")} onClick={closeMenu}>
              {nav.quote || "Send Conveyor Details"}
            </Link>
          </div>
        ) : (
          <div className="mobile-nav-page" data-panel={activePanel}>
            <button className="mobile-menu-back" type="button" onClick={() => setActivePanel("main")}>
              <span aria-hidden="true">&lt;</span>
              Back to menu
            </button>
            <div className="mobile-menu-section">
              <p className="mobile-menu-kicker">Section</p>
              <h3>{panel.title}</h3>
              <p>{panel.intro}</p>
            </div>
            <div className="mobile-link-list">
              {panelLinks.map((item) => (
                <Link className="mobile-menu-link" href={withLocale(locale, item.href)} key={`${item.href}-${item.label}`} onClick={closeMenu}>
                  <span>
                    <strong>{item.label}</strong>
                    {item.meta && <small>{item.meta}</small>}
                  </span>
                  <b aria-hidden="true">&gt;</b>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
