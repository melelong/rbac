import type { CancelTokenSource } from 'axios'
import type { IHttpPlugin } from '../IAxiosUtils'
import axios from 'axios'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from '../AxiosUtils'
/** 重复请求插件配置 */
export interface IDuplicationPluginConfig {
  /** 是否显示错误 */
  showDuplicationError?: boolean
  /** 是否允许重复请求 */
  allowDuplication?: boolean
  /** 重复请求提示 */
  duplicationMessage?: string
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
  showDuplicationError: true,
  allowDuplication: false,
}
const pluginName = 'DuplicationPlugin'
/** 重复请求插件 */
export const DuplicationPlugin: IHttpPlugin = {
  name: pluginName,
  request: async (config) => {
    const { allowDuplication = defaultConfig.allowDuplication, duplicationMessage = defaultConfig.duplicationMessage } =
      config.customConfig as IDuplicationPluginConfig
    if (allowDuplication) return null
    const requestId = config.requestId!
    const cancelTokenSource = config.cancelTokenSource!
    const requestQueueItem = duplicationQueue.get(requestId)
    if (requestQueueItem) requestQueueItem?.cancelTokenSource.cancel(duplicationMessage ?? `取消上次请求:${requestId}`, config)

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
    const { duplicationMessage = defaultConfig.duplicationMessage, showDuplicationError = defaultConfig.showDuplicationError } = error.config
      ?.customConfig as IDuplicationPluginConfig
    const requestId = error!.config!.requestId!
    const message = duplicationMessage ?? `取消上次请求:${requestId}`
    if (showDuplicationError) ElMessage({ message, type: 'error', duration: 1000 })

    eventBus.emit('HTTP_PLUGIN:duplicationCustomErrorHandler', [error])

    return Promise.reject(AxiosUtils.createPluginError(pluginName, message))
  },
}
