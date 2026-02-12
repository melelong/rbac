import type { INetworkErrorPluginEvents, ITokenPluginEvents } from '@/api/http/plugins'
import { EventBus } from './EventBus'

/** http插件事件 */
type IHttpPluginEvents = INetworkErrorPluginEvents & ITokenPluginEvents

/** 事件总线事件 */
type IEventBusEvents = IHttpPluginEvents

/** 事件总线 */
export const eventBus = EventBus.create<IEventBusEvents>({ maxListeners: 50 })
