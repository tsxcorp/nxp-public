'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation, NavigationItem } from '@/directus/types';
import { useTheme } from '@/components/providers/ThemeProvider';
import LocaleSwitcher from '@/components/global/LocaleSwitcher';
import i18nConfig from '@/i18n/i18nConfig';
import { getDirectusMedia } from '@/lib/utils/directus-helpers';

interface TheHeaderProps {
  navigation: Navigation | null;
  lang: string;
  site?: any;
  siteData?: any;
  translations?: any;
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';

const TheHeader: React.FC<TheHeaderProps> = ({ navigation, lang, site, siteData, translations }) => {
  const { theme } = useTheme();
  
  console.log('[TheHeader] Debug props:', {
    site,
    siteData,
    siteDataLanguages: siteData?.languages,
    translations,
    lang
  });
  
  // Use theme colors for styling
  const primaryColor = theme?.primary || 'blue';
  const textColor = theme?.gray || 'gray';
  const borderRadius = theme?.borderRadius || '1rem';
  const fontDisplay = theme?.fonts?.families?.display || 'Poppins, sans-serif';
  const fontBody = theme?.fonts?.families?.body || 'Inter, sans-serif';

  // Lấy slug site nếu có
  const siteSlug = site?.slug || site?.toString() || siteData?.slug || '';

  return (
    <header className="w-full bg-white shadow py-3">
      <div className="mx-auto flex items-center justify-between max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-4">
          <Link href={`/${siteSlug}/${lang}`} className="flex items-center gap-2">
            {siteData?.logo ? (
              <Image
                src={siteData?.logo ? getDirectusMedia(siteData.logo) : '/logo.svg'}
                alt={site?.title || 'Logo'}
                className="h-10 w-auto object-contain"
                width={80}
                height={40}
              />
            ) : (
              <span className="font-bold text-xl uppercase" style={{ color: `var(--color-primary)` }}>
                {site?.title || 'Site'}
              </span>
            )}
          </Link>
        </div>
        <nav className="flex gap-6">
          {navigation && Array.isArray(navigation.items) && navigation.items.map((item: NavigationItem) => {
            const title = item.translations?.[0]?.title || '';
            return (
              <Link 
                key={item.id} 
                href={item.href || '#'} 
                className="font-semibold text-sm uppercase tracking-wide transition-colors duration-200 hover:text-[var(--color-primary)] text-gray-800"
              >
                {title.toUpperCase()}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <LocaleSwitcher
            locales={Array.isArray(siteData?.languages) ? siteData.languages : []}
            site={siteSlug}
            translations={translations || []}
            currentLang={lang}
          />
        </div>
      </div>
    </header>
  );
};

export default TheHeader;