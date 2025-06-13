import { getDirectusURL } from '@/lib/utils/directus-helpers'
import {
  authentication,
  createDirectus,
  readItems,
  readSingleton,
  RequestTransformer,
  rest,
  RestCommand,
} from '@directus/sdk'
import {
  Forms,
  Globals,
  HelpArticles,
  HelpCollections,
  Navigation,
  Pages,
  Posts,
  Sites,
} from '@/data/directus-collections'
import { DirectusSchema } from '@/data/directus-schema'
import { cache } from 'react'
import { CACHE_TIMES, LANGUAGE_MAP } from '@/lib/constants'
import { getDirectusLanguage, getBestTranslation } from '@/lib/utils/language'
import type { SupportedLanguage } from '@/lib/constants'

const withRevalidate = function <Schema extends object, Output>(
  getOptions: RestCommand<Output, Schema>,
  revalidate: number
): RestCommand<Output, Schema> {
  return () => {
    const options = getOptions()
    options.onRequest = (options: RequestInit) => {
      return { ...options, next: { revalidate: revalidate } }
    }
    return options
  }
}

// Check if we're in a development environment where Directus might not be available
const isDirectusAvailable = async (): Promise<boolean> => {
  if (process.env.NEXT_PUBLIC_ENABLE_FALLBACK_DATA === 'true') {
    return false
  }

  try {
    const directusURL = getDirectusURL()
    const response = await fetch(`${directusURL}/server/ping`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    })
    return response.ok
  } catch (error) {
    console.warn('[Directus] Server not available:', error)
    return false
  }
}

// Create Directus client with error handling
const createDirectusClient = () => {
  try {
    const directusURL = getDirectusURL()
    console.log('[Directus] Connecting to:', directusURL)
    
    return createDirectus<DirectusSchema>(directusURL)
      .with(
        rest({
          onRequest: (currentOptions: RequestInit) => {
            const defaultRevalidate = 0
            const shouldOverrideRevalidate =
              process.env.API_CACHE_DISABLED === 'true'
                ? true
                : !currentOptions.next || !currentOptions.next.revalidate

            if (shouldOverrideRevalidate) {
              return {
                ...currentOptions,
                next: { revalidate: defaultRevalidate },
              }
            }
            return currentOptions
          },
        })
      )
      .with(authentication('json', { autoRefresh: false }))
  } catch (error) {
    console.error('[Directus] Failed to create client:', error)
    throw error
  }
}

const directusApi = createDirectusClient()

// Set token if available
const adminToken = process.env.DIRECTUS_ADMIN_TOKEN
if (adminToken && adminToken !== 'your-directus-admin-token') {
  directusApi.setToken(adminToken)
} else {
  console.warn('[Directus] No valid admin token found. Some operations may fail.')
}

// Enhanced error handling wrapper
const safeApiCall = async <T>(
  apiCall: () => Promise<T>, 
  fallback: T | null = null,
  operationName: string = 'API call'
): Promise<T | null> => {
  try {
    const available = await isDirectusAvailable()
    if (!available) {
      console.warn(`[Directus API] Server not available for ${operationName}, returning fallback`)
      return fallback
    }
    
    return await apiCall()
  } catch (error) {
    console.error(`[Directus API] ${operationName} failed:`, error)
    return fallback
  }
}

// Mock data generators
const getMockSite = (slug: string): Sites | null => {
  if (slug === 'default') return null
  
  return {
    id: '1',
    slug: slug,
    navigation: ['1', '2'],
    status: 'published',
    title: `${slug} Site`
  }
}

const getMockGlobals = (lang: SupportedLanguage): Globals => ({
  id: '1',
  site_id: '1',
  theme: {
    primary: '#1E40AF',
    gray: '#374151',
    borderRadius: '1rem',
    fonts: {
      families: {
        display: 'Poppins, sans-serif',
        body: 'Inter, sans-serif',
        code: 'Fira Code, monospace'
      }
    }
  },
  translations: [{
    id: 1,
    languages_code: getDirectusLanguage(lang),
    title: 'Demo Site',
    description: 'A demo site running without Directus backend',
    project_setting: {
      id: '1',
      title: 'Demo Site',
      seo: {
        id: '1',
        title: 'Demo Site',
        meta_description: 'A demo site running without Directus backend'
      }
    },
    blog_setting: {
      id: '1',
      title: 'Blog',
      headline: 'Demo blog',
      seo: {
        id: '1',
        title: 'Blog',
        meta_description: 'Demo blog'
      }
    }
  }]
})

const getMockNavigation = (siteSlug: string, lang: SupportedLanguage, type: 'main' | 'footer' = 'main'): Navigation => ({
  id: type === 'main' ? '2' : '1',
  status: 'published',
  type: type,
  items: type === 'main' ? [
    {
      id: '1',
      type: 'page',
      url: null,
      href: `/${siteSlug}/${lang}/`,
      page: {
        id: '1',
        translations: [{ languages_code: getDirectusLanguage(lang), permalink: '/' }]
      },
      translations: [{ title: 'Home', languages_code: getDirectusLanguage(lang) }]
    },
    {
      id: '2',
      type: 'page',
      url: null,
      href: `/${siteSlug}/${lang}/about`,
      page: {
        id: '2',
        translations: [{ languages_code: getDirectusLanguage(lang), permalink: '/about' }]
      },
      translations: [{ title: 'About', languages_code: getDirectusLanguage(lang) }]
    }
  ] : [
    {
      id: '3',
      type: 'url',
      url: '#',
      href: '#',
      page: null,
      translations: [{ title: 'Privacy', languages_code: getDirectusLanguage(lang) }]
    }
  ]
})

const getMockPage = (permalink: string, lang: SupportedLanguage): Pages => {
  const isHome = permalink === '/'
  const directusLang = getDirectusLanguage(lang)
  
  return {
    id: isHome ? '1' : '2',
    status: 'published',
    site_id: '1',
    title: isHome ? 'Welcome' : 'About Us',
    translations: [{
      id: isHome ? '1' : '2',
      languages_code: directusLang,
      title: isHome ? 'Welcome' : 'About Us',
      permalink: permalink,
    }],
    blocks: [
      {
        id: '1',
        collection: 'block_hero',
        item: {
          id: '1',
          translations: [{
            languages_code: directusLang,
            title: isHome ? 'Demo Site' : 'About Us',
            headline: isHome 
              ? 'This site is running in demo mode without Directus backend'
              : 'Learn more about our demo site',
            content: isHome
              ? 'The application is working properly, but no Directus server is connected.'
              : 'This page demonstrates the fallback system when Directus is not available.'
          }]
        }
      }
    ],
    seo: {
      id: '1',
      title: isHome ? 'Demo Site' : 'About - Demo Site',
      meta_description: 'Demo site running without Directus backend'
    }
  }
}

// API Functions
export const getSite = cache(async (slug: string): Promise<Sites | null> => {
  console.log('[getSite] Fetching site with slug:', slug)
  
  if (slug === 'default') {
    console.log('[getSite] Skipping fetch for default slug')
    return null
  }

  return await safeApiCall(async () => {
    const sites = await directusApi.request(
      withRevalidate(
        readItems('sites', {
          filter: { slug: { _eq: slug } },
          fields: ['*'],
          limit: 1
        }),
        CACHE_TIMES.NAVIGATION
      )
    );
    return sites[0] || null
  }, getMockSite(slug), `getSite(${slug})`)
})

export const fetchGlobals = async function (slug: string, lang: SupportedLanguage): Promise<Globals | null> {
  const site = await getSite(slug)
  if (!site) return getMockGlobals(lang)

  const directusLang = getDirectusLanguage(lang)

  return await safeApiCall(async () => {
    const globals = await directusApi.request(
      withRevalidate(
        readItems('globals', {
          filter: { site_id: { _eq: site.id } },
          deep: {
            translations: {
              _filter: { languages_code: { _eq: directusLang } },
            },
          },
          fields: [
            '*',
            'theme',
            {
              translations: [
                '*',
                { project_setting: ['*'] },
                { blog_setting: ['*'] },
              ],
            },
          ],
          limit: 1
        }),
        CACHE_TIMES.GLOBALS
      )
    )
    return globals[0] as Globals || null
  }, getMockGlobals(lang), `fetchGlobals(${slug}, ${lang})`)
}

export const fetchNavigationSafe = async function (
  siteSlug: string, 
  lang: SupportedLanguage, 
  type: 'main' | 'footer' = 'main'
): Promise<Navigation | null> {
  const site = await getSite(siteSlug);
  if (!site) {
    return getMockNavigation(siteSlug, lang, type);
  }

  const navigationId = type === 'main' ? site.navigation?.[1] : site.navigation?.[0];
  if (!navigationId) {
    return getMockNavigation(siteSlug, lang, type);
  }

  const directusLang = getDirectusLanguage(lang)

  return await safeApiCall(async () => {
    const navigations = await directusApi.request(
      withRevalidate(
        readItems('navigation', {
          limit: 1,
          filter: {
            id: { _eq: navigationId },
            status: { _eq: 'published' },
          },
          fields: [
            'id',
            'status',
            'type',
            {
              items: [
                'id',
                'type',
                'url',
                {
                  page: [
                    'id',
                    { translations: ['languages_code', 'permalink'] }
                  ]
                },
                { translations: ['languages_code', 'title'] }
              ]
            }
          ],
        }),
        CACHE_TIMES.NAVIGATION
      )
    );

    if (!navigations[0]) return null;

    const processedItems = (navigations[0].items || []).map((item) => {
      const translation = getBestTranslation(item.translations, directusLang)

      let href = '#';
      if (item.type === 'url' && item.url) {
        href = item.url;
      } else if (item.type === 'page' && item.page?.translations) {
        const pageTrans = getBestTranslation(item.page.translations, directusLang)
        if (pageTrans?.permalink) {
          href = `/${siteSlug}/${lang}${pageTrans.permalink.startsWith('/') ? '' : '/'}${pageTrans.permalink}`;
        }
      }

      return {
        ...item,
        href,
        translations: translation ? [{ title: translation.title, languages_code: translation.languages_code }] : [],
      };
    });

    return {
      id: navigations[0].id,
      status: navigations[0].status as 'published' | 'draft' | 'archived',
      type: navigations[0].type as 'main' | 'footer',
      items: processedItems,
    };
  }, getMockNavigation(siteSlug, lang, type), `fetchNavigation(${siteSlug}, ${lang}, ${type})`);
};

export const fetchPage = async function (
  siteSlug: string, 
  lang: SupportedLanguage, 
  permalink: string = '/'
): Promise<Pages | null> {
  const site = await getSite(siteSlug);
  if (!site) return getMockPage(permalink, lang);

  const directusLang = getDirectusLanguage(lang)

  return await safeApiCall(async () => {
    const pages = await directusApi.request(
      withRevalidate(
        readItems('pages', {
          filter: {
            site_id: { _eq: site.id },
            translations: { permalink: { _eq: permalink } },
          },
          fields: [
            '*',
            { translations: ['*'] },
            { blocks: ['*', { item: ['*', { translations: ['*'] }] }] },
            { seo: ['*'] },
          ],
          deep: {
            translations: { _filter: { languages_code: { _eq: directusLang } } },
            blocks: {
              item: {
                translations: { _filter: { languages_code: { _eq: directusLang } } },
              },
            },
          },
          limit: 1,
        }),
        CACHE_TIMES.PAGES
      )
    );

    return pages[0] || null;
  }, getMockPage(permalink, lang), `fetchPage(${siteSlug}, ${lang}, ${permalink})`);
}

// Additional API functions with proper typing
export async function fetchForm(id: string, languages_code: string): Promise<Forms | null> {
  return await safeApiCall(async () => {
    const forms = await directusApi.request(
      withRevalidate(
        readItems('forms', {
          fields: [
            '*',
            {
              fields: [
                '*',
                { translations: ['languages_code', 'label', 'placeholder', 'help', 'options'] },
              ],
            },
            { translations: ['languages_code', 'title', 'submit_label', 'success_message'] },
          ],
          filter: { id: { _eq: id } },
          deep: {
            translations: { _filter: { languages_code: { _eq: languages_code } } },
            fields: {
              translations: { _filter: { languages_code: { _eq: languages_code } } },
            },
          },
          limit: 1,
        }),
        CACHE_TIMES.FORMS
      )
    ) as unknown as Forms[];

    return forms[0] || null;
  }, null, `fetchForm(${id}, ${languages_code})`)
}

export async function fetchHelpCollections(lang: string): Promise<HelpCollections[]> {
  return await safeApiCall(async () => {
    const collections = await directusApi.request(
      readItems('help_collections', {
        filter: {},
        deep: {
          translations: { _filter: { languages_code: { _eq: lang } } },
        },
        fields: ['cover', 'slug', { translations: ['title', 'description'] }],
      })
    )
    return collections as HelpCollections[]
  }, [], `fetchHelpCollections(${lang})`)
}

export async function fetchHelpCollection(slug: string, lang: string): Promise<HelpCollections | null> {
  return await safeApiCall(async () => {
    const collections = await directusApi.request(
      withRevalidate(
        readItems('help_collections', {
          filter: { slug: { _eq: slug } },
          deep: {
            translations: { _filter: { languages_code: { _eq: lang } } },
          },
          limit: 1,
          fields: ['slug', 'cover', { translations: ['title', 'description'] }],
        }),
        60
      )
    )
    return collections[0] as HelpCollections || null
  }, null, `fetchHelpCollection(${slug}, ${lang})`)
}

export async function fetchHelpArticles(collectionSlug: string, lang: string): Promise<HelpArticles[] | null> {
  return await safeApiCall(async () => {
    const articles = await directusApi.request(
      withRevalidate(
        readItems('help_articles', {
          deep: {
            translations: { _filter: { languages_code: { _eq: lang } } },
          },
          filter: {
            help_collection: { slug: { _eq: collectionSlug } },
          },
          fields: ['id', 'slug', { translations: ['title', 'summary'] }],
        }),
        60
      )
    )
    return articles as HelpArticles[] || null
  }, null, `fetchHelpArticles(${collectionSlug}, ${lang})`)
}

export async function fetchHelpArticle(
  collectionSlug: string,
  slug: string,
  lang: string
): Promise<HelpArticles | null> {
  return await safeApiCall(async () => {
    const articles = await directusApi.request(
      readItems('help_articles', {
        filter: {
          slug: { _eq: slug },
          status: { _eq: 'published' },
          help_collection: { slug: { _eq: collectionSlug } },
        },
        deep: {
          help_collection: {
            translations: { _filter: { languages_code: { _eq: lang } } },
          },
          translations: { _filter: { languages_code: { _eq: lang } } },
        },
        limit: 1,
        fields: [
          '*',
          { help_collection: ['slug', 'id', { translations: ['title'] }] },
          { owner: ['first_name', 'last_name', 'avatar'] },
          { translations: ['content', 'languages_code', 'summary', 'title'] },
        ],
      })
    )
    return articles[0] as HelpArticles || null
  }, null, `fetchHelpArticle(${collectionSlug}, ${slug}, ${lang})`)
}

export async function fetchPost(slug: string, lang: string): Promise<Posts | null> {
  const site = await getSite(slug)
  if (!site) return null

  return await safeApiCall(async () => {
    const posts = await directusApi.request(
      readItems('posts', {
        deep: {
          translations: { _filter: { languages_code: { _eq: lang } } },
        },
        filter: { 
          slug: { _eq: slug },
          site_id: { _eq: site.id }
        },
        limit: 1,
        fields: [
          '*',
          { seo: ['*'] },
          { author: ['avatar', 'first_name', 'last_name'] },
          { category: ['title', 'slug', 'color'] },
          { translations: ['*'] },
        ],
      })
    )
    return posts[0] as Posts || null
  }, null, `fetchPost(${slug}, ${lang})`)
}

export default directusApi