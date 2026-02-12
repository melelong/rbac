import type { ConfigType } from '@nestjs/config'
import type { ThrottlerModuleOptions } from '@nestjs/throttler'
import type { RedisOptions } from 'bullmq'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { ThrottlerValidationSchema } from './throttlerValidationSchema'

/** throttler配置key */
export const THROTTLER_CONFIG_KEY = 'THROTTLER_CONFIG_KEY'

export interface IThrottlerConfig {
  throttlersConfig: ThrottlerModuleOptions
  storageConfig: RedisOptions
}
/** throttler配置 */
export const ThrottlerConfig = registerAs(THROTTLER_CONFIG_KEY, (): IThrottlerConfig => {
  const { error, value } = ThrottlerValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${ThrottlerConfig.name}:${error.message}`)
  return {
    throttlersConfig: {
      throttlers: [
        /** 1分钟50次 */
        {
          name: value.THROTTLER_DEFAULT_NAME,
          ttl: value.THROTTLER_DEFAULT_TTL, // 1分钟
          limit: value.THROTTLER_DEFAULT_LIMIT,
        },
        /** 1秒3次 */
        {
          name: value.THROTTLER_STRICT_NAME,
          ttl: value.THROTTLER_STRICT_TTL,
          limit: value.THROTTLER_STRICT_LIMIT,
        },
        /** 1小时1000次 */
        {
          name: value.THROTTLER_LONG_NAME,
          ttl: value.THROTTLER_LONG_TTL,
          limit: value.THROTTLER_LONG_LIMIT,
        },
      ],
    },
    storageConfig: {
      host: value.THROTTLER_REDIS_HOST ?? value.REDIS_HOST,
      port: value.THROTTLER_REDIS_PORT ?? value.REDIS_PORT,
      username: value.THROTTLER_REDIS_USERNAME ?? value.REDIS_USERNAME,
      password: value.THROTTLER_REDIS_PASSWORD ?? value.REDIS_PASSWORD,
      db: value.THROTTLER_REDIS_DB,
    },
  }
})

/** throttler配置类型 */
export type ThrottlerConfigType = ConfigType<typeof ThrottlerConfig>
