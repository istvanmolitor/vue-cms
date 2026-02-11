import type { RouteRecordRaw } from 'vue-router'

const cmsRoutes: RouteRecordRaw[] = [
  {
    path: '/cms/pages',
    name: 'cms-pages',
    component: () => import('../views/page/PageIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/pages/create',
    name: 'cms-page-create',
    component: () => import('../views/page/PageCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/pages/:id/edit',
    name: 'cms-page-edit',
    component: () => import('../views/page/PageEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/regions',
    name: 'cms-regions',
    component: () => import('../views/content-region/ContentRegionIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/regions/create',
    name: 'cms-region-create',
    component: () => import('../views/content-region/ContentRegionCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/regions/:id/edit',
    name: 'cms-region-edit',
    component: () => import('../views/content-region/ContentRegionEdit.vue'),
    meta: { requiresAuth: true }
  },
]

export default cmsRoutes
