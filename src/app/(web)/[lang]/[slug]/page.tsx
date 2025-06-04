import React from 'react'
import { fetchPage, fetchNavigationSafe } from '@/data/directus-api'
import { getTranslations } from '@/i18n/i18n'
import LangRedirect from '@/components/navigation/LangRedirect'
import PageBuilder from '@/components/PageBuilder'
import { fetchGlobalData } from '@/data/fetch-globals'
import { redirect } from 'next/navigation'
import TheHeader from '@/components/navigation/TheHeader'
import TheFooter from '@/components/navigation/TheFooter'

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string }
}) {
  console.log('[generateMetadata] Language:', params.lang, 'Slug:', params.slug)
  const { globalData } = await fetchGlobalData({ locale: params.lang, params: { slug: params.slug } })

  const { t } = await getTranslations({ locale: params.lang })
  return {
    title: `${t('global.home_title')} | ${globalData.tagline} `,
  }
}

export default async function PageRoute({
  params,
}: {
  params: { lang: string; slug: string }
}) {
  // 1. Validate language parameter
  if (!['en', 'vi'].includes(params.lang)) {
    console.log('[PageRoute] Invalid language:', params.lang)
    return redirect('/en')
  }

  // 2. Fetch page from slug
  console.log('[PageRoute] Fetching page with slug:', params.slug)
  const page = await fetchPage(params.slug, params.lang)

  // 4. Get navigation (always fetch)
  console.log('[PageRoute] Fetching navigation for site:', page?.site_id)
  const [mainNav, footerNav] = await Promise.all([
    fetchNavigationSafe(params.slug, params.lang, 'main'),
    fetchNavigationSafe(params.slug, params.lang, 'footer')
  ])

  // 3. Handle not found
  if (!page) {
    console.log('[PageRoute] No page found for slug:', params.slug)
    return (
      <>
        <TheHeader navigation={mainNav} lang={params.lang} />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                {params.lang === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found'}
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                {params.lang === 'vi' 
                  ? 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.'
                  : 'The page you are looking for does not exist or has been removed.'}
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a
                    href={`/${params.lang}`}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                  >
                    {params.lang === 'vi' ? 'Về Trang Chủ' : 'Back to Home'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <TheFooter navigation={footerNav} lang={params.lang} />
      </>
    )
  }

  // 5. Render header, content (or LangRedirect), and footer
  return (
    <>
      <TheHeader navigation={mainNav} lang={params.lang} />
      {(!page.translations || page.translations.length === 0) ? (
        <LangRedirect lang={params.lang} />
      ) : (
        <PageBuilder 
          page={page}
          mainNav={mainNav}
          footerNav={footerNav}
        />
      )}
      <TheFooter navigation={footerNav} lang={params.lang} />
    </>
  )
}
