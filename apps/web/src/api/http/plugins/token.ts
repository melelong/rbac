import type { ICustomAxiosError } from '../IHttpUtils'
import type { IHttpUtilsPlugin } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import { eventBus } from '@/eventBus'
import { useAuth } from '@/store/modules/auth'

/** 令牌处理插件配置 */
export interface ITokenPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  msg?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 是否为刷新令牌接口 */
  isRefresh?: boolean
  /** 是否为登出接口 */
  isLogout?: boolean
}

/** 令牌处理插件事件 */
export interface ITokenPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:TOKEN_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:TOKEN_PLUGIN:ShowError': [message: string, duration: number]
}

export const TOKEN_PLUGIN = 'TOKEN_PLUGIN'

/** 是否正在刷新中 */
let refreshLock = false
/** 刷新等待队列 */
const refreshQueue: Array<() => void> = []
/** 令牌处理插件 */
export const TokenPlugin: IHttpUtilsPlugin = {
  name: TOKEN_PLUGIN,
  priority: 2,
  config: { showError: true, msg: '令牌已失效', duration: 1500, isRefresh: false, isLogout: false },
  onReq(config) {
    const auth = useAuth()
    const accessToken = auth.access
    config.headers!.Authorization = `Bearer ${accessToken}`
    return config
  },
  onResErr: async (err, ctx) => {
    const { logOut, refresh, refreshToken } = useAuth()
    console.warn(TOKEN_PLUGIN)
    if (err.response?.status !== 401) return Promise.reject(err)
    const config: ITokenPluginConfig = {
      ...ctx.getPlugin(TOKEN_PLUGIN)!.config,
      ...(err.config?.customConfig.TokenPlugin as ITokenPluginConfig),
    }
    if (config.isLogout) return Promise.reject(err)
    // 没有 refreshToken 或者是刷新接口本身 401 → 直接登出
    if (!refresh || config.isRefresh) {
      logOut({})
      eventBus.emit('HTTP_PLUGIN:TOKEN_PLUGIN:Handler', [err])
      eventBus.emit('HTTP_PLUGIN:TOKEN_PLUGIN:ShowError', [config.msg!, config.duration!])
      return Promise.reject(err)
    }
    // 正在刷新中，加入等待队列
    if (refreshLock) return new Promise((resolve) => refreshQueue.push(() => resolve(ctx.request(err.config!))))
    refreshLock = true
    try {
      await refreshToken({ refreshToken: refresh! })
      // 执行队列中的请求
      refreshQueue.forEach((cb) => cb())
      refreshQueue.length = 0
      // 重发当前请求
      return ctx.request(err.config!)
    } catch {
      // 刷新失败，清空队列并登出
      refreshQueue.length = 0
      logOut({})
      eventBus.emit('HTTP_PLUGIN:TOKEN_PLUGIN:Handler', [err])
      eventBus.emit('HTTP_PLUGIN:TOKEN_PLUGIN:ShowError', [config.msg!, config.duration!])
      return Promise.reject(err)
    } finally {
      refreshLock = false
    }
  },
}
