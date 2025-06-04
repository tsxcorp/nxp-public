import React from 'react'
import { Navigation } from '@/data/directus-collections'
import Link from 'next/link'

interface TheHeaderProps {
  navigation: Navigation | null
  lang: string
}

export default function TheHeader({ navigation, lang }: TheHeaderProps) {
  if (!navigation) return null

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
            <span className="sr-only">Open main menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.items?.map((item) => {
            let href = '#';
            function getTitle(translations: any[] | undefined): string | undefined {
              if (!translations) return undefined;
              const found = translations.find(
                (t: any) =>
                  t.languages_code === lang ||
                  t.languages_code?.startsWith(lang + '-') ||
                  lang.startsWith(t.languages_code)
              );
              return found?.title;
            }
            let displayTitle =
              getTitle(item.page?.translations) ||
              getTitle(item.translations) ||
              'Untitled';

            if (item.type === 'url' && item.url) {
              href = item.url;
            } else if (item.type === 'page') {
              if (item.page && item.page.translations && item.page.translations.length > 0) {
                href = item.page.translations[0].permalink || '/';
              }
            }

            return (
              <Link
                key={item.id}
                href={href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {displayTitle}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  )
}
