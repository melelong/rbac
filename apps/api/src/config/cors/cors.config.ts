import type { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface'
import type { ConfigType } from '@nestjs/config'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { CorsValidationSchema } from './corsValidationSchema'

/** cors配置key */
export const CORS_CONFIG_KEY = 'CORS_CONFIG_KEY'

/** cors配置接口 */
export interface ICorsConfig {
  /** 是否启用cors */
  enabled: boolean
  /** cors配置 */
  config: CorsOptions | CorsOptionsDelegate<any>
}

/** cors配置 */
export const CorsConfig = registerAs(CORS_CONFIG_KEY, (): ICorsConfig => {
  const { error, value } = CorsValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${CorsConfig.name}:${error.message}`)
  return {
    enabled: value.CORS_ENABLED,
    config: {
      /** 允许跨域的源(,隔开) */
      origin: (origin, callback) => {
        const allowedOrigins = value.CORS_ORIGINS.split(',')
        const isLocalNetwork = /^http:\/\/192\.168\.0\.\d{1,3}(?::\d+)?$/.test(origin)
        const isAllowed = allowedOrigins.includes(origin) || isLocalNetwork
        callback(null, isAllowed)
      },
      /** 允许跨域的请求方法类型 */
      methods: value.CORS_METHODS,
      /** 允许跨域的请求头属性 */
      allowedHeaders: value.CORS_ALLOWED_HEADERS,
      /** 允许跨域携带凭证 */
      credentials: value.CORS_CREDENTIALS,
      /** OPTIONS请求预检结果缓存的时间 */
      maxAge: value.CORS_MAX_AGE,
    },
  }
})
/** cors配置类型 */
export type CorsConfigType = ConfigType<typeof CorsConfig>
