import { defaultLocale, locales } from "@/data/i18n";

export const countryLocaleMap = {
  ES: "es",
  MX: "es",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",
  VE: "es",
  EC: "es",
  BO: "es",
  PY: "es",
  UY: "es",
  CR: "es",
  PA: "es",
  DO: "es",
  GT: "es",
  HN: "es",
  NI: "es",
  SV: "es",
  PR: "es",

  RU: "ru",
  BY: "ru",
  KZ: "ru",
  KG: "ru",

  SA: "ar",
  AE: "ar",
  EG: "ar",
  IQ: "ar",
  JO: "ar",
  KW: "ar",
  QA: "ar",
  OM: "ar",
  BH: "ar",
  DZ: "ar",
  TN: "ar",
  LY: "ar",
  LB: "ar",
  YE: "ar",

  FR: "fr",
  BE: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  SN: "fr",
  CI: "fr",
  CM: "fr",

  PT: "pt",
  BR: "pt",
  AO: "pt",
  MZ: "pt"
};

export function normalizeLocale(value) {
  const locale = value?.toLowerCase().split("-")[0];
  return locales.includes(locale) ? locale : null;
}

export function detectLocaleFromCountry(countryCode) {
  const locale = countryLocaleMap[countryCode?.toUpperCase()];
  return locale && locales.includes(locale) ? locale : null;
}

export function detectLocaleFromAcceptLanguage(acceptLanguage = "") {
  return (
    acceptLanguage
      .split(",")
      .map((item) => item.trim().split(";")[0])
      .map(normalizeLocale)
      .find(Boolean) || null
  );
}

export function detectBestLocale({ countryCode, acceptLanguage, cookieLocale } = {}) {
  return (
    normalizeLocale(cookieLocale) ||
    detectLocaleFromCountry(countryCode) ||
    detectLocaleFromAcceptLanguage(acceptLanguage) ||
    defaultLocale
  );
}
