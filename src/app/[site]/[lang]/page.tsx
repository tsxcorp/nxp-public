import React from 'react';
import { fetchNavigationSafe, fetchPage, getSite } from '@/data/directus-api';
import TheHeader from '@/components/navigation/TheHeader';
import TheFooter from '@/components/navigation/TheFooter';
import { Navigation } from '@/data/directus-collections';
import PageBuilder from '@/components/PageBuilder'
import { PageProps } from '@/types/next';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const [resolvedParams, resolvedSearchParams] = await Promise.all([
      params,
      searchParams
    ]);
    const { site, lang } = resolvedParams;

    console.log('[HomePage] Processing:', { site, lang });

    // Fetch navigation (main/footer)
    const [mainNav, footerNav, siteData] = await Promise.all([
      fetchNavigationSafe(site, lang, 'main'),
      fetchNavigationSafe(site, lang, 'footer'),
      getSite(site)
    ]);

    console.log('[HomePage] Navigation loaded:', { 
      mainNav: !!mainNav, 
      footerNav: !!footerNav,
      siteData: !!siteData
    });

    // Fetch homepage
    console.log('[HomePage] Fetching homepage content');
    const pageContent = await fetchPage(site, lang, '/');
    
    if (!pageContent) {
      console.log('[HomePage] No page content found, showing 404');
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

    console.log('[HomePage] Page content loaded:', pageContent.id);

    return (
      <>
        <TheHeader navigation={mainNav} lang={lang} site={siteData} />
        <div className="min-h-screen w-full bg-gray-50">
          <PageBuilder blocks={Array.isArray(pageContent.blocks) ? pageContent.blocks : []} lang={lang} />
        </div>
        <TheFooter navigation={footerNav} lang={lang} />
      </>
    );
  } catch (error) {
    console.error('[HomePage] Error:', error);
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error Loading Homepage</h1>
          <p className="text-gray-600 mb-4">
            There was an error loading the homepage content. This might be due to:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Directus server is not running</li>
            <li>Network connectivity issues</li>
            <li>Missing homepage configuration</li>
          </ul>
          <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
            <h2 className="font-bold mb-2 text-red-800">Error Details:</h2>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">
              {error instanceof Error ? error.message : String(error)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}