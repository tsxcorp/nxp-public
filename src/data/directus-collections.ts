import { FormSchema, SocialLink } from '@/data/directus-schema'

// Base interface for all collections
export interface BaseCollection {
  id: string
  status: 'published' | 'draft' | 'archived'
  date_created?: string
  date_updated?: string
  user_created?: string
  user_updated?: string
}

// Base interface for translations
export interface BaseTranslation {
  languages_code: string
  title?: string
  description?: string
  content?: string
  permalink?: string
}

export interface BlockCardgroup {
  cards?: BlockCardgroupCards[]
  group_type?: string
  headline?: string
  id: string
  posts?: BlockCardgroupPosts[]
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockCardgroupCards {
  block_cardgroup_id?: string | BlockCardgroup
  href?: string
  id: string
  image?: string | DirectusFiles
  sort?: number
  summary?: string
  title?: string
}

export interface BlockCardgroupPosts {
  block_cardgroup_id?: string | BlockCardgroup
  id: number
  posts_id?: string | Posts
}

export interface BlockColumns {
  headline?: string
  id: string
  rows?: BlockColumnsRows[]
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockColumnsRows {
  block_columns?: string | BlockColumns
  content?: string
  headline?: string
  id: number
  image?: string | DirectusFiles
  image_position?: string
  title?: string
  translations?: Array<{
    content?: string
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockCta {
  buttons?: Array<{
    id: string
    label: string
    href: string
    open_in_new_window: boolean
    variant: 'primary' | 'default' | 'outline'
    color?: 'primary' | 'gray' | 'black' | 'white'
    translations?: Array<{
      label?: string
      href?: string
      languages_code: string
    }>
  }>
  content?: string
  headline?: string
  id: string
  title?: string
  translations?: Array<{
    content?: string
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockFaqs {
  faqs?: Array<{
    title: string
    answer: string
  }>
  headline?: string
  id: string
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
    faqs?: Array<{
      title: string
      answer: string
    }>
  }>
}

export interface BlockFeatures {
  description?: string
  features?: Array<{
    id: string
    title: string
    description: string
    show_link: boolean
    new_tab: boolean
    url: string
    text: string
    translations?: Array<{
      title?: string
      description?: string
      text?: string
      languages_code: string
    }>
  }>
  id: string
  title?: string
  translations?: Array<{
    title?: string
    description?: string
    languages_code: string
  }>
}

export interface BlockForm {
  form?: string | Forms
  headline?: string
  id: string
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockGallery {
  gallery_items?: BlockGalleryFiles[]
  headline?: string
  id: string
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockGalleryFiles {
  block_gallery?: string | BlockGallery
  directus_files_id?: string | DirectusFiles
  id: number
  sort?: number
}

export interface BlockHero {
  buttons?: Array<{
    id: string
    label: string
    href: string
    open_in_new_window: boolean
    variant: string
    translations?: Array<{
      label: string
      href: string
      languages_code: string
    }>
  }>
  button_group?: {
    buttons: Array<{
      id: string
      label: string
      href: string
      open_in_new_window: boolean
      variant: string
      translations?: Array<{
        label: string
        href: string
        languages_code: string
      }>
    }>
  }
  content?: string
  headline?: string
  id: string
  image?: string | DirectusFiles
  title?: string | null
  translations?: Array<{
    content?: string
    headline?: string
    title?: string | null
    languages_code: string
  }>
}

export interface BlockHtml {
  id: string
  raw_html?: string
  translations?: Array<{
    raw_html?: string
    languages_code: string
  }>
}

export interface BlockLogocloud {
  headline?: string
  id: string
  logos?: Array<{
    id: string
    sort: number
    block_logocloud_id: string
    directus_files_id: {
      id: string
      title: string
      type: string
    }
  }>
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockQuote {
  background_color?: string
  content?: string
  headline?: string
  id: string
  image?: string | DirectusFiles
  subtitle?: string
  title?: string
  translations?: Array<{
    content?: string
    headline?: string
    subtitle?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockRichtext {
  content?: string
  headline?: string
  id: string
  title?: string
  translations?: Array<{
    content?: string
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockSteps {
  alternate_image_position?: boolean
  headline?: string
  id: string
  show_step_numbers?: boolean
  steps?: Array<{
    title?: string
    content?: string
    image?: string
    translations?: Array<{
      title?: string
      content?: string
      languages_code: string
    }>
  }>
  title?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockTeam {
  content?: string
  headline?: string
  id: string
  title?: string
  team?: Array<{
    id: string
    name: string
    job_title?: string
    image?: any
    bio?: string
    social_media?: Array<{
      service: string
      url: string
    }>
    role?: string
    translations?: Array<{
      job_title?: string
      bio?: string
      languages_code: string
    }>
  }>
  translations?: Array<{
    content?: string
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlockTestimonials {
  headline?: string
  id: string
  testimonials?: Array<{
    testimonial?: {
      id: string | number
      title: string
      subtitle: string
      image: string
      company: string
      company_logo: string
      link: string
      content: string
      translations?: Array<{
        title?: string
        subtitle?: string
        content?: string
        languages_code: string
      }>
    }
    testimonials_id?: {
      id: string | number
      title: string
      subtitle: string
      image: string
      company: string
      company_logo: string
      link: string
      content: string
      translations?: Array<{
        title?: string
        subtitle?: string
        content?: string
        languages_code: string
      }>
    }
  }>
  title?: string
  subtitle?: string
  translations?: Array<{
    headline?: string
    title?: string
    subtitle?: string
    languages_code: string
  }>
}

export interface BlockVideo {
  headline?: string
  id: string
  title?: string
  type?: string
  video_file?: string | DirectusFiles
  video_url?: string
  translations?: Array<{
    headline?: string
    title?: string
    languages_code: string
  }>
}

export interface BlogSettings {
  featured_post?: string | Posts
  headline?: string
  id: string
  posts_per_page?: number
  seo?: Seo
  title?: string
}

export interface Categories {
  color?: string
  content?: string
  id: string
  seo?: Seo
  slug?: string
  sort?: number
  title?: string
}

export interface ChatConfig {
  enabled?: boolean
  hours?: unknown
  id: string
  modules?: unknown
  require_email?: string
}

export interface Conversations {
  date_created?: string
  date_updated?: string
  id: string
  messages?: Messages[]
  status: string
  title?: string
  visitor_id?: string
}

export interface DirectusActivity {
  action: string
  collection: string
  comment?: string
  id: number
  ip?: string
  item: string
  origin?: string
  revisions?: DirectusRevisions[]
  timestamp: string
  user?: string | DirectusUsers
  user_agent?: string
}

export interface DirectusCollections {
  accountability?: string
  archive_app_filter: boolean
  archive_field?: string
  archive_value?: string
  collapse: string
  collection: string
  color?: string
  display_template?: string
  group?: string | DirectusCollections
  hidden: boolean
  icon?: string
  item_duplication_fields?: unknown
  note?: string
  preview_url?: string
  singleton: boolean
  sort?: number
  sort_field?: string
  translations?: unknown
  unarchive_value?: string
}

export interface DirectusDashboards {
  color?: string
  date_created?: string
  icon: string
  id: string
  name: string
  note?: string
  panels?: DirectusPanels[]
  user_created?: string | DirectusUsers
}

export interface DirectusFields {
  collection?: string | DirectusCollections
  conditions?: unknown
  display?: string
  display_options?: unknown
  field: string
  group?: string | DirectusFields
  hidden: boolean
  id: number
  interface?: string
  note?: string
  options?: unknown
  readonly: boolean
  required?: boolean
  sort?: number
  special?: unknown
  translations?: unknown
  validation?: unknown
  validation_message?: string
  width?: string
}

export interface DirectusFiles {
  charset?: string
  description?: string
  duration?: number
  embed?: string
  filename_disk?: string
  filename_download: string
  filesize?: number
  folder?: string | DirectusFolders
  height?: number
  id: string
  location?: string
  metadata?: unknown
  modified_by?: string | DirectusUsers
  modified_on: string
  storage: string
  tags?: string[]
  title?: string
  type?: string
  uploaded_by?: string | DirectusUsers
  uploaded_on: string
  width?: number
}

export interface DirectusFlows {
  accountability?: string
  color?: string
  date_created?: string
  description?: string
  icon?: string
  id: string
  name: string
  operation?: string | DirectusOperations
  operations?: DirectusOperations[]
  options?: unknown
  status: string
  trigger?: string
  user_created?: string | DirectusUsers
}

export interface DirectusFolders {
  id: string
  name: string
  parent?: string | DirectusFolders
}

export interface DirectusMigrations {
  name: string
  timestamp?: string
  version: string
}

export interface DirectusNotifications {
  collection?: string
  id: number
  item?: string
  message?: string
  recipient?: string | DirectusUsers
  sender?: string | DirectusUsers
  status?: string
  subject: string
  timestamp?: string
}

export interface DirectusOperations {
  date_created?: string
  flow?: string | DirectusFlows
  id: string
  key: string
  name?: string
  options?: unknown
  position_x: number
  position_y: number
  reject?: string | DirectusOperations
  resolve?: string | DirectusOperations
  type: string
  user_created?: string | DirectusUsers
}

export interface DirectusPanels {
  color?: string
  dashboard?: string | DirectusDashboards
  date_created?: string
  height: number
  icon?: string
  id: string
  name?: string
  note?: string
  options?: unknown
  position_x: number
  position_y: number
  show_header: boolean
  type: string
  user_created?: string | DirectusUsers
  width: number
}

export interface DirectusPermissions {
  action: string
  collection: string
  fields?: unknown
  id: number
  permissions?: unknown
  presets?: unknown
  role?: string | DirectusRoles
  validation?: unknown
}

export interface DirectusPresets {
  bookmark?: string
  collection?: string
  color?: string
  filter?: unknown
  icon?: string
  id: number
  layout?: string
  layout_options?: unknown
  layout_query?: unknown
  refresh_interval?: number
  role?: string | DirectusRoles
  search?: string
  user?: string | DirectusUsers
}

export interface DirectusRelations {
  id: number
  junction_field?: string
  many_collection: string
  many_field: string
  one_allowed_collections?: unknown
  one_collection?: string
  one_collection_field?: string
  one_deselect_action: string
  one_field?: string
  sort_field?: string
}

export interface DirectusRevisions {
  activity?: number | DirectusActivity
  collection: string
  data?: unknown
  delta?: unknown
  id: number
  item: string
  parent?: number | DirectusRevisions
}

export interface DirectusRoles {
  admin_access: boolean
  app_access: boolean
  description?: string
  enforce_tfa: boolean
  icon: string
  id: string
  ip_access?: unknown
  name: string
  users?: DirectusUsers[]
}

export interface DirectusSessions {
  expires: string
  ip?: string
  origin?: string
  share?: string | DirectusShares
  token: string
  user?: string | DirectusUsers
  user_agent?: string
}

export interface DirectusSettings {
  ai_pack_config: string
  auth_login_attempts?: number
  auth_password_policy?: string
  basemaps?: unknown
  custom_aspect_ratios?: unknown
  custom_css?: string
  default_language: string
  id: number
  mapbox_key?: string
  module_bar?: unknown
  Open_AI_API_Key?: string
  project_color?: string
  project_descriptor?: string
  project_logo?: string | DirectusFiles
  project_name: string
  project_url?: string
  public_background?: string | DirectusFiles
  public_foreground?: string | DirectusFiles
  public_note?: string
  Stability_AI_API_Key?: string
  storage_asset_presets?: unknown
  storage_asset_transform?: string
  storage_default_folder?: string | DirectusFolders
}

export interface DirectusShares {
  collection?: string | DirectusCollections
  date_created?: string
  date_end?: string
  date_start?: string
  id: string
  item?: string
  max_uses?: number
  name?: string
  password?: string
  role?: string | DirectusRoles
  times_used?: number
  user_created?: string | DirectusUsers
}

export interface DirectusTranslations {
  id: string
  key: string
  language: string
  value: string
}

export interface DirectusUsers {
  auth_data?: unknown
  avatar?: string | DirectusFiles
  description?: string
  email?: string
  email_notifications?: boolean
  external_identifier?: string
  first_name?: string
  id: string
  language?: string
  last_access?: string
  last_name?: string
  last_page?: string
  location?: string
  password?: string
  provider: string
  role?: string | DirectusRoles
  status: string
  tags?: unknown
  tfa_secret?: string
  theme?: string
  title?: string
  token?: string
}

export interface DirectusWebhooks {
  actions: unknown
  collections: unknown
  data: boolean
  headers?: unknown
  id: number
  method: string
  name: string
  status: string
  url: string
}

export interface Events {
  id: string
  key?: string
  metadata?: unknown
  service?: string
  session?: string
  timestamp?: string
  user?: string
}

// Update Forms interface
export interface Forms extends BaseCollection {
  on_success?: 'redirect' | 'message'
  redirect_url?: string
  tenant_id?: number
  event_id?: number
  site_id?: number
  submit_label?: string
  success_message?: string
  fields?: FormField[]
  translations?: FormTranslation[]
}

export interface FormField {
  id: string
  form_id?: string
  name: string
  type: 'input' | 'textarea' | 'select' | 'email' | 'number' | 'multiselect' | 'file' | 'image'
  width?: string
  validation?: string
  conditions?: any
  translations?: FormFieldTranslation[]
}

export interface FormTranslation extends BaseTranslation {
  submit_label?: string
  success_message?: string
}

export interface FormFieldTranslation extends BaseTranslation {
  label?: string
  placeholder?: string
  help?: string
  options?: any
}

export interface Globals extends BaseCollection {
  favicon?: DirectusFiles
  translations?: GlobalsTranslations[]
  url?: string
  umami_analytics_id?: string
  umami_script_url?: string
  google_analytics_id?: string
  baidu_analytics_id?: string
  site_id?: string
  theme?: {
    primary?: string
    gray?: string
    borderRadius?: string
    fonts?: {
      families?: {
        display?: string
        body?: string
        code?: string
      }
    }
  }
}

export interface GlobalsTranslations {
  languages_code: string
  address_country?: string
  address_locality?: string
  address_region?: string
  blog_setting?: BlogSettings
  build_hook_url?: string
  contact?: string
  deployment?: string
  email?: string
  globals_id?: string | Globals
  id: number
  og_image?: string | DirectusFiles
  phone?: string
  postal_code?: string
  project_setting?: ProjectsSettings
  routes?: unknown
  seo?: string
  setting?: string
  social?: string
  social_links?: SocialLink[]
  street_address?: string
  tagline?: string
  description?: string
  title?: string
  theme?: {
    primary?: string
    gray?: string
    borderRadius?: string
    fonts?: {
      families?: {
        display?: string
        body?: string
        code?: string
      }
    }
  }
}

export interface HelpArticles {
  date_created?: string
  date_updated?: string
  help_collection: HelpCollections
  id: string
  owner?: DirectusUsers
  slug?: string
  sort?: number
  status: string
  translations: HelpArticlesTranslations[]
  type?: 'group' | 'article'
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
}

export interface HelpArticlesTranslations {
  content?: string
  help_articles_id?: string | HelpArticles
  id: number
  languages_code?: string | Languages
  summary?: string
  title?: string
}

export interface HelpCollections {
  articles?: HelpArticles[]
  cover?: string | DirectusFiles
  id: string
  slug?: string
  sort?: number
  translations: HelpCollectionsTranslations[]
}

export type HelpCollectionsTranslations = {
  description?: string
  help_collections_id?: string | HelpCollections
  id: number
  languages_code?: string | Languages
  title?: string
}

export interface HelpFeedback {
  comments?: string
  date_created?: string
  date_updated?: string
  id: string
  rating?: number
  title?: string
  url?: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
  visitor_id?: string
}

export interface Inbox {
  data?: unknown
  date_created?: string
  date_updated?: string
  form?: string | Forms
  id: string
  sort?: number
  status: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
}

export interface Languages {
  code: string
  name?: string
  sort?: number
}

export interface Messages {
  conversation?: string | Conversations
  date_created?: string
  date_updated?: string
  id: string
  text?: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
  visitor_id?: string
}

export interface Metrics {
  id: string
  key?: string
  metadata?: unknown
  service?: string
  timestamp?: string
  value?: number
}

// Update Navigation interface
export interface Navigation extends BaseCollection {
  type: 'main' | 'footer'
  items: NavigationItem[]
}

export interface NavigationItem {
  id: string
  type: 'page' | 'url'
  url?: string | null
  page?: {
    id: string
    translations: {
      languages_code: string
      permalink: string
    }[]
  } | null
  translations: {
    languages_code: string
    title: string
  }[]
  href?: string
  sort?: number
  has_children?: boolean
  children?: NavigationItem[]
  icon?: string
  label?: string
  open_in_new_tab?: boolean
}

export interface NavigationItems {
  id: string
  type: 'page' | 'url'
  url?: string | null
  page?: {
    id: string
    slug?: string
    translations?: {
      languages_code: string
      permalink: string
    }[]
  } | null
  translations: {
    languages_code: string
    title: string
  }[]
  href?: string
  sort?: number
  has_children?: boolean
  children?: NavigationItems[]
  icon?: string
  label?: string
  open_in_new_tab?: boolean
  title?: string
}

export interface Pages {
  id: string
  status: 'published' | 'draft' | 'archived'
  site_id: string
  title?: string
  translations?: Array<{
    id: string
    languages_code: string
    title: string
    permalink: string
  }>
  blocks?: Array<{
    id: string
    collection: string
    item: any
    sort?: number
  }>
  seo?: Seo
}

export interface PagesTranslations {
  blocks?: PagesTranslationsBlocks[]
  id: number
  languages_code: string | Languages
  pages_id?: string | Pages
  title?: string
  permalink?: string
}

export interface PagesTranslationsBlocks {
  collection?: string
  id: number
  item?: string | any
  pages_translations_id?: number | PagesTranslations
  sort?: number
}

export interface Posts {
  author?: string | DirectusUsers
  category?: Categories
  date_created?: string
  date_published?: string
  date_updated?: string
  id: string
  image?: string | DirectusFiles
  seo?: Seo
  slug?: string
  sort?: number
  status: string
  translations?: PostsTranslations[]
  user_created?: string
  user_updated?: string
  site_id?: string
}

export interface PostsTranslations {
  content: string
  id: number
  languages_code?: string | Languages
  posts_id?: string | Posts
  summary?: string
  title?: string
}

export interface Projects {
  built_with?: string[]
  client?: string
  content?: string
  cost?: string
  date_created?: string
  date_updated?: string
  details: string
  gallery?: ProjectsFiles[]
  id: string
  image?: string | DirectusFiles
  seo?: Seo
  slug?: string
  sort?: number
  status: string
  summary?: string
  title?: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
}

export interface ProjectsFiles {
  directus_files_id?: string | DirectusFiles
  id: number
  project?: string | Projects
  sort?: number
}

export interface ProjectsSettings {
  headline?: string
  id: string
  seo?: Seo
  title?: string
}

export interface Redirects {
  date_created?: string
  date_updated?: string
  id: string
  response_code?: number
  url_new?: string
  url_old?: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
}

export interface Seo {
  canonical_url?: string
  id: string
  meta_description?: string
  no_follow?: boolean
  no_index?: boolean
  og_image?: string | DirectusFiles
  sitemap_change_frequency?: string
  sitemap_priority?: number
  title?: string
}

// Update Sites interface
export interface Sites extends BaseCollection {
  slug: string
  title?: string
  navigation?: string[]
  logo?: string | DirectusFiles
}

export interface Team {
  bio?: string
  date_created?: string
  date_updated?: string
  id: string
  image?: string | DirectusFiles
  job_title?: string
  name?: string
  social_media?: SocialLink[]
  sort?: number
  status: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
  role?: string
  translations?: Array<{
    bio?: string
    job_title?: string
    languages_code: string
  }>
}

export interface Testimonials {
  company?: string
  company_info?: string
  company_logo?: string | DirectusFiles
  content?: string
  date_created?: string
  date_updated?: string
  id: string
  image?: string | DirectusFiles
  link?: string
  sort?: number
  status: string
  subtitle?: string
  title?: string
  user_created?: string | DirectusUsers
  user_updated?: string | DirectusUsers
  translations?: Array<{
    title?: string
    subtitle?: string
    content?: string
    languages_code: string
  }>
}