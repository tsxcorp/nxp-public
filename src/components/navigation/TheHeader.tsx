'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation, NavigationItem } from '@/directus/types';
import { useTheme } from '@/components/providers/ThemeProvider';

interface TheHeaderProps {
  navigation: Navigation | null;
  lang: string;
  site?: any;
}

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || '';

const TheHeader: React.FC<TheHeaderProps> = ({ navigation, lang, site }) => {
  const { theme } = useTheme();
  
  // Use theme colors for styling
  const primaryColor = theme?.primary || 'blue';
  const textColor = theme?.gray || 'gray';
  const borderRadius = theme?.borderRadius || '1rem';
  const fontDisplay = theme?.fonts?.families?.display || 'Poppins, sans-serif';
  const fontBody = theme?.fonts?.families?.body || 'Inter, sans-serif';

  return (
    <header 
      className="w-full bg-white shadow py-3"
      style={{
        '--color-primary': primaryColor,
        '--color-gray': textColor,
        '--border-radius': borderRadius,
        '--font-display': fontDisplay,
        '--font-body': fontBody,
      } as React.CSSProperties}
    >
      <div className="mx-auto flex items-center justify-between max-w-7xl px-5 md:px-12">
        <div className="flex items-center gap-4">
          <Link href={`/${site?.slug || ''}/${lang}`} className="flex items-center gap-2">
            {site?.logo ? (
              <Image
                src={`${directusUrl}/assets/${site.logo}`}
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
        <nav className="flex gap-6 mr-8">
          {navigation && Array.isArray(navigation.items) && navigation.items.map((item: NavigationItem) => {
            const title = item.translations?.[0]?.title || '';
            return (
              <Link 
                key={item.id} 
                href={item.href || '#'} 
                className="font-semibold text-sm uppercase tracking-wide transition-colors duration-200 hover:text-[var(--color-primary)] text-gray-800"
                // style={{
                //   color: `var(--color-gray)`,
                //   fontFamily: 'var(--font-display)',
                // }}
              >
                {title.toUpperCase()}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default TheHeader;