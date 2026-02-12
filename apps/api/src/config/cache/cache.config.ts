import type { ConfigType } from '@nestjs/config'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { CacheValidationSchema } from './cacheValidationSchema'

/** cache配置key */
export const CACHE_CONFIG_KEY = 'CACHE_CONFIG_KEY'
export interface ICacheConfig {
  /** memory缓存配置 */
  memory: {
    /** lru大小 */
    lruSize: number
    /** ttl */
    ttl: number
  }
  /** redis缓存配置 */
  redis: {
    /** redis主机 */
    host: string
    /** redis端口 */
    port: number
    /** redis用户名 */
    username: string
    /** redis密码 */
    password: string
    /** redis数据库 */
    db: number
    /** ttl */
    ttl: number
  }
}

/** cache配置 */
export const CacheConfig = registerAs(CACHE_CONFIG_KEY, (): ICacheConfig => {
  const { error, value } = CacheValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${CacheConfig.name}:${error.message}`)
  return {
    memory: {
      lruSize: value.CACHE_MEMORY_LRU_SIZE,
      ttl: value.CACHE_MEMORY_TTL,
    },
    redis: {
      host: value.CACHE_REDIS_HOST ?? value.REDIS_HOST,
      port: value.CACHE_REDIS_PORT ?? value.REDIS_PORT,
      username: value.CACHE_REDIS_USERNAME ?? value.REDIS_USERNAME,
      password: value.CACHE_REDIS_PASSWORD ?? value.REDIS_PASSWORD,
      db: value.CACHE_REDIS_DB,
      ttl: value.CACHE_REDIS_TTL,
    },
  }
})

/** cache配置类型 */
export type CacheConfigType = ConfigType<typeof CacheConfig>
