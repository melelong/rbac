/** 事件总线事件定义接口 */
export interface IEventBusEvents {
  /** 事件名:事件函数参数数组 */
  [key: string]: any[]
}
export interface IEventBus<T extends IEventBusEvents> {
  /**
   * 监听事件
   * @param eventName 事件名
   * @param fn 事件函数
   */
  on: <K extends keyof T>(eventName: K, fn: (...args: T[K]) => any) => void
  /**
   * 触发事件
   * @param eventName 事件名
   * @param args 参数
   */
  emit: <K extends keyof T>(eventName: K, args?: T[K]) => void
  /**
   * 监听一次事件
   * @param eventName 事件名
   * @param fn 事件函数
   */
  once: <K extends keyof T>(eventName: K, fn: (...args: T[K]) => any) => void
  /**
   * 取消监听事件
   * @param eventName 事件名
   * @param fn 事件函数
   */
  off: <K extends keyof T>(eventName: K, fn: (...args: T[K]) => any) => void
  /**
   * 移除监听事件
   * @param eventName 事件名(不传移除全部)
   */
  removeListeners: <K extends keyof T>(eventName?: K) => void
}
/** 事件总线配置项 */
export interface IEventBusOptions {
  /** 最大监听数 */
  maxListeners: number
}
/** 事件总线事件元素类型 */
export interface IEventMapItem<T extends any[]> {
  /** 事件回调 */
  fn: (...args: T) => any
  /** 监听次数(null为无限监听) */
  num: number | null
}

export interface IEventMap<T = any> {
  [key: string]: Array<IEventMapItem<T[]>>
}
