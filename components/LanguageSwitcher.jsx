"use client";

import { usePathname } from "next/navigation";
import { localeLabels, locales } from "@/data/i18n";

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

  function rememberLocale(nextLocale) {
    document.cookie = `cowin_locale=${nextLocale}; path=/; max-age=2592000; samesite=lax`;
  }

  return (
    <div className="language-switcher">
      <span className="language-current">{locale.toUpperCase()}</span>
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
    </div>
  );
}
