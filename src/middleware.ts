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

// List of production domains and their site mappings
const productionDomains = {
  'event.nexpo.vn': 'nexpo'
}

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

  // For production domains
  const siteSlug = productionDomains[hostname as keyof typeof productionDomains]
  if (siteSlug) {
    console.log('[middleware] Production domain detected:', hostname)
    return handleDomainBasedRouting(request, pathname, siteSlug)
  }

  // For any other domains, try to find site mapping
  try {
    console.log('[middleware] Attempting to find site for domain:', hostname)
    const site = hostname ? await getSiteByDomain(hostname as string) : null
    
    if (site && site.slug) {
      return handleDomainBasedRouting(request, pathname, site.slug)
    }
  } catch (error) {
    console.error('[middleware] Error finding site:', error)
  }

  // Fallback to slug-based routing
  return handleSlugBasedRouting(request, pathname)
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

    // For internal Next.js routing, we need the site slug
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = `/${siteSlug}/${lang}${remainingPath ? `/${remainingPath}` : ''}`
    console.log('[middleware] Rewriting to:', newUrl.pathname)
    return NextResponse.rewrite(newUrl)
  }

  // If no language prefix, redirect to default language
  const newUrl = new URL(`/${defaultLanguage}${pathname === '/' ? '' : pathname}`, request.url)
  console.log('[middleware] Redirecting to:', newUrl.pathname)
  return NextResponse.redirect(newUrl)
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
