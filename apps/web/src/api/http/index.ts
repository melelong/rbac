import type {
  // IBusinessErrorPluginConfig,
  // IDuplicationPluginConfig,
  // ILimitPluginConfig,
  INetworkErrorPluginConfig,
  ITokenPluginConfig,
  // IUnknownErrorPluginConfig,
} from './plugins'
import { eventBus } from '@/eventBus'
import { HttpUtils } from './HttpUtils'
import { NetworkErrorPlugin, TokenPlugin } from './plugins'
// import { BusinessErrorPlugin, DuplicationPlugin, LimitPlugin, NetworkErrorPlugin, UnknownErrorPlugin } from './plugins'

export interface CustomConfig {
  /** 限流处理插件配置 */
  // LimitPlugin?: ILimitPluginConfig
  /** 重复请求处理插件配置 */
  // DuplicationPlugin?: IDuplicationPluginConfig
  /** 网络错误处理插件配置 */
  NetworkErrorPlugin?: INetworkErrorPluginConfig
  /** 令牌处理插件配置 */
  TokenPlugin?: ITokenPluginConfig
  /** 业务错误处理插件配置 */
  // BusinessErrorPlugin?: IBusinessErrorPluginConfig
  /** 未知错误处理插件配置 */
  // UnknownErrorPlugin?: IUnknownErrorPluginConfig
}
export const request = new HttpUtils<CustomConfig>()
request.plugins = [
  NetworkErrorPlugin,
  TokenPlugin,
  {
    name: '插件1',
    priority: 2,
    onRes: async (res) => {
      console.warn('插件1')
      return res
    },
  },
]

// // 注册插件事件
eventBus.on('HTTP_PLUGIN:TOKEN_PLUGIN:ShowError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
eventBus.on('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
// eventBus.on('HTTP_PLUGIN:LimitPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
// eventBus.on('HTTP_PLUGIN:DuplicationPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
// eventBus.on('HTTP_PLUGIN:BusinessErrorPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'warning', duration }))
// eventBus.on('HTTP_PLUGIN:NetworkErrorPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
// eventBus.on('HTTP_PLUGIN:UnknownErrorPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
