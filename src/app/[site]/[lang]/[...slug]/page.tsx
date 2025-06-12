import React from 'react';
import { fetchNavigationSafe, fetchPage, getSite } from '@/data/directus-api';
import TheHeader from '@/components/navigation/TheHeader';
import TheFooter from '@/components/navigation/TheFooter';
import { Navigation } from '@/data/directus-collections';
import PageBuilder from '@/components/PageBuilder'
import { fetchTeamMembers } from '@/data/fetch-team';

export default async function SlugPage({ params }: { params: { site: string, lang: string, slug?: string[] } }) {  // console.log('\n=== Page Component ===');
  // console.log('Raw params:', params);
  
  const { site, lang, slug } = params;
  // console.log('Parsed params:', { site, lang, slug });

  // Fetch site data to get siteId (if multi-tenant)
  const siteData = await getSite(site);

  // Fetch navigation (main/footer)
  // console.log('\nFetching navigation...');
  const [mainNav, footerNav] = await Promise.all([
    fetchNavigationSafe(site, lang, 'main'),
    fetchNavigationSafe(site, lang, 'footer')
  ]);
  // console.log('Navigation results:', {
  //   mainNav: mainNav ? {
  //     id: mainNav.id,
  //     type: mainNav.type,
  //     itemsCount: mainNav.items.length
  //   } : null,
  //   footerNav: footerNav ? {
  //     id: footerNav.id,
  //     type: footerNav.type,
  //     itemsCount: footerNav.items.length
  //   } : null
  // });

  // Fetch page content
  // If no slug or slug is empty array, fetch homepage (permalink: "/")
  // If slug is ['nexpo'], also fetch homepage
  const pageSlug = !slug || slug.length === 0 || (slug.length === 1 && slug[0] === site) ? '/' : slug.join('/');
  // console.log('\nFetching page:', {
  //   site,
  //   lang,
  //   pageSlug,
  //   originalSlug: slug
  // });
  
  const pageContent = await fetchPage(site, lang, pageSlug);
  // console.log('pageContent:', JSON.stringify(pageContent, null, 2));

  if (!pageContent) {
    // console.log('\nNo page content found, showing 404');
    // If no page found, return 404
    return (
      <>
        <TheHeader navigation={mainNav} lang={lang} />
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
                  site,
                  lang,
                  slug,
                  pageSlug,
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

  // Defensive: translations is always array or []
  const translations = Array.isArray(pageContent?.translations) ? (pageContent.translations as any[]) : [];
  // Find translation khớp lang, fallback [0]
  const firstTrans = (translations.find((t: any) => t.languages_code === (lang === 'en' ? 'en-US' : 'vi-VN')) || translations[0]) as {
    title?: string;
    languages_code?: string;
    blocks?: any[];
  } | undefined;

  // Log blocks for debug
  // console.log('firstTrans.blocks:', JSON.stringify(firstTrans?.blocks, null, 2));

  // Fetch team members for each block_team block
  const blocks = Array.isArray(pageContent.blocks) ? pageContent.blocks : [];
  const teamMembersMap: Record<string, any[]> = {};
  await Promise.all(
    blocks.map(async (block: { collection: string; item?: { id: string } }) => {
      if (block.collection === 'block_team' && block.item?.id) {
        teamMembersMap[block.item.id] = await fetchTeamMembers(siteData?.id, block.item.id);
      }
    })
  );

  return (
    <>
      <TheHeader navigation={mainNav} lang={lang} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">{firstTrans?.title || pageContent.title || 'Untitled'}</h1>
          <div className="mb-2">Site: <b>{site}</b></div>
          <div className="mb-2">Lang: <b>{lang}</b></div>
          <div className="mb-2">Slug: <b>{pageSlug}</b></div>
          <PageBuilder
            blocks={blocks}
            lang={lang}
            teamMembersMap={teamMembersMap}
          />
        </div>
      </div>
      <TheFooter navigation={footerNav} lang={lang} />
    </>
  );
} 