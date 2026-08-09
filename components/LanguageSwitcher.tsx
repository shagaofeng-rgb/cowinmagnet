"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import { getLocaleFromPath, languageLabels, localePath, locales, stripLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPath(pathname);
  const cleanPath = stripLocale(pathname || "/");
  const menuId = useId();
  const switcherRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;

    function closeOnOutsidePointer(event: PointerEvent) {
      if (!switcherRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  function rememberLocale(locale: string) {
    window.document.cookie = `cowin_locale=${locale}; path=/; max-age=2592000; samesite=lax`;
    setOpen(false);
  }

  return (
    <div
      className={`language-switcher${open ? " is-open" : ""}`}
      ref={switcherRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="language-trigger"
        type="button"
        aria-label="Choose language"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={16} aria-hidden />
        <span>{currentLocale.toUpperCase()}</span>
      </button>
      <div className="language-menu" id={menuId} role="menu" aria-label="Choose language">
        {locales.map((locale) => (
          <Link
            key={locale}
            href={localePath(locale, cleanPath)}
            className={locale === currentLocale ? "active" : undefined}
            hrefLang={locale}
            onClick={() => rememberLocale(locale)}
            role="menuitem"
          >
            <span>{locale.toUpperCase()}</span>
            {languageLabels[locale]}
          </Link>
        ))}
      </div>
    </div>
  );
}
