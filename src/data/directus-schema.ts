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
  type: 'input' | 'textarea' | 'select' | 'email' | 'number' | 'multiselect' | 'file' | 'image'
  label: string
  placeholder: string
  help: string
  validation: string
  width: string | number
  options?: Array<{ label: string; value: string }>
  outerclass?: string
  $formkit?: string
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

export type DirectusSchema = {
  sites: Sites
  pages: Pages
  navigation: Navigation
  navigation_items: NavigationItems
  globals: Globals
  globals_translations: GlobalsTranslations
  forms: Forms
  help_collections: HelpCollections
  help_collections_translations: HelpCollections['translations'][0]
  help_articles: HelpArticles
  help_articles_translations: HelpArticlesTranslations
  posts: Posts
  posts_translations: PostsTranslations
  pages_translations: PagesTranslations
  pages_translations_blocks: PagesTranslationsBlocks
  seo: Seo
  team: Team
  testimonials: Testimonials
  projects: Projects
  projects_files: ProjectsFiles
  projects_settings: ProjectsSettings
  redirects: Redirects
  languages: Languages
  metrics: Metrics
  inbox: Inbox
  messages: Messages
  chat_config: ChatConfig
  conversations: Conversations
  help_feedback: HelpFeedback
  events: Events
  categories: Categories
  blog_settings: BlogSettings
  block_cardgroup: BlockCardgroup
  block_columns: BlockColumns
  block_cta: BlockCta
  block_faqs: BlockFaqs
  block_features: BlockFeatures
  block_form: BlockForm
  block_gallery: BlockGallery
  block_hero: BlockHero
  block_html: BlockHtml
  block_logocloud: BlockLogocloud
  block_quote: BlockQuote
  block_richtext: BlockRichtext
  block_steps: BlockSteps
  block_team: BlockTeam
  block_testimonials: BlockTestimonials
  block_video: BlockVideo
  form_submission: any
  form_submissions: any
  directus_activity: DirectusActivity
  directus_collections: DirectusCollections
  directus_dashboards: DirectusDashboards
  directus_fields: DirectusFields
  directus_files: DirectusFiles
  directus_flows: DirectusFlows
  directus_folders: DirectusFolders
  directus_migrations: DirectusMigrations
  directus_notifications: DirectusNotifications
  directus_operations: DirectusOperations
  directus_panels: DirectusPanels
  directus_permissions: DirectusPermissions
  directus_presets: DirectusPresets
  directus_relations: DirectusRelations
  directus_revisions: DirectusRevisions
  directus_roles: DirectusRoles
  directus_sessions: DirectusSessions
  directus_settings: DirectusSettings
  directus_shares: DirectusShares
  directus_translations: DirectusTranslations
  directus_users: DirectusUsers
  directus_webhooks: DirectusWebhooks
}