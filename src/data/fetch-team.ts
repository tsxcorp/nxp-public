import { readItems } from '@directus/sdk'
import directusApi from './directus-api'

export async function fetchTeamMembers(siteId?: number, blockTeamId?: string) {
  console.log('[fetchTeamMembers] siteId:', siteId, 'blockTeamId:', blockTeamId);
  const filter: any = {
    status: { _eq: 'published' },
    ...(siteId ? { site_id: { _eq: siteId } } : {}),
    ...(blockTeamId ? { block_team_id: { _eq: blockTeamId } } : {})
  };
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
  return result;
} 