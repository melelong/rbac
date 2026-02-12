import type { IJwtValidationSchema } from './IJwtValidationSchema'
import Joi from 'joi'
import { DEFAULT_APP_NAME } from '../app'
import { BaseValidationSchema } from '../base'

export const DEFAULT_JWT_SECRET = DEFAULT_APP_NAME
export const DEFAULT_JWT_EXPIRES_IN = '30m'
export const DEFAULT_JWT_ACCESS_TOKEN_EXPIRES_IN = '15m'
export const DEFAULT_JWT_REFRESH_TOKEN_EXPIRES_IN = '7d'
export const DEFAULT_JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN = 15 * 60 * 1000
export const DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000
/** JWT配置验证 */
export const JwtValidationSchema = BaseValidationSchema.append<IJwtValidationSchema>({
  JWT_SECRET: Joi.string().empty('').default(DEFAULT_JWT_SECRET),
  JWT_EXPIRES_IN: Joi.string().empty('').default(DEFAULT_JWT_EXPIRES_IN),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.string().empty('').default(DEFAULT_JWT_ACCESS_TOKEN_EXPIRES_IN),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.string().empty('').default(DEFAULT_JWT_REFRESH_TOKEN_EXPIRES_IN),
  JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN: Joi.number().empty('').default(DEFAULT_JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN),
  JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN: Joi.number().empty('').default(DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN),
})
