import type { IEmailValidationSchema } from './IEmailValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

export const DEFAULT_EMAIL_HOST = 'smtp.qq.com'
export const DEFAULT_EMAIL_PORT = 587
export const DEFAULT_EMAIL_SECURE = false
export const DEFAULT_EMAIL_TEMPLATE_DIR = 'templates/email'

/** 邮箱配置验证 */
export const EmailValidationSchema = BaseValidationSchema.append<IEmailValidationSchema>({
  EMAIL_HOST: Joi.string().empty('').default(DEFAULT_EMAIL_HOST),
  EMAIL_PORT: Joi.string().empty('').default(DEFAULT_EMAIL_PORT),
  EMAIL_USER: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
  EMAIL_SECURE: Joi.boolean().empty('').default(DEFAULT_EMAIL_SECURE),
  EMAIL_TEMPLATE_DIR: Joi.string().empty('').default(DEFAULT_EMAIL_TEMPLATE_DIR),
})
