import type { CustomConfig } from '..'
import type { CustomAxiosError, IHttpPlugin, IPluginError } from '../IAxiosUtils'
import type { IEventBusEvents } from '@/eventBus/IEventBus'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from '../AxiosUtils'
/** 未知错误处理插件配置 */
export interface IUnknownErrorPluginConfig {
  /** 是否显示错误 */
  showError?: boolean
  /** 错误提示 */
  message?: string
  /** 错误提示显示时长 */
  duration?: number
}
const defaultConfig: IUnknownErrorPluginConfig = {
  showError: true,
  message: '未知错误',
  duration: 1500,
}
const pluginName = 'UnknownErrorPlugin'

/** 未知错误处理插件事件 */
export interface IUnknownErrorPluginEvents extends IEventBusEvents {
  'HTTP_PLUGIN:UnknownErrorPlugin:handler': [error: CustomAxiosError]
  'HTTP_PLUGIN:UnknownErrorPlugin:showError': [message: string, duration: number]
}

function handler(error: CustomAxiosError): Promise<IPluginError> | CustomAxiosError | null {
  if (!error.response) return error
  const {
    showError = defaultConfig.showError!,
    message = defaultConfig.message!,
    duration = defaultConfig.duration!,
  } = (error?.config?.customConfig as CustomConfig)?.UnknownErrorPlugin ?? {}
  const _message = `${message !== '' ? `${message}:` : ''}${error.message}`
  if (showError) eventBus.emit('HTTP_PLUGIN:UnknownErrorPlugin:showError', [_message, duration])

  eventBus.emit('HTTP_PLUGIN:UnknownErrorPlugin:handler', [error])

  return Promise.resolve(AxiosUtils.createPluginError(pluginName, _message))
}

/** 未知错误处理插件 */
export const UnknownErrorPlugin: IHttpPlugin = {
  name: pluginName,
  requestError: async (error) => handler(error),
  responseError: async (error) => handler(error),
}
