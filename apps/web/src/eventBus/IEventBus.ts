export interface IEventBus<T extends string[]> {
  /**
   * 监听事件
   * @param eventName 事件名
   * @param fn 事件函数
   */
  on: (eventName: T[number], fn: (...args: Array<any>) => any) => void
  /**
   * 触发事件
   * @param eventName 事件名
   * @param args 参数
   */
  emit: (eventName: T[number], args?: Array<any>) => void
  /**
   * 监听一次事件
   * @param eventName 事件名
   * @param fn 事件函数
   */
  once: (eventName: T[number], fn: (...args: Array<any>) => any) => void
  /**
   * 取消监听事件
   * @param eventName 事件名
   * @param fn 事件函数
   */
  off: (eventName: T[number], fn: (...args: Array<any>) => any) => void
}
/** 事件总线配置项 */
export interface IEventBusOptions {
  /** 最大监听数 */
  maxListeners: number
}
/** 事件总线事件元素类型 */
export interface IEventMap {
  [key: string]: Array<{
    /** 事件回调 */
    fn: (...args: Array<any>) => any
    /** 监听次数(null为无限监听) */
    num: number | null
  }>
}
