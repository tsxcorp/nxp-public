import { CollectionType } from '@directus/sdk'

export type ValidCollectionType = 'posts' | 'pages' | 'categories' | 'projects' | 'help_articles' | 'forms' | 'navigation' | 'globals' | 'sites' | 'team' | 'testimonials'

export type SearchCollectionType = 'posts' | 'pages' | 'categories' | 'projects' | 'help_articles'

export type FormCollectionType = 'form_submission' | 'form_submissions'

export interface DirectusError {
  message: string
  extensions?: {
    code?: string
    [key: string]: any
  }
}

export interface DirectusResponse<T = any> {
  data: T
  meta?: {
    filter_count?: number
    total_count?: number
  }
}