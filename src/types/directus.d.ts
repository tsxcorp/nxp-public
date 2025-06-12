import { CollectionType } from '@directus/sdk'

declare module '@directus/sdk' {
  interface DirectusCollections {
    posts: any
    pages: any
    categories: any
    projects: any
    help_articles: any
    form_submission: any
    form_submissions: any
  }
}

export type ValidCollectionType = keyof DirectusCollections
export type SearchCollectionType = 'posts' | 'pages' | 'categories' | 'projects' | 'help_articles'
export type FormCollectionType = 'form_submission' | 'form_submissions' 