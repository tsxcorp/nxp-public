import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteByDomain } from './directus/queries/sites'

// List of all supported languages
const supportedLanguages = ['en', 'vi']

// Default language
const defaultLanguage = 'en'

// Default site (nếu muốn redirect root)
const defaultSite = 'nexpo'

// List of development domains that should use slug-based routing
const devDomains = ['localhost', '127.0.0.1']

// List of test domains that should use domain-based routing
const testDomains = ['test-event.nexpo.vn']

// List of production domains
const productionDomains = ['event.nexpo.vn']

export async function middleware(request: NextRequest) {
  // Get pathname and hostname from request
  const { pathname, hostname } = request.nextUrl
  console.log('[middleware] Processing path:', pathname)
  console.log('[middleware] Hostname:', hostname)

  // Skip if it's an internal path
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  // For development domains, use slug-based routing
  if (devDomains.some(domain => hostname?.includes(domain))) {
    console.log('[middleware] Development domain detected, using slug-based routing')
    return handleSlugBasedRouting(request, pathname)
  }

  // For test domains, use domain-based routing
  if (testDomains.some(domain => hostname?.includes(domain))) {
    console.log('[middleware] Test domain detected, using domain-based routing')
    const mockSiteSlug = hostname?.includes('event.nexpo.vn') ? 'nexpo' : 'test-site'
    return handleDomainBasedRouting(request, pathname, mockSiteSlug)
  }

  // For production domains
  if (productionDomains.some(domain => hostname?.includes(domain))) {
    console.log('[middleware] Production domain detected:', hostname)
    // For event.nexpo.vn, we know it maps to 'nexpo'
    if (hostname?.includes('event.nexpo.vn')) {
      console.log('[middleware] Handling event.nexpo.vn with site slug: nexpo')
      return handleDomainBasedRouting(request, pathname, 'nexpo')
    }
  }

  // Try to find site by domain for any other domains
  try {
    console.log('[middleware] Attempting to find site for domain:', hostname)
    const site = hostname ? await getSiteByDomain(hostname as string) : null
    
    if (site && site.slug) {
      // Domain-based routing
      console.log('[middleware] Found site for domain:', site.slug)
      return handleDomainBasedRouting(request, pathname, site.slug)
    } else {
      // Fallback to slug-based routing
      console.log('[middleware] No site found for domain, falling back to slug-based routing')
      return handleSlugBasedRouting(request, pathname)
    }
  } catch (error) {
    console.error('[middleware] Error finding site:', error)
    // Fallback to slug-based routing on error
    return handleSlugBasedRouting(request, pathname)
  }
}

function handleSlugBasedRouting(request: NextRequest, pathname: string) {
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

function handleDomainBasedRouting(request: NextRequest, pathname: string, siteSlug: string) {
  // Check if the pathname already has a language prefix
  const pathnameHasLanguage = supportedLanguages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  if (pathnameHasLanguage) {
    // Extract language and remaining path
    const [, lang, ...rest] = pathname.split('/')
    const remainingPath = rest.join('/')
    
    // Rewrite URL to include site slug for internal routing
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = `/${siteSlug}/${lang}${remainingPath ? `/${remainingPath}` : ''}`
    console.log('[middleware] Rewriting URL to:', newUrl.pathname)
    return NextResponse.rewrite(newUrl)
  }

  // If no language prefix, redirect to default language
  return NextResponse.redirect(new URL(`/${defaultLanguage}${pathname === '/' ? '' : pathname}`, request.url))
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
