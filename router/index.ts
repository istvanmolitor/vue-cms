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
  {
    path: '/cms/authors',
    name: 'cms-authors',
    component: () => import('../views/author/AuthorIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/authors/create',
    name: 'cms-author-create',
    component: () => import('../views/author/AuthorCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/authors/:id/edit',
    name: 'cms-author-edit',
    component: () => import('../views/author/AuthorEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/page-groups',
    name: 'cms-page-groups',
    component: () => import('../views/page-group/PageGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/page-groups/create',
    name: 'cms-page-group-create',
    component: () => import('../views/page-group/PageGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/page-groups/:id',
    name: 'cms-page-group-show',
    component: () => import('../views/page-group/PageGroupShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/cms/page-groups/:id/edit',
    name: 'cms-page-group-edit',
    component: () => import('../views/page-group/PageGroupEdit.vue'),
    meta: { requiresAuth: true }
  },
]

export default cmsRoutes
