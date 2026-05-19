// Services
export { pageService } from './services/pageService'
export { postService } from './services/postService'
export { authorService } from './services/authorService'
export { contentRegionService } from './services/contentRegionService'
export { postGroupService } from './services/postGroupService'
export { menuService } from './services/menuService'
export { menuItemService } from './services/menuItemService'

// Types
export type { Page, PageFormData, PagePayload, ContentElement, Content } from './services/pageService'
export type { Post, PostFormData, PostPayload } from './services/postService'
export type { Author, AuthorFormData } from './services/authorService'
export type { ContentRegion, ContentRegionFormData, ContentRegionPayload } from './services/contentRegionService'
export type { PostGroup, PostGroupFormData } from './services/postGroupService'
export type { Menu, MenuFormData } from './services/menuService'
export type { MenuItem, MenuItemFormData } from './services/menuItemService'

// Components
export { default as EditContent } from './components/EditContent.vue'
export { default as MenuItemEditor } from './components/menu/MenuItemEditor.vue'
export { default as PostSelector } from './components/PostSelector.vue'

// Registry
export * from './registry/index'

// Router
export { default as cmsRoutes } from './router/index'

// Menu configuration
export { CmsMenuBuilder, cmsMenuBuilder } from './config/menuBuilder'
