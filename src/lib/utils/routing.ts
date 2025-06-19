// Helper function to determine routing context
export function getRoutingContext(hostnameOverride?: string) {
  const hostname = hostnameOverride || (typeof window !== 'undefined' ? window.location.hostname : '')
  const isDevelopment = ['localhost', '127.0.0.1'].some(domain => hostname.includes(domain))
  
  if (isDevelopment) {
    return { isDomainBased: false, siteSlug: 'nexpo' }
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
  return { isDomainBased: true, siteSlug: 'nexpo' }
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

// Helper function to build URL based on routing context
export function buildUrl(lang: string, permalink: string, hostnameOverride?: string): string {
  const { isDomainBased, siteSlug } = getRoutingContext(hostnameOverride)
  
  if (isDomainBased) {
    // Domain-based routing: /{lang}/{permalink}
    return `/${lang}/${permalink}`
  } else {
    // Slug-based routing: /{site}/{lang}/{permalink}
    return `/${siteSlug}/${lang}/${permalink}`
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