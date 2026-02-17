import type { ICacheValidationSchema } from './ICacheValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

/** cache配置相关 */
export const DEFAULT_CACHE_MEMORY_LRU_SIZE = 5000
export const DEFAULT_CACHE_MEMORY_TTL = 5 * 60 * 1000
export const DEFAULT_CACHE_REDIS_DB = 2
export const DEFAULT_CACHE_REDIS_TTL = 30 * 60 * 1000
/** cache配置验证 */
export const CacheValidationSchema = BaseValidationSchema.append<ICacheValidationSchema>({
  CACHE_MEMORY_LRU_SIZE: Joi.number().empty('').default(DEFAULT_CACHE_MEMORY_LRU_SIZE),
  CACHE_MEMORY_TTL: Joi.number().empty('').default(DEFAULT_CACHE_MEMORY_TTL),
  CACHE_REDIS_HOST: Joi.string(),
  CACHE_REDIS_PORT: Joi.number(),
  CACHE_REDIS_USERNAME: Joi.string(),
  CACHE_REDIS_PASSWORD: Joi.string(),
  CACHE_REDIS_DB: Joi.number().min(0).max(15).empty('').default(DEFAULT_CACHE_REDIS_DB),
  CACHE_REDIS_TTL: Joi.number().empty('').default(DEFAULT_CACHE_REDIS_TTL),
})
