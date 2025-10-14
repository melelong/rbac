import type { IEventBus, IEventBusEvents, IEventBusOptions, IEventMap } from './IEventBus'

export class EventBus<T extends IEventBusEvents> implements IEventBus<T> {
  /** EventBus实例 */
  private static instance: EventBus<IEventBusEvents> | null = null
  /** 事件映射表 */
  private eventMap: IEventMap = {}
  /** 最大监听数 */
  private maxListeners: number = 10

  private constructor(options: IEventBusOptions = { maxListeners: 10 }) {
    this.maxListeners = options.maxListeners
  }

  /** 创建实例 */
  public static create<T extends IEventBusEvents>(options?: IEventBusOptions) {
    if (!this.instance) this.instance = new EventBus<T>(options)
    return this.instance as EventBus<T>
  }

  on<K extends keyof T>(eventName: K, fn: (...args: T[K]) => any, num: number | null = null) {
    if (!this.eventMap[eventName as string]) this.eventMap[eventName as string] = []
    if (this.eventMap[eventName as string].length >= this.maxListeners) {
      console.warn(`事件总线中 ${eventName as string} 事件监听已达到最大监听数 ${this.maxListeners} `)
      return
    }
    this.eventMap[eventName as string].push({ fn, num })
  }

  emit<K extends keyof T>(eventName: K, args?: T[K]) {
    if (!this.eventMap[eventName as string]) return
    const _args = args ?? []
    const removeList: Array<number> = []
    this.eventMap[eventName as string].forEach((item, index) => {
      item.fn(..._args)
      if (typeof item.num === 'number') {
        item.num--
        if (item.num === 0) removeList.push(index)
      }
    })
    for (let i = removeList.length - 1; i >= 0; i--) {
      this.eventMap[eventName as string].splice(removeList[i], 1)
    }
  }

  once<K extends keyof T>(eventName: K, fn: (...args: T[K]) => any) {
    this.on(eventName, fn, 1)
  }

  off<K extends keyof T>(eventName: K, fn: (...args: T[K]) => any) {
    if (!this.eventMap[eventName as string]) return
    const index = this.eventMap[eventName as string].findIndex((item) => item.fn === fn)
    if (index !== -1) this.eventMap[eventName as string].splice(index, 1)
  }

  removeListeners<K extends keyof T>(eventName?: K) {
    if (eventName) {
      if (this.eventMap[eventName as string]) delete this.eventMap[eventName as string]
    } else {
      this.eventMap = {}
    }
  }
}
