import type { IEventBus, IEventBusOptions, IEventMap } from './IEventBus'

export class EventBus<T extends string[] = []> implements IEventBus<T> {
  /** EventBus实例 */
  private static instance: EventBus<Array<string>> | null = null
  private eventMap: IEventMap = {}
  private maxListeners: number = 10

  private constructor(options: IEventBusOptions = { maxListeners: 10 }) {
    this.maxListeners = options.maxListeners
  }

  /** 创建实例 */
  public static create<T extends string[] = []>(options?: IEventBusOptions) {
    if (!this.instance) this.instance = new EventBus<T>(options)
    return this.instance as EventBus<T>
  }

  on(eventName: T[number], fn: (...args: Array<any>) => any, num: number | null = null) {
    if (!this.eventMap[eventName]) this.eventMap[eventName] = []
    if (this.eventMap[eventName].length >= this.maxListeners) {
      console.warn(`事件总线种 ${eventName} 事件监听已达到最大监听数 ${this.maxListeners} `)
      return
    }
    this.eventMap[eventName].push({ fn, num })
  }

  emit(eventName: T[number], args: Array<any> = []) {
    if (!this.eventMap[eventName]) return
    const removeList: Array<number> = []
    this.eventMap[eventName].forEach((item, index) => {
      item.fn(...args)
      if (typeof item.num === 'number') {
        item.num--
        if (item.num === 0) removeList.push(index)
      }
    })
    for (let i = removeList.length - 1; i >= 0; i--) {
      this.eventMap[eventName].splice(removeList[i], 1)
    }
  }

  once(eventName: T[number], fn: (...args: Array<any>) => any) {
    this.on(eventName, fn, 1)
  }

  off(eventName: T[number], fn: (...args: Array<any>) => any) {
    if (!this.eventMap[eventName]) return
    const index = this.eventMap[eventName].findIndex((item) => item.fn === fn)
    if (index !== -1) this.eventMap[eventName].splice(index, 1)
  }

  removeAllListeners(eventName?: T[number]) {
    if (eventName) {
      if (this.eventMap[eventName]) delete this.eventMap[eventName]
    } else {
      this.eventMap = {}
    }
  }
}
