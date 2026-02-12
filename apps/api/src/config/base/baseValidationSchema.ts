import type { IBaseValidationSchema } from './IBaseValidationSchema'
import Joi from 'joi'

export const DEFAULT_REDIS_HOST = '127.0.0.1'
export const DEFAULT_REDIS_PORT = 6379
export const DEFAULT_REDIS_USERNAME = 'default'
export const DEFAULT_REDIS_PASSWORD = 'Aa123456'

export const DEFAULT_REDIS_ENABLE_AUTO_PIPELINING = true
export const DEFAULT_REDIS_COMMAND_TIMEOUT = 5 * 60 * 1000
export const DEFAULT_REDIS_CONNECT_TIMEOUT = 20000
export const DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE = true
export const DEFAULT_REDIS_KEEP_ALIVE = 2 * 1000

/** 公共配置验证 */
export const BaseValidationSchema = Joi.object<IBaseValidationSchema>({
  REDIS_HOST: Joi.string().empty('').default(DEFAULT_REDIS_HOST),
  REDIS_PORT: Joi.number().empty('').default(DEFAULT_REDIS_PORT),
  REDIS_USERNAME: Joi.string().empty('').default(DEFAULT_REDIS_USERNAME),
  REDIS_PASSWORD: Joi.string().empty('').default(DEFAULT_REDIS_PASSWORD),
})
