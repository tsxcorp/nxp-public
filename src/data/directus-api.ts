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

const withRequestCallback = function <Schema extends object, Output>(
  onRequest: RequestTransformer,
  getOptions: RestCommand<Output, Schema>
): RestCommand<Output, Schema> {
  return () => {
    const options = getOptions()
    options.onRequest = onRequest
    return options
  }
}

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
  // Check if fallback data is enabled - if so, skip Directus connection attempt
  if (process.env.NEXT_PUBLIC_ENABLE_FALLBACK_DATA === 'true') {
    return false
  }

  try {
    const directusURL = getDirectusURL()
    const response = await fetch(`${directusURL}/server/ping`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    return response.ok
  } catch (error) {
    console.warn('[Directus] Server not available:', error)
    return false
  }
}

// Add error handling for Directus connection
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

// Only set token if it exists
const adminToken = process.env.DIRECTUS_ADMIN_TOKEN
if (adminToken && adminToken !== 'your-directus-admin-token') {
  directusApi.setToken(adminToken)
} else {
  console.warn('[Directus] No valid admin token found. Some operations may fail.')
}

// Enhanced error handling wrapper for API calls with better fallbacks
const safeApiCall = async <T>(
  apiCall: () => Promise<T>, 
  fallback: T | null = null,
  operationName: string = 'API call'
): Promise<T | null> => {
  try {
    // Check if Directus is available before making the call
    const available = await isDirectusAvailable()
    if (!available) {
      console.warn(`[Directus API] Server not available for ${operationName}, returning fallback`)
      return fallback
    }
    
    return await apiCall()
  } catch (error) {
    console.error(`[Directus API] ${operationName} failed:`, error)
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('Failed to fetch')) {
        console.error('[Directus API] Connection error - Directus server is not running or not accessible')
      } else if (error.message.includes('timeout')) {
        console.error('[Directus API] Request timeout - Directus server is not responding')
      }
    }
    return fallback
  }
}

// Helper function to get Directus language code from app language
const getDirectusLanguage = (lang: string): string => {
  const langMap: Record<string, string> = {
    'vi': 'vi-VN',
    'en': 'en-US',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'es': 'es-ES',
    'it': 'it-IT',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN',
    'pt': 'pt-BR',
    'ru': 'ru-RU',
    'ar': 'ar-SA',
    'hi': 'hi-IN',
    'th': 'th-TH',
    'id': 'id-ID',
    'ms': 'ms-MY',
    'tr': 'tr-TR',
    'nl': 'nl-NL',
    'pl': 'pl-PL',
    'uk': 'uk-UA',
  }
  return langMap[lang] || lang
}

// Mock data for fallback when Directus is not available
const getMockSite = (slug: string): Sites | null => {
  if (slug === 'default') return null
  
  return {
    id: '1',
    slug: slug,
    navigation: ['1', '2'], // footer, main
    status: 'published',
    title: `${slug} Site`
  }
}

const getMockGlobals = (lang: string): Globals => ({
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
    languages_code: lang,
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

const getMockNavigation = (siteSlug: string, lang: string, type: 'main' | 'footer' = 'main'): Navigation => ({
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
        translations: [{ languages_code: lang, permalink: '/' }]
      },
      translations: [{ title: 'Home', languages_code: lang }]
    },
    {
      id: '2',
      type: 'page',
      url: null,
      href: `/${siteSlug}/${lang}/about`,
      page: {
        id: '2',
        translations: [{ languages_code: lang, permalink: '/about' }]
      },
      translations: [{ title: 'About', languages_code: lang }]
    }
  ] : [
    {
      id: '3',
      type: 'url',
      url: '#',
      href: '#',
      page: null,
      translations: [{ title: 'Privacy', languages_code: lang }]
    }
  ]
})

const getMockPage = (permalink: string, lang: string): Pages => {
  const isHome = permalink === '/'
  
  return {
    id: isHome ? '1' : '2',
    status: 'published',
    site_id: '1',
    title: isHome ? 'Welcome' : 'About Us',
    translations: [{
      id: isHome ? '1' : '2',
      languages_code: lang,
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
            languages_code: lang,
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

// Cache the getSite function to prevent multiple calls
const getSite = cache(async (slug: string): Promise<Sites | null> => {
  console.log('[getSite] Fetching site with slug:', slug)
  
  // Skip if slug is default
  if (slug === 'default') {
    console.log('[getSite] Skipping fetch for default slug')
    return null
  }

  return await safeApiCall(async () => {
    const sites = await directusApi.request(
      withRevalidate(
        readItems('sites', {
          filter: {
            slug: {
              _eq: slug
            }
          },
          fields: ['*'],
          limit: 1
        }),
        60
      )
    );
    return sites[0] || null
  }, getMockSite(slug), `getSite(${slug})`)
})

const fetchGlobals = async function (slug: string, lang: string): Promise<Globals | null> {
  const site = await getSite(slug)
  console.log('[fetchGlobals] site:', JSON.stringify(site, null, 2));
  if (!site) return null

  return await safeApiCall(async () => {
    const globals = await directusApi.request(
      withRevalidate(
        readItems('globals', {
          filter: {
            site_id: {
              _eq: site.id
            }
          },
          deep: {
            translations: {
              _filter: {
                languages_code: {
                  _eq: lang,
                },
              },
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
        60
      )
    )
    console.log('[fetchGlobals] globals:', JSON.stringify(globals, null, 2));
    return globals[0] as Globals || null
  }, getMockGlobals(lang), `fetchGlobals(${slug}, ${lang})`)
}

const fetchNavigationSafe = async function (siteSlug: string, lang: string, type: 'main' | 'footer' = 'main'): Promise<Navigation | null> {
  console.log('\n=== Fetch Navigation ===');
  console.log('Site slug:', siteSlug);
  console.log('Navigation type:', type);

  const site = await getSite(siteSlug);
  if (!site) {
    console.log('❌ No site found');
    return getMockNavigation(siteSlug, lang, type);
  }

  // Get navigation ID from site
  const navigationId = type === 'main' ? site.navigation?.[1] : site.navigation?.[0];
  console.log('Navigation ID:', navigationId);

  if (!navigationId) {
    console.log('❌ No navigation ID found');
    return getMockNavigation(siteSlug, lang, type);
  }

  return await safeApiCall(async () => {
    const navigations = await directusApi.request(
      withRevalidate(
        readItems('navigation', {
          limit: 1,
          filter: {
            id: {
              _eq: navigationId,
            },
            status: {
              _eq: 'published',
            },
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
                    {
                      translations: [
                        'languages_code',
                        'permalink'
                      ]
                    }
                  ]
                },
                {
                  translations: [
                    'languages_code',
                    'title'
                  ]
                }
              ]
            }
          ],
        }),
        60
      )
    );

    if (!navigations[0]) {
      console.log('❌ No navigation found');
      return null;
    }

    console.log('✅ Navigation found:', {
      id: navigations[0].id,
      items: navigations[0].items?.length || 0,
    });

    const directusLang = getDirectusLanguage(lang);

    const processedItems = (navigations[0].items || []).map((item) => {
      const matchingTranslation = item.translations?.find(
        (trans) => trans.languages_code === directusLang
      ) || item.translations?.[0];

      let href = '#';
      if (item.type === 'url' && item.url) {
        href = item.url;
      } else if (item.type === 'page' && item.page?.translations) {
        const pageTrans = item.page.translations.find(
          (trans) => trans.languages_code === directusLang
        ) || item.page.translations[0];
        if (pageTrans?.permalink) {
          // Multitenant-first: /[site]/[lang]/[permalink]
          href = `/${siteSlug}/${lang}${pageTrans.permalink.startsWith('/') ? '' : '/'}${pageTrans.permalink}`;
        }
      }

      return {
        ...item,
        href,
        translations: matchingTranslation ? [{ title: matchingTranslation.title, languages_code: matchingTranslation.languages_code }] : [],
      };
    });

    const navigation: Navigation = {
      id: navigations[0].id,
      status: navigations[0].status as 'published' | 'draft' | 'archived',
      type: navigations[0].type as 'main' | 'footer',
      items: processedItems,
    };

    console.dir(navigation.items, { depth: null });
    return navigation;
  }, getMockNavigation(siteSlug, lang, type), `fetchNavigation(${siteSlug}, ${lang}, ${type})`);
};

async function fetchForm(id: string, languages_code: string): Promise<Forms | null> {
  return await safeApiCall(async () => {
    const forms = await directusApi.request(
      withRevalidate(
        readItems('forms', {
          fields: [
            '*', // Fetch all top-level fields (id, status, on_success, etc.)
            {
              fields: [ // Fetch related form fields
                '*', // All fields in form_fields (id, name, type, width, etc.)
                {
                  translations: [ // Fetch translations for form fields
                    'languages_code',
                    'label',
                    'placeholder',
                    'help',
                    'options',
                  ],
                },
              ],
            },
            {
              translations: [ // Fetch form translations
                'languages_code',
                'title',
                'submit_label',
                'success_message',
              ],
            },
          ],
          filter: {
            id: { // Filter by form ID (not key, assuming id is used)
              _eq: id,
            },
          },
          deep: {
            translations: {
              _filter: {
                languages_code: {
                  _eq: languages_code, // Filter translations by language
                },
              },
            },
            fields: {
              translations: {
                _filter: {
                  languages_code: {
                    _eq: languages_code,
                  },
                },
              },
            },
          },
          limit: 1,
        }),
        120 // Cache for 120 seconds
      )
    ) as unknown as Forms[];

    return forms[0] || null;
  }, null, `fetchForm(${id}, ${languages_code})`)
}

async function fetchHelpCollections(lang: string): Promise<HelpCollections[]> {
  return await safeApiCall(async () => {
    const collections = await directusApi.request(
      readItems('help_collections', {
        filter: {},
        deep: {
          translations: {
            _filter: {
              languages_code: {
                _eq: lang,
              },
            },
          },
        },
        fields: ['cover', 'slug', { translations: ['title', 'description'] }],
      })
    )

    return collections as HelpCollections[]
  }, [], `fetchHelpCollections(${lang})`)
}

async function fetchHelpCollection(slug: string, lang: string): Promise<HelpCollections | null> {
  return await safeApiCall(async () => {
    const collections = await directusApi.request(
      withRevalidate(
        readItems('help_collections', {
          filter: {
            _and: [
              {
                slug: {
                  _eq: slug,
                },
              },
            ],
          },
          deep: {
            translations: {
              _filter: {
                languages_code: {
                  _eq: lang,
                },
              },
            },
          },
          limit: 1,
          fields: ['slug', 'cover', { translations: ['title', 'description'] }],
        }),
        60
      )
    )

    if (collections.length === 0) return null

    return collections[0] as HelpCollections
  }, null, `fetchHelpCollection(${slug}, ${lang})`)
}

export async function fetchHelpArticles(collectionSlug: string, lang: string): Promise<HelpArticles[] | null> {
  return await safeApiCall(async () => {
    const articles = await directusApi.request(
      withRevalidate(
        readItems('help_articles', {
          deep: {
            translations: {
              _filter: {
                languages_code: {
                  _eq: lang,
                },
              },
            },
          },
          filter: {
            help_collection: {
              slug: {
                _eq: collectionSlug,
              },
            },
          },
          fields: ['id', 'slug', { translations: ['title', 'summary'] }],
        }),
        60
      )
    )

    if (articles.length === 0) return null

    return articles as HelpArticles[]
  }, null, `fetchHelpArticles(${collectionSlug}, ${lang})`)
}

async function fetchHelpArticle(
  collectionSlug: string,
  slug: string,
  lang: string
): Promise<HelpArticles | null> {
  return await safeApiCall(async () => {
    const articles = await directusApi.request(
      readItems('help_articles', {
        filter: {
          slug: {
            _eq: slug,
          },
          status: {
            _eq: 'published',
          },
          translations: {
            _nnull: true,
          },
          help_collection: {
            slug: {
              _eq: collectionSlug,
            },
          },
        },
        deep: {
          help_collection: {
            _filter: {
              translations: {
                _nnull: true,
              },
            },
            translations: {
              _filter: {
                _and: [
                  {
                    languages_code: {
                      _eq: lang,
                    },
                  },
                ],
              },
              _limit: 1,
            },
          },
          translations: {
            _filter: {
              languages_code: {
                _eq: lang,
              },
            },
          },
        },
        limit: 1,
        fields: [
          '*',
          {
            help_collection: ['slug', 'id', { translations: ['title'] }],
          },
          { owner: ['first_name', 'last_name', 'avatar'] },
          { translations: ['content', 'languages_code', 'summary', 'title'] },
        ],
      })
    )
    return articles[0] as HelpArticles || null
  }, null, `fetchHelpArticle(${collectionSlug}, ${slug}, ${lang})`)
}

// --- Field fragments for blocks ---
const blockFormFields = [
  '*',
  {
    form: [
      '*', // Fetch all form fields
      {
        fields: [ // Fetch form fields (schema)
          '*',
          {
            translations: ['languages_code', 'label', 'placeholder', 'help', 'options'],
          },
        ],
      },
      {
        translations: ['languages_code', 'title', 'submit_label', 'success_message'],
      },
    ],
  },
  {
    translations: ['title', 'headline', 'languages_code'],
  },
];

const galleryItemFields = [
  '*',
  { directus_files_id: ['*'] },
  {
    translations: [
      '*',
      { title: ['*'], headline: ['*'] }
    ]
  }
];

const blockTeamFields = [
  '*',
  { team: [
      '*',
      { image: ['*'] },
      { translations: ['bio', 'job_title', 'languages_code'] }
    ]
  },
  {
    translations: [
      'title',
      'headline',
      'content',
      'languages_code'
    ]
  }
];

const blockItemFields = [
  '*',
  { form: [
    '*', 
    { fields: [
      '*',
      { translations: ['*'] }] },
    { translations: ['*'] }] },
  { team: [
      '*',
      { image: ['*'] },
      { translations: ['bio', 'job_title', 'languages_code'] }
    ]
  },
  { translations: ['*', { faqs: ['*'] }] },
  { button_group: ['*', { buttons: ['*', { translations: ['*'] }] }] },
  { rows: ['*', { translations: ['*'] }] },
  { steps: ['*', { translations: ['*'] }] },
  { testimonials: [
      '*',
      { testimonials_id: ['*', { translations: ['*'] }] },
      { translations: ['*'] }
    ]
  },
  { logos: ['*', { directus_files_id: ['*'] }, { translations: ['*', 'title', 'headline'] }] },
  { gallery_items: galleryItemFields },
  { block_form: blockFormFields },
  { block_team: blockTeamFields },
];

// --- Enhanced fetchPage function ---
async function fetchPage(siteSlug: string, lang: string, permalink: string = '/'): Promise<Pages | null> {
  console.log('\n=== Fetch Page ===');
  console.log('Site slug:', siteSlug);
  console.log('Language:', lang);
  console.log('Permalink:', permalink);

  const site = await getSite(siteSlug);
  if (!site) {
    console.log('❌ No site found, returning mock page');
    return getMockPage(permalink, lang);
  }

  console.log('✅ Site found:', site.id);

  const directusLang = getDirectusLanguage(lang);
  console.log('Directus language code:', directusLang);

  return await safeApiCall(async () => {
    // First, let's see what pages exist for this site
    console.log('\n--- Checking available pages for site ---');
    const allPages = await directusApi.request(
      readItems('pages', {
        filter: {
          site_id: { _eq: site.id },
          status: { _eq: 'published' }
        },
        fields: [
          '*',
          { translations: ['languages_code', 'permalink', 'title'] }
        ],
        limit: 50
      })
    );

    console.log('Available pages:', allPages.map(p => ({
      id: p.id,
      title: p.title,
      translations: p.translations
    })));

    // Now try to find the specific page
    console.log('\n--- Searching for specific page ---');
    const pages = await directusApi.request(
      withRevalidate(
        readItems('pages', {
          filter: {
            site_id: { _eq: site.id },
            status: { _eq: 'published' },
            translations: { 
              permalink: { _eq: permalink },
              languages_code: { _eq: directusLang }
            },
          },
          fields: [
            '*',
            { translations: ['*'] },
            { blocks: ['*', { item: blockItemFields }] },
            { seo: ['*'] },
            { site_id: ['*'] },
          ],
          deep: {
            translations: { _filter: { languages_code: { _eq: directusLang } } },
            blocks: {
              item: {
                translations: { _filter: { languages_code: { _eq: directusLang } } },
                form: {
                  translations: { _filter: { languages_code: { _eq: directusLang } } },
                  fields: {
                    translations: { _filter: { languages_code: { _eq: directusLang } } },
                  },
                },
              },
            },
          },
          limit: 1,
        }),
        60
      )
    );

    console.log('Query result:', pages.length > 0 ? 'Found page' : 'No page found');

    if (!pages[0]) {
      console.log('❌ No page found with exact match, trying alternative approach...');
      
      // Try without language filter
      const fallbackPages = await directusApi.request(
        readItems('pages', {
          filter: {
            site_id: { _eq: site.id },
            status: { _eq: 'published' },
            translations: { 
              permalink: { _eq: permalink }
            },
          },
          fields: [
            '*',
            { translations: ['*'] },
            { blocks: ['*', { item: blockItemFields }] },
            { seo: ['*'] },
          ],
          limit: 1,
        })
      );

      if (fallbackPages[0]) {
        console.log('✅ Found page with fallback approach');
        return fallbackPages[0];
      }

      console.log('❌ No page found even with fallback');
      return null;
    }

    console.log('✅ Page found with exact match');
    console.log('Page data:', {
      id: pages[0].id,
      title: pages[0].title,
      translationsCount: pages[0].translations?.length || 0,
      blocksCount: pages[0].blocks?.length || 0
    });

    // Log blocks for debugging
    if (Array.isArray(pages[0].blocks)) {
      console.log('Blocks:', pages[0].blocks.map((block, index) => ({
        index,
        collection: block.collection,
        itemId: block.item?.id,
        hasTranslations: !!block.item?.translations
      })));
    }

    return pages[0];
  }, getMockPage(permalink, directusLang), `fetchPage(${siteSlug}, ${lang}, ${permalink})`);
}

async function fetchPost(slug: string, lang: string): Promise<Posts | null> {
  const site = await getSite(slug)
  if (!site) return null

  return await safeApiCall(async () => {
    const posts = await directusApi.request(
      readItems('posts', {
        deep: {
          translations: {
            _filter: {
              languages_code: {
                _eq: lang,
              },
            },
          },
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

    if (posts.length === 0) return null

    return posts[0] as Posts
  }, null, `fetchPost(${slug}, ${lang})`)
}

export default directusApi

export {
  fetchGlobals,
  fetchNavigationSafe,
  fetchForm,
  fetchHelpArticle,
  fetchHelpCollection,
  fetchHelpCollections,
  fetchPage,
  fetchPost,
  getSite,
}