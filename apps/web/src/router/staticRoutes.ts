import type { RouteRecordRaw } from 'vue-router'
import { homeRoutes } from './modules/Home'
import { loginRoutes } from './modules/Login'

export const staticRoutes: RouteRecordRaw[] = [
  ...loginRoutes,
  ...homeRoutes,
  {
    name: 'NotFound',
    path: '/:path(.*)*',
    component: () => import('@/views/Error/NotFound/index.vue'),
    meta: {
      title: 'views.Error.NotFound.title',
      type: 'static',
    },
  },
]
