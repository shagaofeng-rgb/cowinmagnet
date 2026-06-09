import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
const localizedProductDetailPath = /^\/(en|es|ru|ar|fr|pt)\/products\/[^/]+$/;
const countryLocale: Record<string, Locale> = {
  ES: "es",
  MX: "es",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",
  RU: "ru",
  AE: "ar",
  SA: "ar",
  EG: "ar",
  FR: "fr",
  BE: "fr",
  CA: "fr",
  PT: "pt",
  BR: "pt"
};

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get("cowin_locale")?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country") ||
    (request as NextRequest & { geo?: { country?: string } }).geo?.country;
  const mapped = country ? countryLocale[country.toUpperCase()] : undefined;
  if (mapped) return mapped;

  const acceptLanguage = request.headers.get("accept-language") || "";
  const accepted = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0]?.split("-")[0])
    .find((lang) => isLocale(lang));

  return (accepted as Locale | undefined) || defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country") ||
    (request as NextRequest & { geo?: { country?: string } }).geo?.country ||
    "";
  const userAgent = request.headers.get("user-agent") || "";

  if (localizedProductDetailPath.test(pathname) && /Googlebot/i.test(userAgent) && country.toUpperCase() === "CN") {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store"
      }
    });
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set("cowin_locale", locale, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    path: "/"
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|admin|images|favicon.ico).*)"]
};
