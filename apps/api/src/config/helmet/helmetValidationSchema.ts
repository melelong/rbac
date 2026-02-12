import type { IHelmetValidationSchema } from './IHelmetValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'
import { CROSS_ORIGIN_OPENER_POLICY_TYPE } from './IHelmetValidationSchema'

export const DEFAULT_HELMET_ENABLED = true
export const DEFAULT_HELMET_CROSS_ORIGIN_OPENER_POLICY = 'same-origin-allow-popups'
export const DEFAULT_HELMET_CROSS_ORIGIN_RESOURCE_POLICY = false
export const DEFAULT_HELMET_CONTENT_SECURITY_POLICY = false
/** helmet配置验证 */
export const HelmetValidationSchema = BaseValidationSchema.append<IHelmetValidationSchema>({
  HELMET_ENABLED: Joi.boolean().empty('').default(DEFAULT_HELMET_ENABLED),
  HELMET_CROSS_ORIGIN_OPENER_POLICY: Joi.string()
    .valid(...CROSS_ORIGIN_OPENER_POLICY_TYPE)
    .empty('')
    .default(DEFAULT_HELMET_CROSS_ORIGIN_OPENER_POLICY),
  HELMET_CROSS_ORIGIN_RESOURCE_POLICY: Joi.boolean().empty('').default(DEFAULT_HELMET_CROSS_ORIGIN_RESOURCE_POLICY),
  HELMET_CONTENT_SECURITY_POLICY: Joi.boolean().empty('').default(DEFAULT_HELMET_CONTENT_SECURITY_POLICY),
})
