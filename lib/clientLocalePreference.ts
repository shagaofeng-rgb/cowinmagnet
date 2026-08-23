export function persistLocalePreference(locale: string) {
  document.cookie = `cowin_locale=${locale}; path=/; max-age=2592000; samesite=lax`;
}
