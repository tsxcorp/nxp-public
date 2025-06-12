import React from 'react';
import { fetchNavigationSafe, fetchPage, getSite } from '@/data/directus-api';
import TheHeader from '@/components/navigation/TheHeader';
import TheFooter from '@/components/navigation/TheFooter';
import { Navigation } from '@/data/directus-collections';
import PageBuilder from '@/components/PageBuilder'
import { PageProps } from '@/types/next';

export default async function Page({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  const { site, lang } = resolvedParams;

  // Fetch navigation (main/footer)
  const [mainNav, footerNav, siteData] = await Promise.all([
    fetchNavigationSafe(site, lang, 'main'),
    fetchNavigationSafe(site, lang, 'footer'),
    getSite(site)
  ]);

  // Fetch homepage
  const pageContent = await fetchPage(site, lang, '/');
  // Explicitly type translation
  const translation = (pageContent?.translations?.[0] ?? {}) as {
    title?: string;
    description?: string;
    blocks?: any[];
  };

  if (!pageContent) {
    console.log('\nNo page content found, showing 404');
    // If no page found, return 404
    return (
      <>
        <TheHeader navigation={mainNav} lang={lang} site={siteData} />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
            <div className="mb-2">Site: <b>{site}</b></div>
            <div className="mb-2">Lang: <b>{lang}</b></div>
            <div className="mb-2">Slug: <b>/</b></div>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h2 className="font-bold mb-2">Debug Info:</h2>
              <pre className="text-sm">
                {JSON.stringify({
                  params: resolvedParams,
                  searchParams: resolvedSearchParams,
                  hasMainNav: !!mainNav,
                  hasFooterNav: !!footerNav
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        <TheFooter navigation={footerNav} lang={lang} />
      </>
    );
  }

  return (
    <>
      <TheHeader navigation={mainNav} lang={lang} site={siteData} />
      <div className="min-h-screen w-full bg-gray-50 py-12">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <PageBuilder blocks={Array.isArray(pageContent.blocks) ? pageContent.blocks : []} lang={lang} />
        </div>
      </div>
      <TheFooter navigation={footerNav} lang={lang} />
    </>
  );
} 