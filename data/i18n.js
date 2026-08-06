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
  return {
    canonical: absoluteLocalizedUrl(defaultLocale, path),
    languages: {
      en: absoluteLocalizedUrl(defaultLocale, path),
      "x-default": absoluteLocalizedUrl(defaultLocale, path)
    }
  };
}

export function createSeoMetadata(locale, path, seo) {
  const ogImage = absoluteUrl("/assets/magnetic-separator-banner-1200.webp");

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
      locale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Cowinmagnet magnetic separation equipment and export support"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage]
    }
  };
}
