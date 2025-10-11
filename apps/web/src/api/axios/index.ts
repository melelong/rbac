import type {
  IBusinessErrorPluginConfig,
  IDuplicationPluginConfig,
  ILimitPluginConfig,
  INetworkErrorPluginConfig,
  IUnknownErrorPluginConfig,
} from './plugins'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from './AxiosUtils'
import { BusinessErrorPlugin, DuplicationPlugin, NetworkErrorPlugin, UnknownErrorPlugin } from './plugins'

export interface CustomConfig {
  /** 限流处理插件配置 */
  LimitPlugin?: ILimitPluginConfig
  /** 重复请求处理插件配置 */
  DuplicationPlugin?: IDuplicationPluginConfig
  /** 业务错误处理插件配置 */
  BusinessErrorPlugin?: IBusinessErrorPluginConfig
  /** 网络错误处理插件配置 */
  NetworkErrorPlugin?: INetworkErrorPluginConfig
  /** 未知错误处理插件配置 */
  UnknownErrorPlugin?: IUnknownErrorPluginConfig
}
export const request = new AxiosUtils<CustomConfig>()

request.install(
  [DuplicationPlugin, BusinessErrorPlugin, NetworkErrorPlugin, UnknownErrorPlugin],
  [DuplicationPlugin, BusinessErrorPlugin, NetworkErrorPlugin, UnknownErrorPlugin],
)

// 注册插件的错误提示事件
eventBus.on('HTTP_PLUGIN:LimitPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
eventBus.on('HTTP_PLUGIN:DuplicationPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
eventBus.on('HTTP_PLUGIN:BusinessErrorPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'warning', duration }))
eventBus.on('HTTP_PLUGIN:NetworkErrorPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
eventBus.on('HTTP_PLUGIN:UnknownErrorPlugin:showError', (message: string, duration: number) => ElMessage({ message, type: 'error', duration }))
