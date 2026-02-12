import type { ISwaggerValidationSchema } from './ISwaggerValidationSchema'
import Joi from 'joi'
import { DEFAULT_APP_NAME } from '../app'
import { BaseValidationSchema } from '../base'

export const DEFAULT_SWAGGER_ENABLED = true
export const DEFAULT_SWAGGER_TAG = DEFAULT_APP_NAME
export const DEFAULT_SWAGGER_TITLE = DEFAULT_APP_NAME
export const DEFAULT_SWAGGER_DESCRIPTION = `${DEFAULT_SWAGGER_TITLE} API description`
export const DEFAULT_SWAGGER_VERSION = '1.0.0'
export const DEFAULT_SWAGGER_IGNORE_GLOBAL_PREFIX = false
export const DEFAULT_SWAGGER_PATH = 'swagger'
/** swagger配置验证 */
export const SwaggerValidationSchema = BaseValidationSchema.append<ISwaggerValidationSchema>({
  SWAGGER_ENABLED: Joi.boolean().empty('').default(DEFAULT_SWAGGER_ENABLED),
  SWAGGER_TAG: Joi.string().empty('').default(DEFAULT_SWAGGER_TAG),
  SWAGGER_TITLE: Joi.string().empty('').default(DEFAULT_SWAGGER_TITLE),
  SWAGGER_DESCRIPTION: Joi.string().empty('').default(DEFAULT_SWAGGER_DESCRIPTION),
  SWAGGER_VERSION: Joi.string().empty('').default(DEFAULT_SWAGGER_VERSION),
  SWAGGER_IGNORE_GLOBAL_PREFIX: Joi.boolean().empty('').default(DEFAULT_SWAGGER_IGNORE_GLOBAL_PREFIX),
  SWAGGER_PATH: Joi.string().empty('').default(DEFAULT_SWAGGER_PATH),
})
