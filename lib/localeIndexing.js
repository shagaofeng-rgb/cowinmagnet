/** Keep sitemap entries, response headers and page metadata on one policy. */
export const publicLocales = /** @type {const} */ (["en", "es", "ru", "ar", "fr", "pt"]);

// These pages have localized headings, body text and actions in every language.
const reviewedPaths = new Set(["/", "/about", "/contact"]);

export function localesForIndexablePath(path) {
  return reviewedPaths.has(path) ? publicLocales : ["en"];
}
