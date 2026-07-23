import type { RouteRecordRaw } from 'vue-router'

const cmsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/cms/page',
    name: 'cms-pages',
    component: () => import('../views/page/PageIndex.vue'),
    meta: { requiresAuth: true }
  },
  // cms-page-create / cms-page-edit temporarily disabled: PageCreate/PageEdit
  // import LayoutSelect from '@theme', which has no package under resources/js/packages yet.
  {
    path: '/admin/cms/post',
    name: 'cms-posts',
    component: () => import('../views/post/PostIndex.vue'),
    meta: { requiresAuth: true }
  },
  // cms-post-create / cms-post-edit temporarily disabled: same '@theme' dependency as above.
  {
    path: '/admin/cms/region',
    name: 'cms-regions',
    component: () => import('../views/content-region/ContentRegionIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/region/create',
    name: 'cms-region-create',
    component: () => import('../views/content-region/ContentRegionCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/region/:id/edit',
    name: 'cms-region-edit',
    component: () => import('../views/content-region/ContentRegionEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/author',
    name: 'cms-authors',
    component: () => import('../views/author/AuthorIndex.vue'),
    meta: { requiresAuth: true }
  },
  // cms-author-create / cms-author-edit temporarily disabled: same '@theme' dependency as above.
  {
    path: '/admin/cms/post-group',
    name: 'cms-post-groups',
    component: () => import('../views/post-group/PostGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  // cms-post-group-create / cms-post-group-edit temporarily disabled: same '@theme' dependency as above.
  {
    path: '/admin/cms/post-group/:id',
    name: 'cms-post-group-show',
    component: () => import('../views/post-group/PostGroupShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post-type',
    name: 'cms-post-types',
    component: () => import('../views/post-type/PostTypeIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post-type/create',
    name: 'cms-post-type-create',
    component: () => import('../views/post-type/PostTypeCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post-type/:id/edit',
    name: 'cms-post-type-edit',
    component: () => import('../views/post-type/PostTypeEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-type',
    name: 'cms-page-types',
    component: () => import('../views/page-type/PageTypeIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-type/create',
    name: 'cms-page-type-create',
    component: () => import('../views/page-type/PageTypeCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-type/:id/edit',
    name: 'cms-page-type-edit',
    component: () => import('../views/page-type/PageTypeEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/menu',
    name: 'cms-menus',
    component: () => import('../views/menu/MenuIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/menu/create',
    name: 'cms-menu-create',
    component: () => import('../views/menu/MenuCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/menu/:id/edit',
    name: 'cms-menu-edit',
    component: () => import('../views/menu/MenuEdit.vue'),
    meta: { requiresAuth: true }
  },
]

export default cmsRoutes
