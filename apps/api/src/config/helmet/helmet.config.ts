import type { ConfigType } from '@nestjs/config'
import type { HelmetOptions } from 'helmet'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { HelmetValidationSchema } from './helmetValidationSchema'

/** helmet配置key */
export const HELMET_CONFIG_KEY = 'HELMET_CONFIG_KEY'

/** helmet配置接口 */
export interface IHelmetConfig {
  /** 是否启用helmet */
  enabled: boolean
  /** helmet配置 */
  config: HelmetOptions
}

/** helmet配置 */
export const HelmetConfig = registerAs(HELMET_CONFIG_KEY, (): IHelmetConfig => {
  const { error, value } = HelmetValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${HelmetConfig.name}:${error.message}`)
  return {
    enabled: value.HELMET_ENABLED,
    config: {
      crossOriginOpenerPolicy: {
        policy: value.HELMET_CROSS_ORIGIN_OPENER_POLICY,
      },
      /** 跨域资源策略 */
      crossOriginResourcePolicy: value.HELMET_CROSS_ORIGIN_RESOURCE_POLICY,
      /** 内容安全策略 */
      contentSecurityPolicy: value.HELMET_CONTENT_SECURITY_POLICY,
    },
  }
})
/** helmet配置类型 */
export type HelmetConfigType = ConfigType<typeof HelmetConfig>
