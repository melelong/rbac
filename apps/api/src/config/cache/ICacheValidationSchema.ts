import type { IBaseValidationSchema } from '../base'

/** cache配置验证接口 */
export interface ICacheValidationSchema extends IBaseValidationSchema {
  CACHE_MEMORY_LRU_SIZE: number
  CACHE_MEMORY_TTL: number
  CACHE_REDIS_HOST?: string
  CACHE_REDIS_PORT?: number
  CACHE_REDIS_USERNAME?: string
  CACHE_REDIS_PASSWORD?: string
  CACHE_REDIS_DB: number
  CACHE_REDIS_TTL: number
}
