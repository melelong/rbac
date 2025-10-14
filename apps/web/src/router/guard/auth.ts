import type { Router } from 'vue-router'
import { authApi } from '@/api'

function createAuthGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    console.warn(to.meta.type === 'static')
    if (to.meta.type === 'static') return next()
    try {
      const { data } = await authApi.getUserInfo()
      if (data) {
        return next()
      }
    } catch {
      return next({ name: 'Login' })
    }
  })
  // router.afterEach(() => {})
}
export { createAuthGuard }
