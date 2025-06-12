import {
  BlockCardgroup,
  BlockCardgroupCards,
  BlockCardgroupPosts,
  BlockColumns,
  BlockColumnsRows,
  BlockCta,
  BlockFaqs,
  BlockForm,
  BlockGallery,
  BlockGalleryFiles,
  BlockHero,
  BlockHtml,
  BlockLogocloud,
  BlockLogocloudFiles,
  BlockQuote,
  BlockRichtext,
  BlockSteps,
  BlockStepsItems,
  BlockTeam,
  BlockTestimonials,
  BlockTestimonialsItems,
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
  Team,
  Testimonials,
  Sites
} from '@/data/directus-collections'
import { CustomDirectusTypes } from './directus-collections'

export interface FormSchema {
  name: string;
  type: 'input' | 'textarea' | 'select';
  label: string;
  placeholder: string;
  help: string;
  validation: string;
  width: string | number;
  options?: Array<{ label: string; value: string }>;
  outerclass?: string;
  $formkit?: string;
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
  globals: Globals
  forms: Forms
  help_collections: HelpCollections
  help_articles: HelpArticles
  posts: Posts
  pages_translations: PagesTranslations
  pages_translations_blocks: PagesTranslationsBlocks
  posts_translations: PostsTranslations
  globals_translations: GlobalsTranslations
  help_articles_translations: HelpArticlesTranslations
  help_collections_translations: HelpCollectionsTranslations
  navigation_items: NavigationItems
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
  block_cardgroup_cards: BlockCardgroupCards
  block_cardgroup_posts: BlockCardgroupPosts
  block_columns: BlockColumns
  block_columns_rows: BlockColumnsRows
  block_cta: BlockCta
  block_faqs: BlockFaqs
  block_features: BlockFeatures
  block_form: BlockForm
  block_gallery: BlockGallery
  block_gallery_files: BlockGalleryFiles
  block_hero: BlockHero
  block_html: BlockHtml
  block_logocloud: BlockLogocloud
  block_logocloud_files: BlockLogocloudFiles
  block_quote: BlockQuote
  block_richtext: BlockRichtext
  block_steps: BlockSteps
  block_steps_items: BlockStepsItems
  block_team: BlockTeam
  block_testimonials: BlockTestimonials
  block_testimonials_items: BlockTestimonialsItems
  block_video: BlockVideo
  form_submission: any[]
  form_submissions: any[]
}
