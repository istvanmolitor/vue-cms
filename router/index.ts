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
    path: '/admin/cms/post',
    name: 'cms-posts',
    component: () => import('../views/post/PostIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post/create',
    name: 'cms-post-create',
    component: () => import('../views/post/PostCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post/:id/edit',
    name: 'cms-post-edit',
    component: () => import('../views/post/PostEdit.vue'),
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
    path: '/admin/cms/post-group',
    name: 'cms-post-groups',
    component: () => import('../views/post-group/PostGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post-group/create',
    name: 'cms-post-group-create',
    component: () => import('../views/post-group/PostGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post-group/:id',
    name: 'cms-post-group-show',
    component: () => import('../views/post-group/PostGroupShow.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/cms/post-group/:id/edit',
    name: 'cms-post-group-edit',
    component: () => import('../views/post-group/PostGroupEdit.vue'),
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
