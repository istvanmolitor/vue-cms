# Vue CMS Package

A teljes körű CMS (Content Management System) csomag Vue 3 alkalmazásokhoz.

## Funkciók

- 📄 **Oldalkezelés**: Komplett oldal CRUD műveletek
- 🔲 **Régió kezelés**: Tartalom régiók dinamikus kezelése
- 🔧 **Tartalom elemek**: Különböző tartalom típusok (szöveg, címsor, kép, videó, kód, idézet, lista)
- 🎨 **Menu Builder**: Dinamikus menü építő regisztrációs támogatással
- 🔌 **Moduláris**: Könnyen bővíthető új tartalom típusokkal

## Telepítés

A csomag már be van építve a frontend projektbe. Az `@cms` alias használható az importáláshoz.

```typescript
import { CmsMenuBuilder, cmsMenuBuilder } from '@cms/index'
```

## Használat

### Menu Builder Regisztráció

A CMS menu builder automatikusan regisztrálható a fő alkalmazásban:

```typescript
// main.ts
import { createApp } from 'vue'
import { menuRegistry } from '@menu/index'
import { CmsMenuBuilder } from '@cms/index'

// Menu builder regisztrálása
menuRegistry.register(new CmsMenuBuilder())

const app = createApp(App)
app.mount('#app')
```

### Egyedi Menüelemek Hozzáadása

A menu builder támogatja az egyedi menüelemek dinamikus regisztrációját:

```typescript
import { cmsMenuBuilder } from '@cms/index'
import { Settings } from 'lucide-vue-next'

// Egyetlen menüelem hozzáadása
cmsMenuBuilder.registerMenuItem('admin', {
  id: 'cms-settings',
  title: 'CMS Beállítások',
  path: '/cms/settings',
  icon: Settings,
  order: 100
})

// Több menüelem egyszerre
cmsMenuBuilder.registerMenuItems('admin', [
  {
    id: 'cms-templates',
    title: 'Sablonok',
    path: '/cms/templates',
    order: 30
  },
  {
    id: 'cms-widgets',
    title: 'Widgetek',
    path: '/cms/widgets',
    order: 40
  }
])
```

### Router Integráció

A CMS útvonalak könnyen hozzáadhatók a fő routerhez:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import cmsRoutes from '@cms/router/index'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...cmsRoutes,
    // ... más útvonalak
  ]
})
```

## Alapértelmezett Menüpontok

A CMS az alábbi alapértelmezett menüpontokat adja hozzá az `admin` menühöz:

- **Oldalak** (`/cms/pages`) - order: 10
- **Régiók** (`/cms/regions`) - order: 20

## API Referencia

### CmsMenuBuilder

#### Metódusok

##### `registerMenuItem(menuName: string, item: MenuItemConfig): void`
Egyetlen menüelem regisztrálása.

**Paraméterek:**
- `menuName`: A menü neve (pl. 'admin', 'profile')
- `item`: MenuItemConfig objektum

**Példa:**
```typescript
cmsMenuBuilder.registerMenuItem('admin', {
  id: 'my-item',
  title: 'Saját elem',
  path: '/my-path',
  order: 50
})
```

##### `registerMenuItems(menuName: string, items: MenuItemConfig[]): void`
Több menüelem regisztrálása egyszerre.

**Paraméterek:**
- `menuName`: A menü neve
- `items`: MenuItemConfig objektumok tömbje

##### `getRegisteredMenuItems(menuName: string): MenuItemConfig[]`
A regisztrált menüelemek lekérdezése.

**Visszatérési érték:** MenuItemConfig[] - A regisztrált elemek listája

##### `clearRegisteredMenuItems(menuName?: string): void`
Regisztrált menüelemek törlése.

**Paraméterek:**
- `menuName` (opcionális): Ha meg van adva, csak azt a menüt törli, egyébként mindent

## Útvonalak

A csomag az alábbi útvonalakat biztosítja:

- `/cms/pages` - Oldalak listája
- `/cms/pages/create` - Új oldal létrehozása
- `/cms/pages/:id/edit` - Oldal szerkesztése
- `/cms/regions` - Régiók listája
- `/cms/regions/create` - Új régió létrehozása
- `/cms/regions/:id/edit` - Régió szerkesztése

## Tartalom Elemek

A CMS támogatja az alábbi tartalom elem típusokat:

- **text** - Szöveg
- **heading** - Címsor
- **image** - Kép
- **video** - Videó
- **code** - Kód
- **quote** - Idézet
- **list** - Lista

## Példák

További példákért lásd az `examples/custom-menu-registration.ts` fájlt.

## Fejlesztés

### Új Tartalom Elem Típus Hozzáadása

```typescript
import { contentElementTypeRegistry } from '@cms/registry/ContentElementTypeRegistry'
import CustomEditor from './components/CustomEditor.vue'
import { Icon } from 'lucide-vue-next'

contentElementTypeRegistry.register({
  type: 'custom-type',
  label: 'Egyedi típus',
  component: CustomEditor,
  icon: Icon
})
```

## Függőségek

- Vue 3
- Vue Router
- lucide-vue-next (ikonok)
- @menu package (menü rendszer)

## License

MIT

