import { createDirectus, rest, readItems } from '@directus/sdk'
import type { Schema, Collection } from '@/types/directus'

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const directus = createDirectus<Schema>(directusUrl).with(rest())

export async function getCollections() {
  try {
    return await directus.request(readItems('sites', {
      fields: [
        '*',
        'id', 
        'name', 
        'slug']
    }))
  } catch (error) {
    console.error('Error fetching collections:', error)
    // Return empty array as fallback
    return []
  }
}

export async function getFields() {
  try {
    return await directus.request(readItems('forms', {
      fields: [
        '*', 
        'id', 
        'name', 
        'type']
    }))
  } catch (error) {
    console.error('Error fetching fields:', error)
    return []
  }
}

export async function getRelations() {
  try {
    return await directus.request(readItems('navigation', {
      fields: [
        '*',
        'id', 
        'title', 
        'type']
    }))
  } catch (error) {
    console.error('Error fetching relations:', error)
    return []
  }
}

export async function getCollectionFields(collection: Collection) {
  return directus.request(readItems('forms', {
    fields: [
      '*',
      'id', 
      'name', 
      'type'
    ],
    filter: {
      collection: {
        _eq: collection
      }
    }
  }))
}

export async function getCollectionRelations(collection: Collection) {
  return directus.request(readItems('navigation', {
    fields: [
      '*',
      'id', 
      'title', 
      'type'
    ],
    filter: {
      collection: {
        _eq: collection
      }
    }
  }))
}

export async function getCollectionById(id: string) {
  return directus.request(readItems('sites', {
    fields: ['*'],
    filter: {
      id: {
        _eq: id
      }
    }
  }))
}

export async function getRelationsByCollection(collection: Collection) {
  return directus.request(readItems('navigation', {
    fields: ['id', 'title', 'type'],
    filter: {
      _or: [
        {
          many_collection: {
            _eq: collection
          }
        },
        {
          one_collection: {
            _eq: collection
          }
        }
      ]
    }
  }))
} 