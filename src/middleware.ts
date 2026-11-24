import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import redirects from "../data/legacy-redirects.json";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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