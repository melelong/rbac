import type { ConfigFactory } from '@nestjs/config'
import type { APP_CONFIG_KEY, AppConfigType } from './app'
import type { CACHE_CONFIG_KEY, CacheConfigType } from './cache'
import type { CORS_CONFIG_KEY, CorsConfigType } from './cors'
import type { EMAIL_CONFIG_KEY, EmailConfigType } from './email'
import type { HELMET_CONFIG_KEY, HelmetConfigType } from './helmet'
import type { HTTP_CONFIG_KEY, HttpConfigType } from './http'
import type { JWT_CONFIG_KEY, JwtConfigType } from './jwt'
import type { ORM_CONFIG_KEY, OrmConfigType } from './orm'
import type { QUEUE_CONFIG_KEY, QueueConfigType } from './queue'
import type { SWAGGER_CONFIG_KEY, SwaggerConfigType } from './swagger'
import type { THROTTLER_CONFIG_KEY, ThrottlerConfigType } from './throttler'
import type { WINSTON_CONFIG_KEY, WinstonConfigType } from './winston'
import * as process from 'node:process'
import { Global, Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { AppConfig } from './app'
import { CacheConfig } from './cache'
import { CorsConfig } from './cors'
import { EmailConfig } from './email'
import { HelmetConfig } from './helmet'
import { HttpConfig } from './http'
import { JwtConfig } from './jwt'
import { OrmConfig } from './orm'
import { QueueConfig } from './queue'
import { SwaggerConfig } from './swagger'
import { ThrottlerConfig } from './throttler'
import { WinstonConfig } from './winston'

/** 导出供其他模块使用 */
export * from './app'
export * from './base'
export * from './cache'
export * from './cors'
export * from './email'
export * from './helmet'
export * from './http'
export * from './jwt'
export * from './orm'
export * from './queue'
export * from './swagger'
export * from './throttler'
export * from './winston'

/** 所有配置类型 */
export interface AllConfigType {
  [APP_CONFIG_KEY]: AppConfigType
  [WINSTON_CONFIG_KEY]: WinstonConfigType
  [ORM_CONFIG_KEY]: OrmConfigType
  [THROTTLER_CONFIG_KEY]: ThrottlerConfigType
  [CORS_CONFIG_KEY]: CorsConfigType
  [HTTP_CONFIG_KEY]: HttpConfigType
  [HELMET_CONFIG_KEY]: HelmetConfigType
  [SWAGGER_CONFIG_KEY]: SwaggerConfigType
  [QUEUE_CONFIG_KEY]: QueueConfigType
  [CACHE_CONFIG_KEY]: CacheConfigType
  [EMAIL_CONFIG_KEY]: EmailConfigType
  [JWT_CONFIG_KEY]: JwtConfigType
}

/** 所有配置 */
export const ALL_CONFIG = {
  AppConfig,
  WinstonConfig,
  OrmConfig,
  ThrottlerConfig,
  CorsConfig,
  HttpConfig,
  HelmetConfig,
  SwaggerConfig,
  QueueConfig,
  CacheConfig,
  EmailConfig,
  JwtConfig,
}

/** 配置模块 */
@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: ['.env.local', `.env.${process.env.ENV_NAME}`, '.env'],
      load: [...Object.values<ConfigFactory>(ALL_CONFIG)],
      cache: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
