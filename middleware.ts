import { NextRequest, NextResponse } from "next/server";

let locales = ["en", "zh"];
let defaultLocale = "zh";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const headers = new Headers(request.headers);
    headers.set("x-current-lang", pathname.split('/')[1]);
    return NextResponse.next({ request: { headers } });
  }

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|svgs|images|constants|favicon).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};