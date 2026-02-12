import type { ICorsValidationSchema } from './ICorsValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

export const DEFAULT_CORS_ENABLED = true
export const DEFAULT_CORS_ORIGINS = 'http://127.0.0.1:4002,http://localhost:4002'
export const DEFAULT_CORS_METHODS = 'GET,PATCH,POST,DELETE,HEAD,OPTIONS'
export const DEFAULT_CORS_ALLOWED_HEADERS = 'Content-Type,Authorization'
export const DEFAULT_CORS_CREDENTIALS = true
export const DEFAULT_CORS_MAX_AGE = 3600
/** cors配置验证 */
export const CorsValidationSchema = BaseValidationSchema.append<ICorsValidationSchema>({
  CORS_ENABLED: Joi.boolean().empty('').default(DEFAULT_CORS_ENABLED),
  CORS_ORIGINS: Joi.string().empty('').default(DEFAULT_CORS_ORIGINS),
  CORS_METHODS: Joi.string().empty('').default(DEFAULT_CORS_METHODS),
  CORS_ALLOWED_HEADERS: Joi.string().empty('').default(DEFAULT_CORS_ALLOWED_HEADERS),
  CORS_CREDENTIALS: Joi.boolean().empty('').default(DEFAULT_CORS_CREDENTIALS),
  CORS_MAX_AGE: Joi.number().empty('').default(DEFAULT_CORS_MAX_AGE),
})
