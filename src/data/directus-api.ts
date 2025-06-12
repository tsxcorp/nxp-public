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
  );
  return sites[0]
})

const fetchGlobals = async function name(slug: string, lang: string) {
  const site = await getSite(slug)
  console.log('[fetchGlobals] site:', JSON.stringify(site, null, 2));
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
  return globals[0] as Globals
}

const fetchNavigationSafe = async function name(siteSlug: string, lang: string, type: 'main' | 'footer' = 'main'): Promise<Navigation | null> {
  console.log('\n=== Fetch Navigation ===');
  console.log('Site slug:', siteSlug);
  console.log('Navigation type:', type);

  const site = await getSite(siteSlug);
  if (!site) {
    console.log('❌ No site found');
    return null;
  }

  // Get navigation ID from site
  const navigationId = type === 'main' ? site.navigation[1] : site.navigation[0];
  console.log('Navigation ID:', navigationId);

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

  const langMap = { vi: 'vi-VN', en: 'en-US' } as const;
  const directusLang = langMap[lang as keyof typeof langMap] || lang;

  const processedItems = navigations[0].items.map((item) => {
    const matchingTranslation = item.translations.find(
      (trans) => trans.languages_code === directusLang
    ) || item.translations[0];

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
};

async function fetchForm(id: string, languages_code: string) {
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

  return forms[0];
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

// --- Refactored fetchPage function ---
async function fetchPage(siteSlug: string, lang: string, permalink: string = '/') {
  const site = await getSite(siteSlug);
  if (!site) return null;

  const langMap = { vi: 'vi-VN', en: 'en-US' } as const;
  const langCode = langMap[lang as keyof typeof langMap] || lang;

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
          { blocks: ['*', { item: blockItemFields }] },
          { seo: ['*'] },
          { site_id: ['*'] },
        ],
        deep: {
          translations: { _filter: { languages_code: { _eq: langCode } } },
          blocks: {
            item: {
              translations: { _filter: { languages_code: { _eq: langCode } } },
              form: { // Add form-specific filtering
                translations: { _filter: { languages_code: { _eq: langCode } } },
                fields: {
                  translations: { _filter: { languages_code: { _eq: langCode } } },
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

  if (!pages[0]) return null;

  // Log toàn bộ trang để kiểm tra cấu trúc
  console.log('[fetchPage] Full Page Data:', JSON.stringify(pages[0], null, 2));

  // Log blocks trực tiếp từ pages.blocks
  if (Array.isArray(pages[0].blocks)) {
    console.log('[fetchPage] Blocks:', JSON.stringify(pages[0].blocks, null, 2));
    // Log button group and button data for each block
    pages[0].blocks.forEach((block, index) => {
      if (block.item?.button_group) {
        console.log(`[fetchPage] Block ${index} button_group:`, JSON.stringify(block.item.button_group, null, 2));
        if (block.item.button_group.buttons) {
          console.log(`[fetchPage] Block ${index} buttons:`, JSON.stringify(block.item.button_group.buttons, null, 2));
        }
      }
    });
  } else {
    console.log('[fetchPage] No blocks found in pages.');
  }

  console.log('Blocks for PageBuilder:', pages[0].blocks);

  return pages[0];
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
  getSite,
}
