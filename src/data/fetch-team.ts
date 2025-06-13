import { readItems } from '@directus/sdk'
import directusApi from './directus-api'
import { Team } from './directus-collections'

export async function fetchTeamMembers(siteId?: number | string, blockTeamId?: string): Promise<Team[]> {
  console.log('[fetchTeamMembers] siteId:', siteId, 'blockTeamId:', blockTeamId);
  
  try {
    const filter: any = {
      status: { _eq: 'published' },
    };
    
    if (siteId) {
      filter.site_id = { _eq: siteId };
    }
    
    if (blockTeamId) {
      filter.block_team_id = { _eq: blockTeamId };
    }
    
    const result = await directusApi.request(
      readItems('team', {
        filter,
        fields: [
          '*',
          { image: ['*'] },
          { translations: ['*'] }
        ],
        sort: ['sort'],
      })
    );
    
    console.log('[fetchTeamMembers] result:', result);
    return result as Team[];
  } catch (error) {
    console.error('[fetchTeamMembers] Error:', error);
    return [];
  }
}