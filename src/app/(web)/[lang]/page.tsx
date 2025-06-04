import React from 'react'
import { fetchPage } from '@/data/directus-api'
import { getTranslations } from '@/i18n/i18n'
import LangRedirect from '@/components/navigation/LangRedirect'
import PageBuilder from '@/components/PageBuilder'
import { fetchGlobalData } from '@/data/fetch-globals'
import { redirect } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { lang: string }
}) {
  console.log('[generateMetadata] Language:', params.lang)
  const { globalData } = await fetchGlobalData({ locale: params.lang })

  const { t } = await getTranslations({ locale: params.lang })
  return {
    title: `${t('global.home_title')} | ${globalData.tagline} `,
  }
}

export default async function PageRoute({
  params,
}: {
  params: { lang: string }
}) {
  // Validate language parameter
  if (!['en', 'vi'].includes(params.lang)) {
    console.log('[PageRoute] Invalid language:', params.lang)
    return redirect('/en')
  }

  // For root path, show default landing page
  if (params.lang === 'en') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Welcome to Nexpo
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Your platform for creating and managing event websites
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="/nexpo"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Visit Demo Site
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For Vietnamese root path
  if (params.lang === 'vi') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Chào mừng đến với Nexpo
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Nền tảng của bạn để tạo và quản lý trang web sự kiện
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a
                  href="/vi/nexpo"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Xem Trang Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
