import { NextResponse } from "next/server";
import { defaultLocale, locales } from "@/data/i18n";
import { detectBestLocale } from "@/data/localeDetection";

const PUBLIC_FILE = /\.(.*)$/;

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  if (hasLocale) {
    return NextResponse.next();
  }

  const countryCode =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country") ||
    request.geo?.country;
  const acceptLanguage = request.headers.get("accept-language");
  const cookieLocale = request.cookies.get("cowin_locale")?.value;
  const bestLocale = detectBestLocale({ countryCode, acceptLanguage, cookieLocale });

  const url = request.nextUrl.clone();
  url.pathname = `/${bestLocale || defaultLocale}${pathname === "/" ? "" : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set("cowin_locale", bestLocale || defaultLocale, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    path: "/"
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|assets|.*\\..*).*)"]
};
