export const locales = ["en", "es", "ru", "ar", "fr", "pt"];
export const defaultLocale = "en";
export const rtlLocales = ["ar"];
export const siteUrl = "https://www.cowinmagnet.com";

export const localeLabels = {
  en: "English",
  es: "Español",
  ru: "Русский",
  ar: "العربية",
  fr: "Français",
  pt: "Português"
};

export function isLocale(locale) {
  return locales.includes(locale);
}

export function isRtl(locale) {
  return rtlLocales.includes(locale);
}

export function withLocale(locale, path = "/") {
  const cleanPath = path === "/" ? "" : path;
  return `/${locale}${cleanPath}`;
}

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${cleanPath}`;
}

export function absoluteLocalizedUrl(locale, path = "/") {
  return absoluteUrl(withLocale(locale, path));
}

export function localizedAlternates(path = "/") {
  const languages = Object.fromEntries(locales.map((locale) => [locale, absoluteLocalizedUrl(locale, path)]));
  return {
    canonical: absoluteLocalizedUrl(defaultLocale, path),
    languages: {
      ...languages,
      "x-default": absoluteLocalizedUrl(defaultLocale, path)
    }
  };
}

export function createSeoMetadata(locale, path, seo) {
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      ...localizedAlternates(path),
      canonical: absoluteLocalizedUrl(locale, path)
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: absoluteLocalizedUrl(locale, path),
      siteName: "Cowinmagnet",
      locale
    }
  };
}
