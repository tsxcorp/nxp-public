import 'server-only'

import { fetchForm, fetchGlobals, fetchNavigationSafe } from './directus-api'
import { PageContextServer } from '@/types/next'

export { data as fetchGlobalData }
export type Data = Awaited<ReturnType<typeof data>>

const defaultGlobalData = {
  title: '',
  tagline: '',
  translations: [],
  google_analytics_id: '',
  umami_analytics_id: '',
  umami_script_url: '',
  social_links: []
}

const data = async ({ locale, params }: PageContextServer) => {
  // If no params or slug, return default structure
  if (!params?.slug) {
    return {
      globalData: defaultGlobalData,
      mainNavData: null,
      footerNavData: null,
      newsLetter: null
    }
  }

  // Skip if slug is default
  if (params.slug === 'default') {
    return {
      globalData: defaultGlobalData,
      mainNavData: null,
      footerNavData: null,
      newsLetter: null
    }
  }

  const [mainNavData, footerNavData, globalData] = await Promise.all([
    fetchNavigationSafe(params.slug, locale, 'main'),
    fetchNavigationSafe(params.slug, locale, 'footer'),
    fetchGlobals(params.slug, locale),
  ])

  // If site not found, return default structure
  if (!globalData) {
    return {
      globalData: defaultGlobalData,
      mainNavData: null,
      footerNavData: null,
      newsLetter: null
    }
  }

  if (!globalData.translations || !globalData.translations.length) {
    return {
      globalData: defaultGlobalData,
      mainNavData: mainNavData,
      footerNavData: footerNavData,
      newsLetter: null,
    }
  }

  const {
    translations: { 0: globalDetails },
    ...remainingGlobals
  } = globalData

  return {
    globalData: {
      ...remainingGlobals,
      ...globalDetails,
    },
    mainNavData: mainNavData,
    footerNavData: footerNavData,
    newsLetter: null,
  }
}
