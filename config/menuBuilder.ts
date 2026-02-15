import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { FileText, Layout, Layers, User } from 'lucide-vue-next'

/**
 * CMS Menu Builder
 * Builds the CMS management menu structure with support for dynamic registration
 */
export class CmsMenuBuilder extends MenuBuilder {
  private registeredMenuItems: Map<string, MenuItemConfig[]> = new Map()

  /**
   * Register a menu item to be added to a specific menu
   * @param menuName - Name of the menu (e.g., 'admin', 'profile')
   * @param item - Menu item configuration to register
   */
  registerMenuItem(menuName: string, item: MenuItemConfig): void {
    if (!this.registeredMenuItems.has(menuName)) {
      this.registeredMenuItems.set(menuName, [])
    }
    this.registeredMenuItems.get(menuName)!.push(item)
  }

  /**
   * Register multiple menu items at once
   * @param menuName - Name of the menu
   * @param items - Array of menu items to register
   */
  registerMenuItems(menuName: string, items: MenuItemConfig[]): void {
    items.forEach(item => this.registerMenuItem(menuName, item))
  }

  /**
   * Get all registered menu items for a specific menu
   * @param menuName - Name of the menu
   * @returns Array of registered menu items
   */
  getRegisteredMenuItems(menuName: string): MenuItemConfig[] {
    return this.registeredMenuItems.get(menuName) || []
  }

  /**
   * Clear all registered menu items for a specific menu or all menus
   * @param menuName - Optional menu name. If not provided, clears all menus
   */
  clearRegisteredMenuItems(menuName?: string): void {
    if (menuName) {
      this.registeredMenuItems.delete(menuName)
    } else {
      this.registeredMenuItems.clear()
    }
  }

  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName !== 'admin') {
      return menu
    }

    // Add default CMS section to the menu
    const cmsSection: MenuItemConfig = {
      id: 'cms-management',
      title: 'CMS',
      icon: Layout,
      order: 30,
      children: [
        {
          id: 'cms-pages',
          title: 'Oldalak',
          path: '/cms/pages',
          icon: FileText,
          order: 10
        },
        {
          id: 'cms-regions',
          title: 'Régiók',
          path: '/cms/regions',
          icon: Layers,
          order: 20
        },
        {
          id: 'cms-authors',
          title: 'Szerzők',
          path: '/cms/authors',
          icon: User,
          order: 30
        }
      ]
    }

    // Add any dynamically registered items to the CMS section
    const registeredItems = this.getRegisteredMenuItems(menuName)
    if (registeredItems.length > 0) {
      cmsSection.children = [...(cmsSection.children || []), ...registeredItems]
    }

    this.addMenuItem(menu, cmsSection)

    return menu
  }
}

// Export singleton instance
export const cmsMenuBuilder = new CmsMenuBuilder()
