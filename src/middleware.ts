import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import redirects from "../data/legacy-redirects.json";

// Device-based access restriction for public pages. User-agent classification
// is a compatibility measure, not authentication or a security boundary.
function isMobileOrTablet(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") ?? "";
  return request.headers.get("sec-ch-ua-mobile") === "?1" ||
    /Android|iPhone|iPad|iPod|Mobile|Tablet|Windows Phone|BlackBerry|Opera Mini|Opera Mobi|Silk|Kindle/i.test(ua);
}

function isSearchCrawler(request: NextRequest): boolean {
  const ua = request.headers.get("user-agent") ?? "";
  return /\bYandex[A-Za-z0-9_-]*\//i.test(ua) ||
    /\b(?:Googlebot(?:-[\w-]+)?|GoogleOther(?:-[\w-]+)?|Google-[\w-]+|AdsBot-Google(?:-[\w-]+)?|Mediapartners-Google|Storebot-Google|FeedFetcher-Google|DuplexWeb-Google|APIs-Google|GoogleProducer|GoogleImageProxy|GoogleWebLight)\b/i.test(ua);
}

function isTechnicalPath(pathname: string): boolean {
  return /^\/(?:admin|api|_next)(?:\/|$)/.test(pathname) ||
    pathname === "/robots.txt" ||
    /^\/sitemap(?:[-_][\w-]+)?\.xml(?:\.gz)?$/.test(pathname) ||
    /^\/(?:google[a-f0-9]+|yandex_[a-f0-9]+)\.html$/i.test(pathname) ||
    pathname === "/site.webmanifest" ||
    pathname === "/manifest.webmanifest";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isTechnicalPath(pathname) && !isMobileOrTablet(request) && !isSearchCrawler(request)) {
    return new NextResponse(
      "<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Мобильная версия</title></head><body><main><h1>Сайт доступен на мобильных устройствах</h1><p>Откройте сайт на смартфоне или планшете.</p></main></body></html>",
      {
        status: 403,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store, max-age=0",
          "Vary": "User-Agent, Sec-CH-UA-Mobile",
        },
      }
    );
  }

  const map = redirects as Record<string, string>;
  const key = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  let legacyKey = map[pathname] || map[key];
  if (!legacyKey && pathname !== "/") {
    legacyKey =
      map[`${pathname}index.html`] ||
      map[`${key}/index.html`] ||
      map[`${key}.html`];
  }
  if (legacyKey) {
    const destUrl =
      legacyKey.startsWith("http") ? new URL(legacyKey) : new URL(legacyKey, request.url);
    if (destUrl.pathname === request.nextUrl.pathname && destUrl.hash === request.nextUrl.hash) {
      return NextResponse.next();
    }
    return NextResponse.redirect(destUrl, 301);
  }
  if (pathname.startsWith("/admin")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|logo.svg|og-image.svg).*)"],
};