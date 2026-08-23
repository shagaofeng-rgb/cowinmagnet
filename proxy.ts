import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

const PUBLIC_FILE = /\.(.*)$/;
// Geo blocking is intentionally limited to public document routes. Admin, API,
// cron, sitemap and static asset requests are handled by the allow-list below.
// Keep China mainland public traffic blocked without interrupting operators,
// deployment jobs, search crawlers, or required static resources.
const blockedVisitorCountries = new Set<string>(["CN"]);
const PRIMARY_HOST = "www.cowinmagnet.com";

function getRequestCountry(request: NextRequest) {
  return (
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("cloudfront-viewer-country") ||
    (request as NextRequest & { geo?: { country?: string } }).geo?.country ||
    ""
  ).toUpperCase();
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const country = getRequestCountry(request);

  // Some publishing platforms accept only a site domain and POST their webhook payload to `/`.
  // Keep the public homepage behavior unchanged while internally routing that integration request.
  if (request.method === "POST" && pathname === "/") {
    return NextResponse.rewrite(new URL("/api/webhook/send_article", request.url));
  }

  const requestHost = request.headers.get("host")?.split(":")[0]?.toLowerCase();
  if (requestHost === "cowinmagnet.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = PRIMARY_HOST;
    return NextResponse.redirect(url, 308);
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (blockedVisitorCountries.has(country)) {
    return new NextResponse("Access unavailable", {
      status: 403,
      headers: {
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
        "Vary": "x-vercel-ip-country",
        "X-Cowin-Geo-Block": country
      }
    });
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) {
    // Only English has been editorially verified site-wide. Other locales stay
    // accessible for users, but are not offered to crawlers as full locales
    // until their main content is actually translated and reviewed.
    return firstSegment === defaultLocale
      ? NextResponse.next()
      : NextResponse.next({ headers: { "X-Robots-Tag": "noindex, follow" } });
  }

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next|api|admin|assets|images|favicon.ico).*)"]
};
