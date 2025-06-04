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

const directusApi = createDirectus<DirectusSchema>(getDirectusURL())
  .with(
    rest({
      onRequest: (currentOptions: RequestInit) => {
        const defaultRevalidate =
          process.env.API_CACHE_DISABLED === 'true' ? 0 : 10
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

directusApi.setToken(process.env.DIRECTUS_ADMIN_TOKEN || '')

// Cache the getSite function to prevent multiple calls
const getSite = cache(async (slug: string) => {
  console.log('[getSite] Fetching site with slug:', slug)
  
  // Skip if slug is default
  if (slug === 'default') {
    console.log('[getSite] Skipping fetch for default slug')
    return null
  }

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
  )
  
  console.log('[getSite] Found site:', JSON.stringify(sites[0], null, 2))
  return sites[0]
})

const fetchGlobals = async function name(slug: string, lang: string) {
  const site = await getSite(slug)
  if (!site) return null

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
  
  return globals[0] as Globals
}

const fetchNavigationSafe = async function name(slug: string, lang: string, type: 'main' | 'footer' = 'main') {
  console.log('\n=== Fetch Navigation ===')
  console.log('Site slug:', slug)
  console.log('Navigation type:', type)
  
  const site = await getSite(slug)
  if (!site) {
    console.log('❌ No site found')
    return null
  }

  // Get navigation ID from site
  const navigationId = type === 'main' ? site.navigation[1] : site.navigation[0]
  console.log('Navigation ID:', navigationId)

  const navigations = await directusApi.request(
    withRevalidate(
      readItems('navigation', {
        limit: 1,
        filter: {
          id: {
            _eq: navigationId
          },
          status: {
            _eq: 'published'
          }
        },
        fields: [
          'id',
          'status',
          {
            items: [
              'id',
              'type',
              'title',
              {
                translations: [
                  'languages_code',
                  'title'
                ]
              },
              'url',
              'has_children',
              'open_in_new_tab',
              'sort',
              {
                page: [
                  'id',
                  {
                    translations: [
                      'languages_code',
                      'title',
                      'permalink'
                    ]
                  }
                ]
              },
              {
                children: [
                  'id',
                  'title',
                  'type',
                  'url',
                  'open_in_new_tab',
                  {
                    page: [
                      'id',
                      {
                        translations: [
                          'languages_code',
                          'title',
                          'permalink'
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
      }),
      60
    )
  )

  if (!navigations[0]) {
    console.log('❌ No navigation found')
    return null
  }

  console.log('✅ Navigation found:', {
    id: navigations[0].id,
    items: navigations[0].items?.length || 0
  })

  console.dir(navigations[0].items, { depth: null })
  return navigations[0]
}

const fetchForm = async function (id: string, languages_code?: string) {
  const forms = (await directusApi.request(
    withRevalidate(
      readItems('forms', {
        fields: ['*'],
        filter: {
          key: {
            _eq: id,
          },
        },
        limit: 1,
      }),
      120
    )
  )) as Forms[]

  return forms[0]
}

async function fetchHelpCollections(lang: string) {
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

  // @ts-ignore
  return collections as HelpCollections[]
}

async function fetchHelpCollection(slug: string, lang: string) {
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
}

export async function fetchHelpArticles(collectionSlug: string, lang: string) {
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

  return articles
}

async function fetchHelpArticle(
  collectionSlug: string,
  slug: string,
  lang: string
) {
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
  // @ts-ignore
  return articles[0] as HelpArticles
}

async function fetchPage(slug: string, lang: string) {
  console.log('\n=== Fetch Page ===')
  console.log('Site slug:', slug)
  console.log('Language:', lang)
  
  const site = await getSite(slug)
  if (!site) {
    console.log('❌ No site found')
    return null
  }

  const pages = await directusApi.request(
    withRevalidate(
      readItems('pages', {
        filter: {
          site_id: {
            _eq: site.id
          }
        },
        fields: [
          'id',
          'status',
          'site_id',
          'blocks',
          { seo: ['*'] },
          {
            translations: [
              '*',
              {
                blocks: [
                  'collection',
                  {
                    item: {
                      block_hero: ['*'],
                      block_faqs: ['*'],
                      block_features: ['*'],
                      block_quote: ['*'],
                      block_columns: ['*', { rows: ['*'] }],
                      block_form: ['*', { form: ['*'] }],
                      block_testimonials: [
                        '*',
                        { testimonials: ['*', { testimonial: ['*'] }] },
                      ],
                      block_logocloud: ['*', { logos: [{ file: ['*'] }] }],
                      block_team: ['*'],
                      block_cta: ['*'],
                      block_richtext: ['*'],
                      block_steps: ['*', { steps: ['*'] }],
                      block_gallery: [
                        '*',
                        { gallery_items: ['*', { directus_files_id: ['*'] }] },
                      ],
                      block_cardgroup: [
                        '*',
                        { posts: [{ posts_id: ['*', { translations: ['*'] }] }] },
                      ],
                      block_html: ['*'],
                      block_video: ['*'],
                    },
                  },
                ],
              },
            ],
          },
        ],
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
      }),
      60
    )
  )

  if (!pages[0]) {
    console.log('❌ No page found')
    return null
  }

  console.log('✅ Page found:', {
    id: pages[0].id,
    blocks: pages[0].blocks?.length || 0,
    translations: pages[0].translations?.length || 0
  })
  return pages[0]
}

async function fetchPost(slug: string, lang: string) {
  const site = await getSite(slug)
  if (!site) return null

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
}
