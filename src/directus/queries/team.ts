import { readItems } from '@directus/sdk'
import directus from '../client'
import { withRevalidate, safeApiCall } from '../utils'
import type { Team } from '../types'

// Mock data for fallback when Directus is not available
const getMockTeam = (): Team[] => [
  {
    id: '1',
    status: 'published',
    full_name: 'John Doe',
    position: 'CEO',
    translations: [
      {
        id: '1',
        languages_code: 'en-US',
        full_name: 'John Doe',
        position: 'CEO'
      }
    ]
  }
]

export const fetchTeamMembers = async (siteId?: string, blockId?: string): Promise<Team[]> => {
  console.log('\n=== Fetch Team Members ===')
  console.log('Site ID:', siteId)
  console.log('Block ID:', blockId)

  const result = await safeApiCall(async () => {
    const team = await directus.request(
      withRevalidate(
        readItems('team' as any, {
          fields: ['*'],
          sort: ['sort'],
          filter: {
            site_id: {
              _eq: siteId
            }
          }
        }),
        60
      )
    ) as Team[]

    if (!team.length) {
      console.log('❌ No team members found')
      return []
    }

    console.log('✅ Team members found:', team.length)

    return team
  }, getMockTeam(), 'fetchTeamMembers()')

  return result || []
} 