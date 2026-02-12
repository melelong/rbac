import type { ConfigType } from '@nestjs/config'
import type { JwtModuleOptions } from '@nestjs/jwt'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { JwtValidationSchema } from './jwtValidationSchema'

/** jwt配置key */
export const JWT_CONFIG_KEY = 'JWT_CONFIG_KEY'

/** jwt配置接口 */
export interface IJwtConfig {
  /** JWT配置 */
  config: JwtModuleOptions
  /** 访问令牌过期时间 */
  accessTokenExpiresIn: string
  /** 刷新令牌过期时间 */
  refreshTokenExpiresIn: string
  /** cookie访问令牌过期时间 */
  accessTokenCookieExpiresIn: number
  /** cookie刷新令牌过期时间 */
  refreshTokenCookieExpiresIn: number
}

/** jwt配置 */
export const JwtConfig = registerAs(JWT_CONFIG_KEY, (): IJwtConfig => {
  const { error, value } = JwtValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${JwtConfig.name}:${error.message}`)
  return {
    config: {
      global: true,
      secret: value.JWT_SECRET,
      signOptions: {
        expiresIn: value.JWT_EXPIRES_IN,
      },
    },
    accessTokenExpiresIn: value.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: value.JWT_REFRESH_TOKEN_EXPIRES_IN,
    accessTokenCookieExpiresIn: value.JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN,
    refreshTokenCookieExpiresIn: value.JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  }
})
/** jwt配置类型 */
export type JwtConfigType = ConfigType<typeof JwtConfig>
