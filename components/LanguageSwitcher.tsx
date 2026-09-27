"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Globe2 } from "lucide-react";
import { getLocaleFromPath, languageLabels, localePath, locales, stripLocale } from "@/lib/i18n";
import { persistLocalePreference } from "@/lib/clientLocalePreference";
import { getPublicUi } from "@/lib/publicUi";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getLocaleFromPath(pathname);
  const ui = getPublicUi(currentLocale);
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
    persistLocalePreference(locale);
    setOpen(false);
  }

  return (
    <div
      className={`language-switcher${open ? " is-open" : ""}`}
      ref={switcherRef}
    >
      <button
        className="language-trigger"
        type="button"
        aria-label={ui.chooseLanguage}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe2 size={16} aria-hidden />
        <span>{currentLocale.toUpperCase()}</span>
      </button>
      <div className="language-menu" id={menuId} role="menu" aria-label={ui.chooseLanguage}>
        {locales.map((locale) => (
          <Link
            key={locale}
            href={localePath(locale, cleanPath)}
            className={locale === currentLocale ? "active" : undefined}
            hrefLang={locale}
            onClick={(event) => {
              rememberLocale(locale);
              const suffix = `${window.location.search}${window.location.hash}`;
              if (suffix) {
                event.preventDefault();
                router.push(`${localePath(locale, cleanPath)}${suffix}`);
              }
            }}
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
