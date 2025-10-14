import type { RouteRecordRaw } from 'vue-router'

export const homeRoutes: RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    alias: ['/home'],
    component: () => import('@/layouts/DefaultLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: 'views.Dashboard.title',
        },
      },
      {
        name: 'Workspace',
        path: 'workspace',
        component: () => import('@/views/Workspace/index.vue'),
        meta: {
          title: 'views.Workspace.title',
        },
      },

      {
        name: 'ColorPalette',
        path: 'color-palette',
        component: () => import('@/views/ColorPalette/index.vue'),
        meta: {
          title: 'views.ColorPalette.title',
        },
      },
      {
        name: 'Test',
        path: 'test',
        component: () => import('@/views/Test/index.vue'),
        meta: {
          title: 'views.Test.title',
        },
      },
    ],
  },
]
