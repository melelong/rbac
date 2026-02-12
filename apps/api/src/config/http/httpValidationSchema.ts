import type { IHttpValidationSchema } from './IHttpValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

/** http配置相关 */
export const DEFAULT_HTTP_TIMEOUT = 10000
export const DEFAULT_HTTP_MAX_REDIRECTS = 5
/** Http配置验证 */
export const HttpValidationSchema = BaseValidationSchema.append<IHttpValidationSchema>({
  HTTP_TIMEOUT: Joi.number().empty('').default(DEFAULT_HTTP_TIMEOUT),
  HTTP_MAX_REDIRECTS: Joi.number().empty('').default(DEFAULT_HTTP_MAX_REDIRECTS),
})
