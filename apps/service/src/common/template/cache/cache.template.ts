import type { Queue, RedisClient } from 'bullmq'
import type { ICacheTemplate, ICacheTemplateOptions } from './ICacheTemplate'
import { Cache } from '@nestjs/cache-manager'
import { SystemException } from '@/common/exceptions'
import { DEFAULT_CACHE_TTL } from '@/configs'
import { redisIsOk } from '@/infrastructure/redis/redis.utils'

/** 缓存模板抽象类 */
export abstract class CacheTemplate implements ICacheTemplate {
  redis: RedisClient
  memory: Cache
  queue?: Queue
  queueRedis?: RedisClient
  className: string
  constructor(cacheTemplateOptions: ICacheTemplateOptions) {
    const { className, redis, memory, queue, queueRedis } = cacheTemplateOptions
    this.className = className
    this.redis = redis
    this.memory = memory
    if (queue) {
      this.queue = queue
      queueRedis
        ? (this.queueRedis = queueRedis)
        : this.queue.client.then(
            (queueRedis) => (this.queueRedis = queueRedis),
            (error) => {
              throw new SystemException({ error })
            },
          )
    }
  }

  async set(key: string, value: unknown, ttl: number = DEFAULT_CACHE_TTL): Promise<void> {
    try {
      const _key = `${this.className}:${key}`
      await this.memory.set(_key, value, ttl)
      if (redisIsOk(this.redis)) {
        await this.redis.set(_key, JSON.stringify(value), 'PX', ttl)
      }
    } catch (error) {
      throw new SystemException({ error })
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const _key = `${this.className}:${key}`
      const memoryValue = await this.memory.get<T>(_key)
      if (memoryValue) return memoryValue ?? null

      if (redisIsOk(this.redis)) {
        const ttl = await this.redis.pttl(_key)
        const redisValue = await this.redis.get(_key)
        if (redisValue) {
          const _redisValue = JSON.parse(redisValue)
          await this.memory.set(_key, _redisValue, ttl * 0.8)
          return _redisValue as T
        }
      }
      return null
    } catch (error) {
      throw new SystemException({ error })
    }
  }

  async del(key: string): Promise<void> {
    try {
      const _key = `${this.className}:${key}`
      await this.memory.del(_key)
      if (redisIsOk(this.redis)) {
        await this.redis.del(_key)
      }
    } catch (error) {
      throw new SystemException({ error })
    }
  }

  async delMany(keys: string[]): Promise<void> {
    try {
      for (const key of keys) {
        await this.del(key)
      }
    } catch (error) {
      throw new SystemException({ error })
    }
  }

  async update(key: string, value: unknown): Promise<void> {
    try {
      const _key = `${this.className}:${key}`
      const _value = JSON.stringify(value)
      if (redisIsOk(this.redis)) {
        const ttl = await this.redis.pttl(_key)
        const multi = this.redis.multi()
        multi.set(_key, _value)
        this.memory.set(_key, _value, ttl)
        if (ttl > 0) multi.pexpire(_key, ttl)
        await multi.exec()
      } else {
        this.memory.set(_key, _value)
      }
    } catch (error) {
      throw new SystemException({ error })
    }
  }

  async delayedDel(key: string, delay: number = 1000): Promise<void> {
    if (!this.queue && !this.queueRedis && redisIsOk(this.queueRedis!)) {
      throw new SystemException({ error: new Error('No queue instance provided') })
    }
    try {
      const existingJob = await this.queue?.getJob(key)
      if (!existingJob) await this.queue?.add('delayedDel', { key }, { attempts: 3, delay })
    } catch (error) {
      throw new SystemException({ error })
    }
  }

  async delayedDelMany(keys: string[], delay: number = 1000): Promise<void> {
    if (!this.queue && !this.queueRedis && redisIsOk(this.queueRedis!)) {
      throw new SystemException({ error: new Error('No queue instance provided') })
    }
    try {
      for (const key of keys) {
        await this.delayedDel(key, delay)
      }
    } catch (error) {
      throw new SystemException({ error })
    }
  }
}
