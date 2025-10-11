import { EventBus } from './EventBus'

/** 事件总线 */
export const eventBus = EventBus.create<
  ['HTTP_PLUGIN:unknownErrorCustomErrorHandler', 'HTTP_PLUGIN:limitCustomErrorHandler', 'HTTP_PLUGIN:duplicationCustomErrorHandler']
>({
  maxListeners: 10,
})
