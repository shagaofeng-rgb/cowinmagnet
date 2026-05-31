"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { withLocale } from "@/data/i18n";

const menuEventName = "cowin:header-menu-open";

export default function MobileNav({ items, locale = "en" }) {
  const detailsRef = useRef(null);

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function handleToggle() {
    if (detailsRef.current?.open) {
      window.dispatchEvent(new CustomEvent(menuEventName, { detail: "mobile-nav" }));
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
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener(menuEventName, handleExclusiveMenu);
    };
  }, []);

  return (
    <details className="mobile-nav" ref={detailsRef} onToggle={handleToggle} onMouseLeave={handleMouseLeave}>
      <summary>Menu</summary>
      <div className="mobile-nav-panel">
        {items.map((item) => (
          <Link href={withLocale(locale, item.href)} key={item.href} onClick={closeMenu}>
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
