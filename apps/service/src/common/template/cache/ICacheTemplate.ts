import type { Cache } from '@nestjs/cache-manager'
import type { Queue, RedisClient } from 'bullmq'
/** 缓存模板抽象类配置接口 */
export interface ICacheTemplateOptions {
  /** 应用模板的类名 */
  className: string
  /** redis缓存实例 */
  redis: RedisClient
  /** 内存缓存实例 */
  memory: Cache
  /** 队列实例(用于延迟删除,需要提供消费者文件,文件内要注入子类来提供删除方法) */
  queue?: Queue
  /** 队列redis实例 */
  queueRedis?: RedisClient
}
/** 缓存模板抽象类接口 */
export interface ICacheTemplate {
  /** redis缓存实例 */
  redis: RedisClient
  /** memory缓存实例 */
  memory: Cache
  /** 队列实例 */
  queue?: Queue
  /** 队列的redis实例 */
  queueRedis?: RedisClient
  /** 应用模板的类名 */
  className: string

  /**
   * 写入缓存
   * @param key 键名
   * @param value 值
   * @param ttl 过期时间(default: 7 * 1000)
   */
  set: (key: string, value: unknown, ttl: number) => Promise<void>

  /**
   * 获取缓存
   * @param key 键名
   */
  get: <T = any>(key: string) => Promise<T | null>

  /**
   * 删除缓存
   * @param key 键名
   */
  del: (key: string) => Promise<void>

  /**
   * 批量删除缓存
   * @param keys 键名数组
   */
  delMany: (keys: string[]) => Promise<void>

  /**
   * 更新缓存
   * @param key 键名
   * @param value 更新值
   */
  update: (key: string, value: unknown) => Promise<void>

  /**
   * 延迟删除缓存(要提供队列)
   * @param key 键名
   * @param delay 延迟时间(default: 1000)
   */
  delayedDel: (key: string, delay: number) => Promise<void>

  /**
   * 批量延迟删除缓存(要提供队列)
   * @param keys 键名数组
   * @param delay 延迟时间(default: 1000)
   */
  delayedDelMany: (keys: string[], delay: number) => Promise<void>
}
