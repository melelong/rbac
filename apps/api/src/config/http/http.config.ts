import type { HttpModuleOptions } from '@nestjs/axios'
import type { ConfigType } from '@nestjs/config'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { HttpValidationSchema } from './httpValidationSchema'

/** http配置key */
export const HTTP_CONFIG_KEY = 'HTTP_CONFIG_KEY'

/** http配置接口 */
export interface IHttpConfig extends HttpModuleOptions {}

/** http配置 */
export const HttpConfig = registerAs(HTTP_CONFIG_KEY, (): IHttpConfig => {
  const { error, value } = HttpValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${HttpConfig.name}:${error.message}`)
  return {
    /** 请求超时时间(毫秒) */
    timeout: value.HTTP_TIMEOUT,
    /** 最大重定向数 */
    maxRedirects: value.HTTP_MAX_REDIRECTS,
  }
})
/** http配置类型 */
export type HttpConfigType = ConfigType<typeof HttpConfig>
