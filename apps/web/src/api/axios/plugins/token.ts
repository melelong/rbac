import type { CancelTokenSource } from 'axios'
import type { CustomAxiosRequest, IHttpPlugin } from '../IAxiosUtils'

export interface ITokenPluginConfig {
  /** 是否携带token */
  withToken?: boolean
  /** 是否自动更新token */
  autoUpdateToken?: boolean
}
/** token队列元素类型 */
interface ITokenQueueItem {
  /** 请求配置 */
  config: CustomAxiosRequest
  /** 取消令牌资源(用于取消请求) */
  cancelTokenSource: CancelTokenSource
}
/** token队列类型 */
type TTokenQueue = Map<string, ITokenQueueItem>
/** token队列 */
export const tokenQueue: TTokenQueue = new Map()
const defaultConfig: ITokenPluginConfig = {
  withToken: true,
  autoUpdateToken: true,
}
const pluginName = 'TokenPlugin'
export const TokenPlugin: IHttpPlugin = {
  name: pluginName,
  request: async (config) => {
    const { withToken = defaultConfig.withToken } = config.customConfig as ITokenPluginConfig
    if (!withToken) return null
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
  },
  response: async (response) => {
    return response
  },
  responseError: async (error) => {
    return error
  },
}
