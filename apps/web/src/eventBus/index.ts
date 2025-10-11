import type { IDuplicationPluginEvents, ILimitPluginEvents, IUnknownErrorPluginEvents } from '@/api/axios/plugins'
import { EventBus } from './EventBus'

/** http插件事件 */
type IHttpPluginEvents = IUnknownErrorPluginEvents & ILimitPluginEvents & IDuplicationPluginEvents

/** 事件总线事件 */
type IEventBusEvents = IHttpPluginEvents

/** 事件总线 */
export const eventBus = EventBus.create<IEventBusEvents>({ maxListeners: 10 })
