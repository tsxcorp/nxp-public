import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of all supported languages
const supportedLanguages = ['en', 'vi']

// Default language
const defaultLanguage = 'en'

export function middleware(request: NextRequest) {
  // Get pathname from request
  const pathname = request.nextUrl.pathname
  console.log('[middleware] Processing path:', pathname)

  // Skip if it's an internal path
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
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

  // For root path, redirect to default language
  if (pathname === '/') {
    console.log('[middleware] Root path, redirecting to default language')
    return NextResponse.redirect(new URL(`/${defaultLanguage}`, request.url))
  }

  // For paths without language prefix, add the default language
  console.log('[middleware] Adding default language prefix')
  return NextResponse.redirect(new URL(`/${defaultLanguage}${pathname}`, request.url))
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
