import type { RouteRecordRaw } from 'vue-router'

const cmsRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/cms/page',
    name: 'cms-pages',
    component: () => import('../views/page/PageIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page/create',
    name: 'cms-page-create',
    component: () => import('../views/page/PageCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page/:id/edit',
    name: 'cms-page-edit',
    component: () => import('../views/page/PageEdit.vue'),
    meta: { requiresAuth: true }
  },
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
  {
    path: '/admin/cms/author/create',
    name: 'cms-author-create',
    component: () => import('../views/author/AuthorCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/author/:id/edit',
    name: 'cms-author-edit',
    component: () => import('../views/author/AuthorEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-group',
    name: 'cms-page-groups',
    component: () => import('../views/page-group/PageGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-group/create',
    name: 'cms-page-group-create',
    component: () => import('../views/page-group/PageGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-group/:id',
    name: 'cms-page-group-show',
    component: () => import('../views/page-group/PageGroupShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/page-group/:id/edit',
    name: 'cms-page-group-edit',
    component: () => import('../views/page-group/PageGroupEdit.vue'),
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
