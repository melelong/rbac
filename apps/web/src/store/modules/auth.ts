import type { IEmailLoginDTO, IRefreshTokenDTO, ISvgLoginDTO, IUserDetailsVO } from '@packages/types'
import { emailLogin, getMeInfo, logOut, refreshToken, svgLogin } from '@/api/auth'
import { goTo } from '@/router'

export const REFRESH_KEY = 'REFRESH'
export interface IAuthState {
  /** 用户信息 */
  _useInfo: IUserDetailsVO | null
  /** 访问令牌 */
  _access: string | null
  /** 刷新令牌 */
  _refresh: string | null
  /** 角色编码 */
  _roles: string[]
  /** 菜单编码(页面，按钮等) */
  _menus: string[]
}

export const useAuth = defineStore('AUTH', {
  state: (): IAuthState => ({
    _useInfo: null,
    _access: null,
    _refresh: null,
    _roles: [],
    _menus: [],
  }),
  getters: {
    useInfo: (state) => state._useInfo,
    access: (state) => state._access,
    refresh: (state) => {
      if (state._refresh) return state._refresh
      const refresh = localStorage.getItem(REFRESH_KEY)
      state._refresh = refresh
      return refresh
    },
    roles: (state) => state._roles,
    menus: (state) => state._menus,
  },
  actions: {
    setAccess(access: string) {
      this._access = access
    },
    setRefresh(refresh: string) {
      this._refresh = refresh
      localStorage.setItem(REFRESH_KEY, refresh)
    },
    /** 获取当前登录用户信息 */
    async getMeInfo() {
      const res = await getMeInfo()
      console.warn(res)
    },
    /** 统一刷新令牌 */
    async refreshToken(DTO: IRefreshTokenDTO) {
      const {
        data: { accessToken: newAccess, refreshToken: newRefresh },
      } = await refreshToken(DTO)
      this.setAccess(newAccess)
      if (newRefresh) this.setRefresh(newRefresh)
    },
    /** 统一登录 */
    async login(type: 'svg' | 'email', DTO: ISvgLoginDTO | IEmailLoginDTO) {
      switch (type) {
        case 'svg':
          return await svgLogin(DTO as ISvgLoginDTO)
        case 'email':
          return await emailLogin(DTO as IEmailLoginDTO)
      }
    },
    /** 统一登出 */
    async logOut(DTO: IRefreshTokenDTO) {
      try {
        await logOut(DTO)
      } catch {
        // 忽略错误
      }
      this.$reset()
      localStorage.removeItem(REFRESH_KEY)
      ElMessage({ message: '登出成功', type: 'success', duration: 1000 })
      goTo('Login')
    },
  },
})
