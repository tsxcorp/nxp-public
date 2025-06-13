// Global type definitions
export {}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

// Extend process.env with our custom environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL: string
    NEXT_PUBLIC_DIRECTUS_URL: string
    NEXT_PUBLIC_DIRECTUS_WS_URL: string
    DIRECTUS_ADMIN_TOKEN: string
    NEXT_PUBLIC_DIRECTUS_WEBAPI_TOKEN: string
    API_CACHE_DISABLED: string
    NEXT_PUBLIC_LOCALE_DEFAULT: string
    NEXT_PUBLIC_DAISYUI_THEMES: string
    NEXT_PUBLIC_ENABLE_FALLBACK_DATA: string
  }
}