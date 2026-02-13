# CMS Menu Builder

A CMS menu builder a Vue CMS csomag menü kezelő rendszere, amely támogatja a dinamikus menüelem regisztrációt.

## Használat

### Alapvető használat

A menu builder automatikusan hozzáadja az alapértelmezett CMS menüpontokat az 'admin' menühöz:
- Oldalak
- Régiók

### Dinamikus menüelemek regisztrálása

A `CmsMenuBuilder` támogatja dinamikus menüelemek regisztrációját:

```typescript
import { cmsMenuBuilder } from '@cms/config/menuBuilder'
import { Blocks } from 'lucide-vue-next'

// Egyedi menüelem regisztrálása
cmsMenuBuilder.registerMenuItem('admin', {
  id: 'cms-templates',
  title: 'Sablonok',
  path: '/cms/templates',
  icon: Blocks,
  order: 30
})

// Több menüelem egyszerre
cmsMenuBuilder.registerMenuItems('admin', [
  {
    id: 'cms-widgets',
    title: 'Widgetek',
    path: '/cms/widgets',
    order: 40
  },
  {
    id: 'cms-blocks',
    title: 'Blokkok',
    path: '/cms/blocks',
    order: 50
  }
])
```

### API

#### `registerMenuItem(menuName: string, item: MenuItemConfig): void`
Egyetlen menüelemet regisztrál a megadott menühöz.

#### `registerMenuItems(menuName: string, items: MenuItemConfig[]): void`
Több menüelemet regisztrál egyszerre a megadott menühöz.

#### `getRegisteredMenuItems(menuName: string): MenuItemConfig[]`
Visszaadja az összes regisztrált menüelemet a megadott menühöz.

#### `clearRegisteredMenuItems(menuName?: string): void`
Törli a regisztrált menüelemeket. Ha a menuName meg van adva, csak azt a menüt törli, egyébként mindet.

## Példa

```typescript
import { createApp } from 'vue'
import { menuRegistry, cmsMenuBuilder } from '@cms/index'
import { Settings } from 'lucide-vue-next'

// CMS menu builder regisztrálása
menuRegistry.register(cmsMenuBuilder)

// Egyedi menüelemek hozzáadása
cmsMenuBuilder.registerMenuItem('admin', {
  id: 'cms-settings',
  title: 'CMS Beállítások',
  path: '/cms/settings',
  icon: Settings,
  order: 100
})

const app = createApp(App)
app.mount('#app')
```

