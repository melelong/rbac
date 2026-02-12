import type { IBaseValidationSchema } from '../base'

/** 节流配置验证接口 */
export interface IThrottlerValidationSchema extends IBaseValidationSchema {
  THROTTLER_REDIS_HOST?: string
  THROTTLER_REDIS_PORT?: number
  THROTTLER_REDIS_USERNAME?: string
  THROTTLER_REDIS_PASSWORD?: string
  THROTTLER_REDIS_DB: number
  THROTTLER_DEFAULT_NAME: string
  THROTTLER_DEFAULT_TTL: number
  THROTTLER_DEFAULT_LIMIT: number
  THROTTLER_STRICT_NAME: string
  THROTTLER_STRICT_TTL: number
  THROTTLER_STRICT_LIMIT: number
  THROTTLER_LONG_NAME: string
  THROTTLER_LONG_TTL: number
  THROTTLER_LONG_LIMIT: number
}
