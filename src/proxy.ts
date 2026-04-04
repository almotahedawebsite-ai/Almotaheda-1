import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 2. Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // We optionally check for a preferred locale (from cookie or headers)
    const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
    
    // Rewrite or redirect to /[locale]/pathname
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  // 3. If locale exists, just continue
  return NextResponse.next();
}

export const config = {
  // Matcher for all routes except internal Next.js, API, and static files
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
