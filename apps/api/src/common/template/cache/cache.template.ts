import type { Queue, RedisClient } from 'bullmq'
import type { Redis as IOValkey } from 'iovalkey'
import type { ICacheLockOptions, ICacheTemplate, ICacheTemplateOptions } from './ICacheTemplate'
import type { LoggingService } from '@/common/infra'
import { Cache } from '@nestjs/cache-manager'
import { OnApplicationBootstrap } from '@nestjs/common'
import { CacheException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { redisIsOk, uuid_v4 } from '@/common/utils'

/**
 * 布隆过滤器相关 https://github.com/redis/node-redis/blob/master/examples/bloom-filter.js
 */
/** 缓存模板抽象类 */
export abstract class CacheTemplate implements ICacheTemplate, OnApplicationBootstrap {
  className: string
  cache: Cache
  loggingService: LoggingService
  queue?: Queue<any, any, string, any, any, string>
  queueRedis?: RedisClient
  channelName: string = CacheTemplate.name
  sub: IOValkey | null = null
  constructor(options: ICacheTemplateOptions) {
    const { className, cache, loggingService, queue, queueRedis } = options
    this.className = className
    this.cache = cache
    this.loggingService = loggingService
    if (queue) {
      this.queue = queue
      queueRedis ? (this.queueRedis = queueRedis) : this.queue.client.then((queueRedis) => (this.queueRedis = queueRedis))
    }
  }

  onApplicationBootstrap() {
    setTimeout(() => this.initPubsub(), 0)
  }

  getLockKey(key: string) {
    return `${this.className}:lock:${key}`
  }

  getCacheKey(key: string) {
    return `${this.className}:${key}`
  }

  async withLock<T>(key: string, callback: () => Promise<T>, options: ICacheLockOptions = {}): Promise<T> {
    const { expiration = 30000, retryCount = 10, retryDelay = 100 } = options
    const lockKey = this.getLockKey(key)
    const lockValue = uuid_v4()

    /** 尝试获取锁(使用 SET NX PX 原子命令确保只有一个客户端能获得锁) */
    const acquireLock = async (): Promise<boolean> => {
      const result = await this.RedisClient.set(lockKey, lockValue, 'PX', expiration, 'NX')
      return result === 'OK'
    }

    /** 释放锁(使用 Lua 脚本确保原子性检查并释放（防止误删其他客户端的锁）) */
    const releaseLock = async (): Promise<void> => {
      const luaScript = `
        if redis.call("get", KEYS[1]) == ARGV[1] then
          return redis.call("del", KEYS[1])
        else
          return 0
        end
      `
      await this.RedisClient.eval(luaScript, 1, lockKey, lockValue)
    }
    /** 带重试的获取锁 */
    const acquireLockWithRetry = async (): Promise<void> => {
      for (let i = 0; i < retryCount; i++) {
        if (await acquireLock()) return
        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, retryDelay))
      }
      throw new CacheException(ExceptionCode.COMMON_TOO_MANY_REQUESTS, ExceptionCodeTextMap)
    }
    await acquireLockWithRetry()
    try {
      // 执行操作
      return await callback()
    } finally {
      // 释放锁
      await releaseLock()
    }
  }

  async set<T = unknown>(key: string, value: T, ttl: number = 0) {
    return this.withLock(key, async () => {
      const _key = this.getCacheKey(key)
      await this.cache.set<T>(_key, value, ttl)
      /** 发布通知 */
      await this.RedisClient.publish(this.channelName, _key)
    })
  }

  async get<T = unknown>(key: string) {
    const _key = this.getCacheKey(key)
    const memoryValue = await this.L1Store.get<T>(_key)
    if (memoryValue !== undefined && !Object.is(memoryValue, null)) {
      this.loggingService.debug(`l1命中`)
      return memoryValue as T
    }
    if (redisIsOk(this.RedisClient)) {
      const redisValue = await this.L2Store.get(_key)
      if (Object.is(redisValue, null)) return null
      const ttl = await this.RedisClient.ttl(_key)
      this.loggingService.debug(`l2命中`)
      /** ttl * 1000 * 0.8 (ms) 0.8是弥补操作衰减 */
      await this.L1Store.set<T>(_key, redisValue, Math.max(ttl * 800, 0))
      return redisValue as T
    }
    return null
  }

  get RedisClient() {
    return this.L2Store.store.redis as IOValkey
  }

  get L1Store() {
    return this.cache.stores[0]
  }

  get L2Store() {
    return this.cache.stores[1]
  }

  async del(key: string) {
    return this.withLock(key, async () => {
      const _key = this.getCacheKey(key)
      await this.cache.del(_key)
      /** 发布通知 */
      await this.RedisClient.publish(this.channelName, _key)
    })
  }

  async delMany(keys: string[]) {
    await Promise.all(keys.map((key) => this.del(key)))
  }

  async update<T = unknown>(key: string, value: T) {
    return this.withLock(key, async () => {
      const _key = this.getCacheKey(key)
      const [ttl, old] = await Promise.all([this.RedisClient.ttl(_key), this.get(key)])
      if (!old) return
      await this.cache.set<T>(_key, value, Math.max(ttl * 800, 0))
      /** 发布通知 */
      await this.RedisClient.publish(this.channelName, _key)
    })
  }

  async delayedSet<T = unknown>(key: string, value: T, ttl: number = 0, delay: number = 1000, attempts: number = 3) {
    if ((!this.queue && !this.queueRedis) || (!redisIsOk(this.queueRedis!))) throw new CacheException(ExceptionCode.CACHE_NO_QUEUE_INSTANCE_PROVIDED, ExceptionCodeTextMap)
    const existingJob = await this.queue?.getJob(key)
    if (!existingJob) await this.queue?.add('delayedSet', { type: 'set', key, value, ttl }, { attempts, delay })
  }

  async delayedUpdate<T = unknown>(key: string, value: T, delay: number = 1000, attempts: number = 3) {
    if ((!this.queue && !this.queueRedis) || (!redisIsOk(this.queueRedis!))) throw new CacheException(ExceptionCode.CACHE_NO_QUEUE_INSTANCE_PROVIDED, ExceptionCodeTextMap)
    const existingJob = await this.queue?.getJob(key)
    if (!existingJob) await this.queue?.add('delayedUpdate', { type: 'update', key, value }, { attempts, delay })
  }

  async delayedDel(key: string, delay: number = 1000, attempts: number = 3) {
    if ((!this.queue && !this.queueRedis) || (!redisIsOk(this.queueRedis!))) throw new CacheException(ExceptionCode.CACHE_NO_QUEUE_INSTANCE_PROVIDED, ExceptionCodeTextMap)
    const existingJob = await this.queue?.getJob(key)
    if (!existingJob) await this.queue?.add('delayedDel', { type: 'del', key }, { attempts, delay })
  }

  async delayedDelMany(keys: string[], delay: number = 1000, attempts: number = 3) {
    await Promise.all(keys.map((key) => this.delayedDel(key, delay, attempts)))
  }

  async initPubsub() {
    const redisClient = this.RedisClient
    this.sub = redisClient.duplicate()
    this.sub.on('message', async (channel: string, key: string) => {
      if (channel === this.channelName) {
        await this.L1Store.delete(key)
        this.loggingService.debug(`pubsub 收到消息: ${key}`)
      }
    })
    await this.sub.subscribe(this.channelName)
  }

  async closePubsub() {
    if (this.sub) {
      await this.sub.unsubscribe(this.channelName)
      await this.sub.quit()
      this.sub = null
    }
  }
}
