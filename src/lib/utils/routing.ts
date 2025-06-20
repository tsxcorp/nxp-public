// Helper function to determine routing context
export function getRoutingContext(hostnameOverride?: string) {
  const hostname = hostnameOverride || (typeof window !== 'undefined' ? window.location.hostname : '')
  const isDevelopment = ['localhost', '127.0.0.1'].some(domain => hostname.includes(domain))
  
  if (isDevelopment) {
    // For development, treat as domain-based routing with nexpo as default site
    return { isDomainBased: true, siteSlug: 'nexpo' }
  }
  
  // Check if this is a production domain with mapping
  const productionDomains: Record<string, string> = {
    'event.nexpo.vn': 'nexpo'
  }
  
  const siteSlug = productionDomains[hostname]
  if (siteSlug) {
    return { isDomainBased: true, siteSlug }
  }
  
  // For other domains, assume domain-based routing
  return { isDomainBased: true, siteSlug: null }
}

// Helper function to get current language from pathname
export function getCurrentLanguage(pathname: string): string {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // For domain-based routing, language is the first segment
  // For slug-based routing, language is the second segment after site slug
  if (pathSegments.length > 0) {
    // Check if first segment is a language
    if (['en', 'vi'].includes(pathSegments[0])) {
      return pathSegments[0]
    } else if (pathSegments.length > 1 && ['en', 'vi'].includes(pathSegments[1])) {
      // For slug-based routing, language is second segment
      return pathSegments[1]
    }
  }
  
  return 'en' // default fallback
}

// Helper function to get site slug from pathname
export function getSiteSlugFromPathname(pathname: string): string | null {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  // For slug-based routing, site slug is the first segment
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    // Check if first segment is not a language (to avoid confusion)
    if (!['en', 'vi'].includes(firstSegment)) {
      return firstSegment
    }
  }
  
  return null
}

// Helper function to build URL based on routing context
export function buildUrl(lang: string, permalink: string, hostnameOverride?: string, currentPathname?: string): string {
  const { isDomainBased, siteSlug } = getRoutingContext(hostnameOverride)
  
  console.log('[buildUrl] Debug:', { lang, permalink, hostnameOverride, isDomainBased, siteSlug, currentPathname })
  
  if (isDomainBased) {
    // Domain-based routing: /{lang}/{permalink}
    // Domain is just an alias for the site slug
    const cleanPermalink = permalink.startsWith('/') ? permalink.slice(1) : permalink
    const url = `/${lang}${cleanPermalink ? `/${cleanPermalink}` : ''}`
    console.log('[buildUrl] Domain-based URL:', url)
    return url
  } else {
    // Slug-based routing: /{site}/{lang}/{permalink}
    // Get site slug from current pathname or use provided siteSlug
    const currentSiteSlug = siteSlug || (currentPathname ? getSiteSlugFromPathname(currentPathname) : null) || 'nexpo'
    const cleanPermalink = permalink.startsWith('/') ? permalink.slice(1) : permalink
    const url = `/${currentSiteSlug}/${lang}${cleanPermalink ? `/${cleanPermalink}` : ''}`
    console.log('[buildUrl] Slug-based URL:', url)
    return url
  }
}

// Helper function to get default redirect URL based on routing context
export function getDefaultRedirectUrl(hostnameOverride?: string): string {
  const { isDomainBased, siteSlug } = getRoutingContext(hostnameOverride)
  
  if (isDomainBased) {
    // Domain-based routing: redirect to default language
    return '/en'
  } else {
    // Slug-based routing: redirect to site slug (without language)
    return `/${siteSlug}`
  }
} 