import type { IAppValidationSchema } from './IAppValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

export const DEFAULT_APP_NAME = 'NestApp'
export const DEFAULT_APP_PORT = 4001
export const DEFAULT_APP_HOSTNAME = '0.0.0.0'
export const DEFAULT_APP_GLOBAL_PREFIX = ''
export const DEFAULT_APP_SALT = 'NEST_APP_SALT'
export const DEFAULT_APP_SUPER_NAME = 'super'
export const DEFAULT_APP_ADMIN_NAME = 'admin'
export const DEFAULT_APP_USER_NAME = 'user'
export const DEFAULT_APP_SUPER_EMAIL = 'Aa123456@qq.com'
export const DEFAULT_APP_PWD = 'Aa123456'
export const DEFAULT_APP_SUPER_PWD = DEFAULT_APP_PWD
export const DEFAULT_APP_ADMIN_PWD = DEFAULT_APP_PWD
export const DEFAULT_APP_USER_PWD = DEFAULT_APP_PWD
export const DEFAULT_APP_DEFAULT_VERSION = '1'
/** app配置验证 */
export const AppValidationSchema = BaseValidationSchema.append<IAppValidationSchema>({
  APP_NAME: Joi.string().empty('').default(DEFAULT_APP_NAME),
  APP_PORT: Joi.number().empty('').default(DEFAULT_APP_PORT),
  APP_HOSTNAME: Joi.string().empty('').default(DEFAULT_APP_HOSTNAME),
  APP_GLOBAL_PREFIX: Joi.string().min(0).empty('').default(DEFAULT_APP_GLOBAL_PREFIX),
  APP_SALT: Joi.string().empty('').default(DEFAULT_APP_SALT),
  APP_SUPER_NAME: Joi.string().empty('').default(DEFAULT_APP_SUPER_NAME),
  APP_ADMIN_NAME: Joi.string().empty('').default(DEFAULT_APP_ADMIN_NAME),
  APP_USER_NAME: Joi.string().empty('').default(DEFAULT_APP_USER_NAME),
  APP_SUPER_EMAIL: Joi.string().empty('').default(DEFAULT_APP_SUPER_EMAIL),
  APP_SUPER_PWD: Joi.string().empty('').default(DEFAULT_APP_SUPER_PWD),
  APP_ADMIN_PWD: Joi.string().empty('').default(DEFAULT_APP_ADMIN_PWD),
  APP_USER_PWD: Joi.string().empty('').default(DEFAULT_APP_USER_PWD),
  APP_DEFAULT_VERSION: Joi.string().empty('').default(DEFAULT_APP_DEFAULT_VERSION),
})
