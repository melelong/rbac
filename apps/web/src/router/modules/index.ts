import type { RouteRecordRaw } from 'vue-router'

/** 目录权限码和目录布局组件映射 */
export const DirMap: { [key: string]: RouteRecordRaw['component'] } = {
  HOME_DIR: () => import('@/layouts/DefaultLayout.vue'),
}

/** 页面权限码和页面映射 */
export const PageMap: { [key: string]: RouteRecordRaw['component'] } = {
  WORKSPACE: () => import('@/layouts/DefaultLayout.vue'),
}
