import type { CustomConfig } from '..'
import type { IHttpPlugin } from '../IAxiosUtils'
import { AxiosError } from 'axios'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from '../AxiosUtils'
/** 限制插件配置 */
export interface ILimitPluginConfig {
  /** 是否显示错误 */
  showLimitError?: boolean
  /** 限制时间 */
  limitTime?: number
  /** 限制类型(默认为Throttle) */
  limitType?: 'Throttle' | 'Debounce'
  /** 限制错误提示 */
  limitMessage?: string
}
/** 限制队列类型 */
type TLimitQueue = Map<
  string,
  {
    timer: number
    lastTime: Date
  }
>
/** 限制队列 */
const limitQueue: TLimitQueue = new Map()
/** 默认配置 */
const defaultConfig: ILimitPluginConfig = {
  showLimitError: true,
  limitType: 'Throttle',
  limitMessage: '请求过于频繁，请稍后再试',
}
const pluginName = 'LimitPlugin'
/** 限流插件 */
export const LimitPlugin: IHttpPlugin = {
  name: pluginName,
  request: async (config) => {
    const { limitTime, limitType = defaultConfig.limitType, limitMessage = defaultConfig.limitMessage } = config.customConfig as CustomConfig
    if (typeof limitTime !== 'number') return null
    const requestId = AxiosUtils.generateRequestId(config)
    const limitItem = limitQueue.get(requestId)
    const now = new Date()
    if (limitType === 'Debounce') {
      clearTimeout(limitItem?.timer || 0)
      limitQueue.set(requestId, {
        lastTime: now,
        timer: setTimeout(() => {
          limitQueue.delete(requestId)
        }, limitTime),
      })
    }
    if (limitType === 'Throttle' && (!limitItem || +now - +limitItem!.lastTime! > limitTime!)) {
      limitQueue.set(requestId, { lastTime: now, timer: 0 })
    }
    if (limitItem) {
      if (limitItem.timer !== 0 || (limitItem.timer === 0 && +now - +limitItem!.lastTime < limitTime!))
        throw new AxiosError(limitMessage, 'limit', config)
    }
    return config
  },
  responseError: async (error) => {
    if (error.code !== 'limit') return null
    const { limitMessage = defaultConfig.limitMessage, showLimitError = defaultConfig.showLimitError } = error?.config
      ?.customConfig as ILimitPluginConfig
    const message = limitMessage || error.message
    if (showLimitError) ElMessage({ message, type: 'error', duration: 1000 })

    eventBus.emit('HTTP_PLUGIN:limitCustomErrorHandler', [error])

    return Promise.reject(AxiosUtils.createPluginError(pluginName, message))
  },
}
