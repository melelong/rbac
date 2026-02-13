import type { Cache } from '@nestjs/cache-manager'
import type { Queue, RedisClient } from 'bullmq'
import type { LoggingService } from '@/common/infra'
import type { TRedis } from '@/common/utils'

/** 缓存模板抽象类配置接口 */
export interface ICacheTemplateOptions {
  /** 缓存实例 */
  cache: Cache
  /** 日志用于提供给模板调试 */
  loggingService: LoggingService
  /** 队列实例(用于延迟删除,需要提供消费者文件,文件内要注入子类来提供删除方法) */
  queue?: Queue
  /** 队列redis实例 */
  queueRedis?: RedisClient
}

export interface ICacheLockOptions {
  /** 锁过期时间（毫秒） */
  expiration?: number
  /** 重试次数 */
  retryCount?: number
  /** 重试间隔（毫秒） */
  retryDelay?: number
}
/** 缓存模板抽象类接口 */
export interface ICacheTemplate extends ICacheTemplateOptions {
  /** 发布订阅通道名称 */
  channelName: string
  /** 订阅者 */
  sub: TRedis | null
  /**
   * 获取锁键名
   * @param key 键名
   */
  getLockKey: (key: string) => string
  /**
   * 使用分布式锁执行操作(基于 Redis 的 SET NX EX 原子命令实现)
   * @param key 缓存键
   * @param callback 要执行的回调函数
   * @param options 锁选项
   * @returns 回调函数的返回值
   */
  withLock: <T>(key: string, callback: () => Promise<T>, options?: ICacheLockOptions) => Promise<T>
  /**
   * 写入缓存
   * @param key 缓存键名
   * @param value 值
   * @param ttl 过期时间(default: 0),0 为永久缓存
   */
  set: <T = any>(key: string, value: T, ttl: number) => Promise<void>
  /**
   * 读取缓存
   * @param key 缓存键名
   */
  get: <T = any>(key: string) => Promise<T | null>
  /**
   * 删除缓存
   * @param key 缓存键名
   */
  del: (key: string) => Promise<void>
  /**
   * 批量删除缓存
   * @param keys 缓存键名数组
   */
  delMany: (keys: string[]) => Promise<void>
  /**
   * 更新缓存
   * @param key 缓存键名
   * @param value 更新值
   */
  update: <T = any>(key: string, value: T) => Promise<void>
  /**
   * 延迟写入缓存(要提供队列)
   * @param key 键名
   * @param value 值
   * @param ttl 过期时间(default: 0),0 为永久缓存
   * @param delay 延迟时间(default: 1000)
   * @param attempts 尝试次数(default: 3)
   */
  delayedSet: <T = any>(key: string, value: T, ttl: number, delay: number, attempts: number) => Promise<void>
  /**
   * 延迟更新缓存(要提供队列)
   * @param key 键名
   * @param value 更新值
   * @param delay 延迟时间(default: 1000)
   * @param attempts 尝试次数(default: 3)
   */
  delayedUpdate: <T = any>(key: string, value: T, delay: number, attempts: number) => Promise<void>
  /**
   * 延迟删除缓存(要提供队列)
   * @param key 键名
   * @param delay 延迟时间(default: 1000)
   * @param attempts 尝试次数(default: 3)
   */
  delayedDel: (key: string, delay: number, attempts: number) => Promise<void>
  /**
   * 批量延迟删除缓存(要提供队列)
   * @param keys 键名数组
   * @param delay 延迟时间(default: 1000)
   * @param attempts 尝试次数(default: 3)
   */
  delayedDelMany: (keys: string[], delay: number, attempts: number) => Promise<void>
  /** 初始化发布订阅 */
  initPubsub: () => Promise<void>
  /** 关闭发布订阅连接 */
  closePubsub: () => Promise<void>
}
