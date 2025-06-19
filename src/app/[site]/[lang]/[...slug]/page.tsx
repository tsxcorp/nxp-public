import React from 'react';
import { fetchNavigationSafe } from '@/directus/queries/navigation';
import { fetchPage } from '@/directus/queries/pages';
import { getSite } from '@/directus/queries/sites';
import TheHeader from '@/components/navigation/TheHeader';
import TheFooter from '@/components/navigation/TheFooter';
import type { Page } from '@/directus/types';
import PageBuilder from '@/components/PageBuilder';
import { PageProps } from '@/types/next';

type BlockTranslation = {
  languages_code: string;
  title?: string;
  headline?: string;
  content?: string;
};

type BlockItem = {
  id: string;
  translations?: BlockTranslation[];
  title?: string;
  headline?: string;
  content?: string;
  image?: string;
  image_position?: string;
  button_group?: any;
  gallery_items?: any[];
};

export default async function SlugPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  const { site, lang, slug } = resolvedParams;

  console.log('\n=== Page Component Debug ===');
  console.log('Site:', site);
  console.log('Language:', lang);
  console.log('Slug:', slug);

  // Fetch site data to get siteId (if multi-tenant)
  const siteData = await getSite(site);

  // Fetch navigation (main/footer)
  const [mainNav, footerNav] = await Promise.all([
    fetchNavigationSafe(site, lang, 'header'),
    fetchNavigationSafe(site, lang, 'footer')
  ]);

  console.log('\n=== Navigation Data ===');
  console.log('Header Navigation:', mainNav);
  console.log('Footer Navigation:', footerNav);
  console.log('Site Data:', siteData);

  // Fetch page content
  // If no slug or slug is empty array, fetch homepage (permalink: "/")
  // If slug is ['nexpo'], also fetch homepage
  const pageSlug = !slug || slug.length === 0 || (slug.length === 1 && slug[0] === site) ? '/' : `/${slug.join('/')}`;
  
  console.log('\n=== Page Fetch Debug ===');
  console.log('Page Slug:', pageSlug);
  
  const pageContent = await fetchPage(site, lang, pageSlug) as (Page & {
    translations: Array<{
      languages_code: string;
      title?: string;
      permalink: string;
      content?: string;
    }>;
    blocks?: any[];
  }) | null;

  console.log('\n=== Page Content Debug ===');
  console.log('Page Content:', JSON.stringify(pageContent, null, 2));
  if (pageContent?.blocks) {
    console.log('\n=== Blocks Debug ===');
    console.log('Number of blocks:', pageContent.blocks.length);
    pageContent.blocks.forEach((block, index) => {
      console.log(`\nBlock ${index + 1}:`);
      console.log('Collection:', block.collection);
      console.log('Block ID:', block.id);
      console.log('Item:', JSON.stringify(block.item, null, 2));
    });
  }

  if (!pageContent) {
    console.log('\nNo page content found, showing 404');
    // If no page found, return 404
    return (
      <>
        <TheHeader navigation={mainNav} lang={lang} site={siteData?.slug || site} siteData={siteData} translations={[]} />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
            <div className="mb-2">Site: <b>{site}</b></div>
            <div className="mb-2">Lang: <b>{lang}</b></div>
            <div className="mb-2">Slug: <b>{pageSlug}</b></div>
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
      <TheHeader navigation={mainNav} lang={lang} site={siteData?.slug || site} siteData={siteData} translations={pageContent?.translations || []} />
      <div className="min-h-screen w-full bg-gray-50 py-12">
        <div className="w-full px-4 md:px-8 lg:px-16">
          <PageBuilder blocks={Array.isArray(pageContent.blocks) ? pageContent.blocks : []} lang={lang} />
        </div>
      </div>
      <TheFooter navigation={footerNav} lang={lang} />
    </>
  );
}