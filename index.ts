// Services
export { pageService } from './services/pageService'
export { authorService } from './services/authorService'
export { contentRegionService } from './services/contentRegionService'
export { pageGroupService } from './services/pageGroupService'
export { menuService } from './services/menuService'
export { menuItemService } from './services/menuItemService'

// Types
export type { Page, PageFormData, PagePayload, ContentElement, Content } from './services/pageService'
export type { Author, AuthorFormData } from './services/authorService'
export type { ContentRegion, ContentRegionFormData, ContentRegionPayload } from './services/contentRegionService'
export type { PageGroup, PageGroupFormData } from './services/pageGroupService'
export type { Menu, MenuFormData } from './services/menuService'
export type { MenuItem, MenuItemFormData } from './services/menuItemService'

// Components
export { default as EditContent } from './components/EditContent.vue'
export { default as MenuItemEditor } from './components/menu/MenuItemEditor.vue'

// Registry
export * from './registry/index'

// Router
export { default as cmsRoutes } from './router/index'

// Menu configuration
export { CmsMenuBuilder, cmsMenuBuilder } from './config/menuBuilder'
