import type { CustomAxiosError, IHttpPlugin, IPluginError } from '../IAxiosUtils'
import { eventBus } from '@/eventBus'
import { AxiosUtils } from '../AxiosUtils'
/** 未知错误处理插件配置 */
export interface IUnknownErrorPluginConfig {
  /** 是否显示错误 */
  showUnknownError?: boolean
  /** 未知错误提示 */
  unknownErrorMessage?: string
}
const defaultConfig: IUnknownErrorPluginConfig = {
  showUnknownError: true,
  unknownErrorMessage: '未知错误',
}
const pluginName = 'UnknownErrorPlugin'
function handler(error: CustomAxiosError): Promise<IPluginError> {
  const { showUnknownError = defaultConfig.showUnknownError, unknownErrorMessage = defaultConfig.unknownErrorMessage } = error?.config
    ?.customConfig as IUnknownErrorPluginConfig
  const message = `${unknownErrorMessage}:${error.message}`
  if (showUnknownError) ElMessage({ message, type: 'error', duration: 1000 })

  eventBus.emit('HTTP_PLUGIN:unknownErrorCustomErrorHandler', [error])

  return Promise.resolve(AxiosUtils.createPluginError(pluginName, message))
}
/** 未知错误处理插件 */
export const UnknownErrorPlugin: IHttpPlugin = {
  name: pluginName,
  requestError: async (error) => handler(error),
  responseError: async (error) => handler(error),
}
