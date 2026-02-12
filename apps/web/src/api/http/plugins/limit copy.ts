// import type { CustomConfig } from '..'
// import type { CustomAxiosError, IHttpPlugin } from '../IHttp'
// import type { IEventBusEvents } from '@/eventBus/IEventBus'
// import { AxiosError } from 'axios'
// import { eventBus } from '@/eventBus'
// import { AxiosUtils } from '../AxiosUtils'
// /** 限流处理插件配置 */
// export interface ILimitPluginConfig {
//   /** 是否显示错误 */
//   showError?: boolean
//   /** 错误提示 */
//   message?: string
//   /** 错误提示显示时长 */
//   duration?: number
//   /** 限流时间 */
//   limitTime?: number
//   /** 限流类型(默认为Throttle) */
//   limitType?: 'Throttle' | 'Debounce'
// }
// /** 限流队列类型 */
// type TLimitQueue = Map<
//   string,
//   {
//     timer: number
//     lastTime: Date
//   }
// >
// /** 限流队列 */
// const limitQueue: TLimitQueue = new Map()
// /** 默认配置 */
// const defaultConfig: ILimitPluginConfig = {
//   showError: true,
//   message: '请求过于频繁，请稍后再试',
//   duration: 1500,
//   limitType: 'Throttle',
// }
// const pluginName = 'LimitPlugin'

// /** 限流处理插件事件 */
// export interface ILimitPluginEvents extends IEventBusEvents {
//   'HTTP_PLUGIN:LimitPlugin:handler': [error: CustomAxiosError]
//   'HTTP_PLUGIN:LimitPlugin:showError': [message: string, duration: number]
// }
// /** 限流处理插件配置 */
// export const LimitPlugin: IHttpPlugin = {
//   name: pluginName,
//   request: async (config) => {
//     const {
//       limitTime,
//       limitType = defaultConfig.limitType!,
//       message = defaultConfig.message!,
//     } = (config.customConfig as CustomConfig).LimitPlugin ?? {}
//     if (typeof limitTime !== 'number') return null
//     const requestId = AxiosUtils.generateRequestId(config)
//     const limitItem = limitQueue.get(requestId)
//     const now = new Date()
//     if (limitType === 'Debounce') {
//       clearTimeout(limitItem?.timer || 0)
//       limitQueue.set(requestId, {
//         lastTime: now,
//         timer: setTimeout(() => {
//           limitQueue.delete(requestId)
//         }, limitTime),
//       })
//     }
//     if (limitType === 'Throttle' && (!limitItem || +now - +limitItem!.lastTime! > limitTime!)) {
//       limitQueue.set(requestId, { lastTime: now, timer: 0 })
//     }
//     if (limitItem) {
//       if (limitItem.timer !== 0 || (limitItem.timer === 0 && +now - +limitItem!.lastTime < limitTime!)) throw new AxiosError(message, 'limit', config)
//     }
//     return config
//   },
//   responseError: async (error) => {
//     if (error.code !== 'limit') return null
//     const {
//       message = defaultConfig.message!,
//       showError = defaultConfig.showError!,
//       duration = defaultConfig.duration!,
//     } = (error?.config?.customConfig as CustomConfig).LimitPlugin ?? {}
//     const _message = message || error.message
//     if (showError) eventBus.emit('HTTP_PLUGIN:LimitPlugin:showError', [_message, duration])

//     eventBus.emit('HTTP_PLUGIN:LimitPlugin:handler', [error])

//     return Promise.reject(AxiosUtils.createPluginError(pluginName, _message))
//   },
// }
