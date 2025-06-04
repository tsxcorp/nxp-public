import React from 'react'
import { Navigation } from '@/data/directus-collections'
import Link from 'next/link'

interface TheFooterProps {
  navigation: Navigation | null
  lang: string
}

export default function TheFooter({ navigation, lang }: TheFooterProps) {
  if (!navigation) return null

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto flex flex-col items-center">
        <nav className="mb-4">
          <ul className="flex flex-wrap justify-center gap-6">
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
                <li key={item.id}>
                  <Link href={href} className="text-gray-600 hover:text-gray-900 transition-colors">
                    {displayTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</div>
      </div>
    </footer>
  )
}
