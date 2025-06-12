import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of all supported languages
const supportedLanguages = ['en', 'vi']

// Default language
const defaultLanguage = 'en'

// Default site (nếu muốn redirect root)
const defaultSite = 'nexpo'

export function middleware(request: NextRequest) {
  // Get pathname from request
  const pathname = request.nextUrl.pathname
  console.log('[middleware] Processing path:', pathname)

  // Skip if it's an internal path
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  // Regex: /[site]/[lang] hoặc /[site]/[lang]/...
  const multitenantPattern = /^\/([a-zA-Z0-9_-]+)\/([a-zA-Z-]{2,5})(\/|$)/

  if (multitenantPattern.test(pathname)) {
    // Đúng multitenant-first, cho đi qua
    console.log('[middleware] Path matches multitenant-first, pass through')
    return NextResponse.next()
  }

  // Check if the pathname already has a language prefix
  const pathnameHasLanguage = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  // If pathname already has language prefix, let it pass through
  if (pathnameHasLanguage) {
    console.log('[middleware] Path already has language prefix')
    return NextResponse.next()
  }

  // Nếu là /[site] (chỉ có 1 segment), redirect thành /[site]/[defaultLanguage]
  const siteOnlyPattern = /^\/([a-zA-Z0-9_-]+)$/.exec(pathname)
  if (siteOnlyPattern) {
    const site = siteOnlyPattern[1]
    return NextResponse.redirect(new URL(`/${site}/${defaultLanguage}`, request.url))
  }

  // Nếu thiếu site/lang, nhưng KHÔNG phải root, thì redirect như cũ
  if (pathname !== '/') {
    console.log('[middleware] Path missing site/lang, redirecting')
    return NextResponse.redirect(new URL(`/${defaultSite}/${defaultLanguage}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url))
  }

  // Nếu là root, cho đi qua (không redirect)
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
