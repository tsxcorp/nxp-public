import React from 'react';
import { Navigation, NavigationItem } from '@/data/directus-collections';
import Link from 'next/link';

interface TheFooterProps {
  navigation: Navigation | null;
  lang: string;
}

export default function TheFooter({ navigation, lang }: TheFooterProps) {
  if (!navigation || !Array.isArray(navigation.items)) return null;

  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto flex flex-col items-center">
        <nav className="mb-4">
          <ul className="flex flex-wrap justify-center gap-6">
            {navigation.items.map((item: NavigationItem) => {
              const title = item.translations[0]?.title || 'Untitled';
              return (
                <li key={item.id}>
                  <Link
                    href={item.href || '#'}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}