import type { ConfigType } from '@nestjs/config'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { SwaggerValidationSchema } from './swaggerValidationSchema'

/** swagger配置key */
export const SWAGGER_CONFIG_KEY = 'SWAGGER_CONFIG_KEY'

/** swagger配置接口 */
export interface ISwaggerConfig {
  /** 是否启用swagger */
  enabled: boolean
  /** swagger配置 */
  config: {
    /** swagger标签 */
    tag: string
    /** swagger标题 */
    title: string
    /** swagger描述 */
    description: string
    /** swagger版本 */
    version: string
    /** 是否忽略全局前缀 */
    ignoreGlobalPrefix: boolean
    /** swagger路径 */
    path: string
  }
}

/** swagger配置 */
export const SwaggerConfig = registerAs(SWAGGER_CONFIG_KEY, (): ISwaggerConfig => {
  const { error, value } = SwaggerValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${SwaggerConfig.name}:${error.message}`)
  return {
    enabled: value.SWAGGER_ENABLED,
    config: {
      tag: value.SWAGGER_TAG,
      title: value.SWAGGER_TITLE,
      description: value.SWAGGER_DESCRIPTION,
      version: value.SWAGGER_VERSION,
      ignoreGlobalPrefix: value.SWAGGER_IGNORE_GLOBAL_PREFIX,
      path: value.SWAGGER_PATH,
    },
  }
})
/** swagger配置类型 */
export type SwaggerConfigType = ConfigType<typeof SwaggerConfig>
