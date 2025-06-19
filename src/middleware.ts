import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSiteByDomain } from './directus/queries/sites'
import { getDefaultRedirectUrl } from './lib/utils/routing'

// List of all supported languages
const supportedLanguages = ['en', 'vi']

// Default language
const defaultLanguage = 'en'

// List of development domains that should use slug-based routing
const devDomains = ['localhost', '127.0.0.1']

// List of production domains and their site mappings
const productionDomains = {
  'event.nexpo.vn': 'nexpo'
}

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl
  console.log('[middleware] Processing:', { pathname, hostname })

  // Skip internal paths or special routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/test-routing') // <-- skip test page
  ) {
    return NextResponse.next()
  }

  // Check if this is a development domain (localhost, etc.)
  if (devDomains.some(domain => hostname?.includes(domain))) {
    console.log('[middleware] Development domain - using slug-based routing')
    return handleSlugBasedRouting(request, pathname, hostname)
  }

  // Check if this is a production domain with mapping
  const siteSlug = productionDomains[hostname as keyof typeof productionDomains]
  if (siteSlug) {
    console.log('[middleware] Production domain with mapping - using domain-based routing')
    return handleDomainBasedRouting(request, pathname, siteSlug)
  }

  // Try to find site mapping from database
  try {
    const site = hostname ? await getSiteByDomain(hostname) : null
    if (site?.slug) {
      console.log('[middleware] Found site mapping from DB - using domain-based routing')
      return handleDomainBasedRouting(request, pathname, site.slug)
    }
  } catch (error) {
    console.error('[middleware] Error finding site:', error)
  }

  // Fallback to slug-based routing
  console.log('[middleware] Fallback to slug-based routing')
  return handleSlugBasedRouting(request, pathname, hostname)
}

function handleSlugBasedRouting(request: NextRequest, pathname: string, hostname: string) {
  // Pattern: /[site]/[lang] or /[site]/[lang]/...
  const slugBasedPattern = /^\/([a-zA-Z0-9_-]+)\/([a-zA-Z-]{2,5})(\/.*)?$/
  
  if (slugBasedPattern.test(pathname)) {
    // Already in correct format, pass through
    console.log('[middleware] Path already in slug-based format')
    return NextResponse.next()
  }

  // If pathname has language prefix but no site slug, redirect to default site
  const hasLanguagePrefix = supportedLanguages.some(lang => 
    pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )
  
  if (hasLanguagePrefix) {
    // This shouldn't happen in slug-based routing, but if it does, redirect to default site
    const [, lang, ...rest] = pathname.split('/')
    const remainingPath = rest.join('/')
    const newUrl = new URL(`/nexpo/${lang}${remainingPath ? `/${remainingPath}` : ''}`, request.url)
    console.log('[middleware] Redirecting to default site:', newUrl.pathname)
    return NextResponse.redirect(newUrl)
  }

  // If root path or any other path, redirect to default site (without language)
  const defaultRedirectPath = getDefaultRedirectUrl(hostname)
  const newUrl = new URL(defaultRedirectPath, request.url)
  console.log('[middleware] Redirecting to default site:', newUrl.pathname)
  return NextResponse.redirect(newUrl)
}

function handleDomainBasedRouting(request: NextRequest, pathname: string, siteSlug: string) {
  // Check if pathname has language prefix
  const hasLanguagePrefix = supportedLanguages.some(lang => 
    pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  )

  if (hasLanguagePrefix) {
    // Extract language and remaining path
    const [, lang, ...rest] = pathname.split('/')
    const remainingPath = rest.join('/')
    
    // For internal routing, we need to add the site slug
    const internalPath = `/${siteSlug}/${lang}${remainingPath ? `/${remainingPath}` : ''}`
    console.log('[middleware] Domain-based routing - internal rewrite to:', internalPath)
    
    const newUrl = request.nextUrl.clone()
    newUrl.pathname = internalPath
    return NextResponse.rewrite(newUrl)
  }

  // If no language prefix, redirect to default language
  const newUrl = new URL(`/${defaultLanguage}${pathname === '/' ? '' : pathname}`, request.url)
  console.log('[middleware] Domain-based routing - redirect to default language:', newUrl.pathname)
  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico).*)',
  ],
}
