import type { IErrorResponse } from '@packages/types'
import type { CustomConfig } from '..'
import type { CustomAxiosError, IHttpPlugin, IPluginError } from '../IAxiosUtils'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from '../AxiosUtils'

/** 网络错误处理插件配置 */
export interface INetworkErrorPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  message?: string
  /** 错误提示显示时长 */
  duration?: number
}
const defaultConfig: INetworkErrorPluginConfig = {
  showError: true,
  message: '网络错误',
  duration: 1500,
}

const pluginName = 'NetworkErrorPlugin'

/** 网络错误处理插件事件 */
export interface INetworkErrorPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:NetworkErrorPlugin:handler': [error: CustomAxiosError]
  'HTTP_PLUGIN:NetworkErrorPlugin:showError': [message: string, duration: number]
}

function handler(error: CustomAxiosError): Promise<IPluginError> | CustomAxiosError | null {
  // 不是网络错误
  if (!error.response) return error
  if (String((error.response?.data as IErrorResponse).code).length >= 4) return null
  const {
    showError = defaultConfig.showError!,
    message = defaultConfig.message!,
    duration = defaultConfig.duration!,
  } = (error?.config?.customConfig as CustomConfig).NetworkErrorPlugin ?? {}
  const _message = `${message !== '' ? `${message}:` : ''}${(error.response?.data as IErrorResponse)?.data}`
  if (showError) eventBus.emit('HTTP_PLUGIN:NetworkErrorPlugin:showError', [_message, duration])

  eventBus.emit('HTTP_PLUGIN:NetworkErrorPlugin:handler', [error])

  return Promise.resolve(AxiosUtils.createPluginError(pluginName, _message))
}

/** 网络错误处理插件 */
export const NetworkErrorPlugin: IHttpPlugin = {
  name: pluginName,
  requestError: async (error) => handler(error),
  responseError: async (error) => handler(error),
}
