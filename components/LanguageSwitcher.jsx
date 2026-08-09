"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { localeLabels, locales } from "@/data/i18n";

const menuEventName = "cowin:header-menu-open";

function stripLocale(pathname) {
  const parts = pathname.split("/");
  if (locales.includes(parts[1])) {
    const rest = `/${parts.slice(2).join("/")}`;
    return rest === "/" ? "" : rest.replace(/\/$/, "");
  }
  return pathname === "/" ? "" : pathname;
}

export default function LanguageSwitcher({ locale = "en" }) {
  const pathname = usePathname() || "/";
  const suffix = stripLocale(pathname);
  const detailsRef = useRef(null);

  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false;
  }

  function handleToggle() {
    if (detailsRef.current?.open) {
      window.dispatchEvent(new CustomEvent(menuEventName, { detail: "language-switcher" }));
    }
  }

  function handleMouseLeave() {
    if (window.matchMedia?.("(hover: hover)").matches) closeMenu();
  }

  function rememberLocale(nextLocale) {
    window.document.cookie = `cowin_locale=${nextLocale}; path=/; max-age=2592000; samesite=lax`;
    closeMenu();
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
      if (event.detail !== "language-switcher") closeMenu();
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
    <details className="language-switcher" ref={detailsRef} onToggle={handleToggle} onMouseLeave={handleMouseLeave}>
      <summary className="language-current">{locale.toUpperCase()}</summary>
      <div className="language-menu" aria-label="Language switcher">
        {locales.map((item) => (
          <a
            key={item}
            href={`/${item}${suffix}`}
            onClick={() => rememberLocale(item)}
            aria-current={item === locale ? "true" : undefined}
          >
            <span>{item.toUpperCase()}</span>
            <small>{localeLabels[item]}</small>
          </a>
        ))}
      </div>
    </details>
  );
}
