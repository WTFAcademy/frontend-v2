import { NextRequest, NextResponse } from "next/server";

const locales = ["en", "zh"];
const defaultLocale = "en";

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  // 首先检查cookie中是否存在locale
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // 如果cookie中的locale是有效的，则使用它
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // 如果cookie中没有有效的locale，返回默认值
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    const headers = new Headers(request.headers);
    const locale = pathname.split('/')[1];
    headers.set("x-current-lang", locale);
    
    const response = NextResponse.next({ request: { headers } });
    response.cookies.set('NEXT_LOCALE', locale, { 
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'strict'
    });
    
    return response;
  }

  // 获取locale（现在会优先使用cookie中的值）
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'strict'
  });
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|svgs|images|constants|favicon).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};