import type { MenuBuilder, MenuItemConfig } from '@menu/index'
import { FileText, Layout, Layers } from 'lucide-vue-next'

/**
 * CMS Menu Builder
 * Builds the CMS management menu structure
 */
export class CmsMenuBuilder implements MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    if (menuName !== 'admin') {
      return menu
    }

    // Add CMS section to the menu
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
        }
      ]
    }

    // Add to menu children
    if (!menu.children) {
      menu.children = []
    }
    menu.children.push(cmsSection)

    // Sort children by order
    menu.children.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    return menu
  }
}

// Export singleton instance
export const cmsMenuBuilder = new CmsMenuBuilder()
