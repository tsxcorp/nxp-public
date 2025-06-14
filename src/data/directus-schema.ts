import {
  BlockCardgroup,
  BlockColumns,
  BlockCta,
  BlockFaqs,
  BlockFeatures,
  BlockForm,
  BlockGallery,
  BlockHero,
  BlockHtml,
  BlockLogocloud,
  BlockQuote,
  BlockRichtext,
  BlockSteps,
  BlockTeam,
  BlockTestimonials,
  BlockVideo,
  BlogSettings,
  Categories,
  ChatConfig,
  Conversations,
  DirectusActivity,
  DirectusCollections,
  DirectusDashboards,
  DirectusFields,
  DirectusFiles,
  DirectusFlows,
  DirectusFolders,
  DirectusMigrations,
  DirectusNotifications,
  DirectusOperations,
  DirectusPanels,
  DirectusPermissions,
  DirectusPresets,
  DirectusRelations,
  DirectusRevisions,
  DirectusRoles,
  DirectusSessions,
  DirectusSettings,
  DirectusShares,
  DirectusTranslations,
  DirectusUsers,
  DirectusWebhooks,
  Events,
  Forms,
  Globals,
  GlobalsTranslations,
  HelpArticles,
  HelpCollections,
  HelpFeedback,
  Inbox,
  Languages,
  Messages,
  Metrics,
  Navigation,
  NavigationItems,
  Pages,
  PagesTranslations,
  PagesTranslationsBlocks,
  Posts,
  PostsTranslations,
  Projects,
  ProjectsFiles,
  ProjectsSettings,
  Redirects,
  Seo,
  Sites,
  Team,
  Testimonials,
} from '@/data/directus-collections'

export interface FormSchema {
  name: string
  type: string
  label: string
  placeholder?: string
  help?: string
  validation?: string
  width?: string
  options?: any[]
}

export interface HeroButton {
  label: string
  href: string
  variant: string
  open_in_new_window: boolean
}

export interface SocialLink {
  service: string
  url: string
}

// Define the schema type with proper collection mappings
export type DirectusSchema = {
  [K in keyof typeof collections]: typeof collections[K]
}

// Define the collections object with proper types
const collections = {
  sites: {} as Sites,
  pages: {} as Pages,
  navigation: {} as Navigation,
  navigation_items: {} as NavigationItems,
  globals: {} as Globals,
  globals_translations: {} as GlobalsTranslations,
  forms: {} as Forms,
  help_collections: {} as HelpCollections,
  help_articles: {} as HelpArticles,
  posts: {} as Posts,
  posts_translations: {} as PostsTranslations,
  pages_translations: {} as PagesTranslations,
  pages_translations_blocks: {} as PagesTranslationsBlocks,
  seo: {} as Seo,
  team: {} as Team,
  testimonials: {} as Testimonials,
  projects: {} as Projects,
  projects_files: {} as ProjectsFiles,
  projects_settings: {} as ProjectsSettings,
  redirects: {} as Redirects,
  languages: {} as Languages,
  metrics: {} as Metrics,
  inbox: {} as Inbox,
  messages: {} as Messages,
  chat_config: {} as ChatConfig,
  conversations: {} as Conversations,
  help_feedback: {} as HelpFeedback,
  events: {} as Events,
  categories: {} as Categories,
  blog_settings: {} as BlogSettings,
  block_cardgroup: {} as BlockCardgroup,
  block_columns: {} as BlockColumns,
  block_cta: {} as BlockCta,
  block_faqs: {} as BlockFaqs,
  block_features: {} as BlockFeatures,
  block_form: {} as BlockForm,
  block_gallery: {} as BlockGallery,
  block_hero: {} as BlockHero,
  block_html: {} as BlockHtml,
  block_logocloud: {} as BlockLogocloud,
  block_quote: {} as BlockQuote,
  block_richtext: {} as BlockRichtext,
  block_steps: {} as BlockSteps,
  block_team: {} as BlockTeam,
  block_testimonials: {} as BlockTestimonials,
  block_video: {} as BlockVideo,
  form_submission: {} as any,
  form_submissions: {} as any,
  directus_activity: {} as DirectusActivity,
  directus_collections: {} as DirectusCollections,
  directus_dashboards: {} as DirectusDashboards,
  directus_fields: {} as DirectusFields,
  directus_files: {} as DirectusFiles,
  directus_flows: {} as DirectusFlows,
  directus_folders: {} as DirectusFolders,
  directus_migrations: {} as DirectusMigrations,
  directus_notifications: {} as DirectusNotifications,
  directus_operations: {} as DirectusOperations,
  directus_panels: {} as DirectusPanels,
  directus_permissions: {} as DirectusPermissions,
  directus_presets: {} as DirectusPresets,
  directus_relations: {} as DirectusRelations,
  directus_revisions: {} as DirectusRevisions,
  directus_roles: {} as DirectusRoles,
  directus_sessions: {} as DirectusSessions,
  directus_settings: {} as DirectusSettings,
  directus_shares: {} as DirectusShares,
  directus_translations: {} as DirectusTranslations,
  directus_users: {} as DirectusUsers,
  directus_webhooks: {} as DirectusWebhooks,
}