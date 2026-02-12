import type { ICustomAxiosError } from '../IHttpUtils'
import type { IHttpUtilsPlugin } from '../IPlugin'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import { eventBus } from '@/eventBus'
/** 网络错误处理插件配置 */
export interface INetworkErrorPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  msg?: string
  /** 错误提示显示时长 */
  duration?: number
}

/** 网络错误处理插件事件 */
export interface INetworkErrorPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:Handler': [err: ICustomAxiosError]
  'HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError': [message: string, duration: number]
}

export const NETWORK_ERROR_PLUGIN = 'NETWORK_ERROR_PLUGIN'
/** 网络错误处理插件 */
export const NetworkErrorPlugin: IHttpUtilsPlugin = {
  name: NETWORK_ERROR_PLUGIN,
  priority: 3,
  config: { showError: true, msg: '网络错误', duration: 1500 },
  onResErr: (err, ctx) => {
    console.warn(NETWORK_ERROR_PLUGIN)
    if (!err.response) return Promise.reject(err)
    if (err.response.status < 500 || err.response.status === 429 || err.response.status === 400) return Promise.reject(err)
    const config: INetworkErrorPluginConfig = {
      ...ctx.getPlugin(NETWORK_ERROR_PLUGIN)!.config,
      ...(err.config?.customConfig.NetworkErrorPlugin as INetworkErrorPluginConfig),
    }
    eventBus.emit('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:Handler', [err])
    if (config.showError) eventBus.emit('HTTP_PLUGIN:NETWORK_ERROR_PLUGIN:ShowError', [`${config.msg!}:${err.response.data.msg}`, config.duration!])
    return Promise.reject(err)
  },
}
