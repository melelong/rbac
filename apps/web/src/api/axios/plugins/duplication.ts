import type { CancelTokenSource } from 'axios'
import type { CustomConfig } from '..'
import type { CustomAxiosError, IHttpPlugin } from '../IAxiosUtils'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import axios from 'axios'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from '../AxiosUtils'
/** 重复请求处理插件配置 */
export interface IDuplicationPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  message?: string
  /** 错误提示显示时长 */
  duration?: number
  /** 是否允许重复请求 */
  allowDuplication?: boolean
}
/** 重复请求队列元素类型 */
interface IDuplicationQueueItem {
  /** 取消令牌资源(用于取消请求) */
  cancelTokenSource: CancelTokenSource
}
/** 重复请求队列类型 */
type TDuplicationQueue = Map<string, IDuplicationQueueItem>
/** 重复请求队列 */
export const duplicationQueue: TDuplicationQueue = new Map()
/** 默认配置 */
const defaultConfig: IDuplicationPluginConfig = {
  showError: true,
  message: '取消上次请求',
  duration: 1000,
  allowDuplication: false,
}
const pluginName = 'DuplicationPlugin'
/** 重复请求处理插件事件 */
export interface IDuplicationPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:DuplicationPlugin:handler': [error: CustomAxiosError]
  'HTTP_PLUGIN:DuplicationPlugin:showError': [message: string, duration: number]
}
/** 重复请求处理插件 */
export const DuplicationPlugin: IHttpPlugin = {
  name: pluginName,
  request: async (config) => {
    const { allowDuplication = defaultConfig.allowDuplication!, message = defaultConfig.message! } =
      (config.customConfig as CustomConfig).DuplicationPlugin ?? {}
    if (allowDuplication) return null
    const requestId = config.requestId!
    const cancelTokenSource = config.cancelTokenSource!
    const requestQueueItem = duplicationQueue.get(requestId)
    if (requestQueueItem) requestQueueItem?.cancelTokenSource.cancel(message ?? `取消上次请求:${requestId}`, config)

    duplicationQueue.set(requestId, { cancelTokenSource })
    return config
  },
  response: async (response) => {
    const requestId = response.config?.requestId
    // 即使允许重复请求，也要清理队列以防止内存泄漏
    if (requestId) duplicationQueue.delete(requestId)
    return response
  },
  responseError: async (error) => {
    if (!axios.isCancel(error)) return null
    const {
      message = defaultConfig.message!,
      showError = defaultConfig.showError!,
      duration = defaultConfig.duration!,
    } = (error.config?.customConfig as CustomConfig).DuplicationPlugin ?? {}
    const requestId = error!.config!.requestId!
    const _message = message ?? `取消上次请求:${requestId}`
    if (showError) eventBus.emit('HTTP_PLUGIN:DuplicationPlugin:showError', [_message, duration])

    eventBus.emit('HTTP_PLUGIN:DuplicationPlugin:handler', [error])

    return Promise.reject(AxiosUtils.createPluginError(pluginName, _message))
  },
}
