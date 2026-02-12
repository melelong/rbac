import type { Router } from 'vue-router'
// import { authApi } from '@/api'

function createAuthGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    console.warn(to)
    console.warn(to.meta.type === 'static')
    // if (to.meta.type === 'static' && from.meta.type === 'static') return next()
    // try {
    //   const { data } = await authApi.getUserInfo()
    //   if (typeof data !== 'string' || to.meta.type !== 'static') return next()
    //   return false
    // } catch {
    //   return next({ name: 'Login' })
    // }
    return next()
  })
  // router.afterEach(() => {})
}
export { createAuthGuard }
