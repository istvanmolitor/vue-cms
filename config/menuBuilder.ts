import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { FileText, Layout, Layers } from 'lucide-vue-next'

/**
 * CMS Menu Builder
 * Builds the CMS management menu structure
 */
export class CmsMenuBuilder extends MenuBuilder {
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

    this.addMenuItem(menu, cmsSection)

    return menu
  }
}

// Export singleton instance
export const cmsMenuBuilder = new CmsMenuBuilder()
