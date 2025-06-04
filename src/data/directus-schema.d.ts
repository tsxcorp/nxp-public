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
} from '@/data/directus-collections'
import { CustomDirectusTypes } from './directus-collections'

export interface FormSchema {
  name: string
  type: string
  label: string
  placeholder: string
  help: string
  validation: any
  width: string | number
  choices?: { label: string; value: any }[]
  outerclass?: string //not coming from backend.
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

export type DirectusSchema = CustomDirectusTypes
