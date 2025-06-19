import { readItems } from '@directus/sdk'
import directus from '../client'
import { withRevalidate, safeApiCall } from '../utils'
import type { Sites } from '@/directus/types'

// Mock data for fallback when Directus is not available
const getMockSite = (siteSlug: string): Sites => ({
  id: '1',
  status: 'published',
  slug: siteSlug,
  name: 'Mock Site',
  navigation: ['1', '2']
})

export const getSite = async (siteSlug: string): Promise<Sites | null> => {
  console.log('\n=== Fetch Site ===');
  console.log('Site slug:', siteSlug);

  return await safeApiCall(async () => {
    const sites = await directus.request(
      withRevalidate(
        readItems('sites' as any, {
          filter: {
            slug: {
              _eq: siteSlug
            }
          },
          fields: [
            '*',
            'languages.*',
          ],
          limit: 1
        }),
        60
      )
    ) as Sites[];

    console.log('Raw site response:', sites);

    if (!sites[0]) {
      console.log('❌ No site found');
      return null;
    }

    console.log('✅ Site found:', {
      id: sites[0].id,
      name: sites[0].name,
      navigation: sites[0].navigation,
      status: sites[0].status
    });

    return sites[0];
  }, getMockSite(siteSlug), `getSite(${siteSlug})`);
}; 