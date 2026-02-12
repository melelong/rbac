import type { IThrottlerValidationSchema } from './IThrottlerValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

export const DEFAULT_THROTTLER_REDIS_DB = 0
export const DEFAULT_THROTTLER_DEFAULT_NAME = 'default'
export const DEFAULT_THROTTLER_DEFAULT_TTL = 60000
export const DEFAULT_THROTTLER_DEFAULT_LIMIT = 50
export const DEFAULT_THROTTLER_STRICT_NAME = 'strict'
export const DEFAULT_THROTTLER_STRICT_TTL = 1000
export const DEFAULT_THROTTLER_STRICT_LIMIT = 3
export const DEFAULT_THROTTLER_LONG_NAME = 'long'
export const DEFAULT_THROTTLER_LONG_TTL = 3600000
export const DEFAULT_THROTTLER_LONG_LIMIT = 1000
/** 节流配置验证 */
export const ThrottlerValidationSchema = BaseValidationSchema.append<IThrottlerValidationSchema>({
  THROTTLER_REDIS_HOST: Joi.string(),
  THROTTLER_REDIS_PORT: Joi.number(),
  THROTTLER_REDIS_USERNAME: Joi.string(),
  THROTTLER_REDIS_PASSWORD: Joi.string(),
  THROTTLER_REDIS_DB: Joi.number().min(0).max(15).empty('').default(DEFAULT_THROTTLER_REDIS_DB),

  THROTTLER_DEFAULT_NAME: Joi.string().empty('').default(DEFAULT_THROTTLER_DEFAULT_NAME),
  THROTTLER_DEFAULT_TTL: Joi.number().empty('').default(DEFAULT_THROTTLER_DEFAULT_TTL),
  THROTTLER_DEFAULT_LIMIT: Joi.number().empty('').default(DEFAULT_THROTTLER_DEFAULT_LIMIT),

  THROTTLER_STRICT_NAME: Joi.string().empty('').default(DEFAULT_THROTTLER_STRICT_NAME),
  THROTTLER_STRICT_TTL: Joi.number().empty('').default(DEFAULT_THROTTLER_STRICT_TTL),
  THROTTLER_STRICT_LIMIT: Joi.number().empty('').default(DEFAULT_THROTTLER_STRICT_LIMIT),

  THROTTLER_LONG_NAME: Joi.string().empty('').default(DEFAULT_THROTTLER_LONG_NAME),
  THROTTLER_LONG_TTL: Joi.number().empty('').default(DEFAULT_THROTTLER_LONG_TTL),
  THROTTLER_LONG_LIMIT: Joi.number().empty('').default(DEFAULT_THROTTLER_LONG_LIMIT),
})
