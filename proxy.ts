import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale, stripLocale } from "@/lib/i18n";
import { localesForIndexablePath } from "@/lib/localeIndexing";

const PUBLIC_FILE = /\.(.*)$/;
const PRIMARY_HOST = "www.cowinmagnet.com";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (isLocale(firstSegment)) {
    return localesForIndexablePath(stripLocale(pathname)).includes(firstSegment)
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
