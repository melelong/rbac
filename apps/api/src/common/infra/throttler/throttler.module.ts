import type { Redis, RedisOptions } from 'ioredis'
import type { IInitRedisReturn, TRedis } from '@/common/utils'
import type { IThrottlerConfig } from '@/config'
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ThrottlerModule as nestThrottlerModule } from '@nestjs/throttler'
import { initRedis } from '@/common/utils'
import { THROTTLER_CONFIG_KEY } from '@/config'
import { THROTTLER_REDIS_CLIENT_TOKEN } from './constant'

export class ThrottlerModuleHelper {
  public static instance: ThrottlerModuleHelper
  public logger: Logger
  public initRedis: IInitRedisReturn
  public static redis: null | TRedis = null

  /**
   * 创建ThrottlerModuleHelper实例
   * @param config Redis配置
   */
  public static async create(config: RedisOptions) {
    config.keyPrefix = `${ThrottlerModuleHelper.name}:`
    if (!ThrottlerModuleHelper.instance) {
      ThrottlerModuleHelper.instance = new ThrottlerModuleHelper()
      ThrottlerModuleHelper.instance.logger = new Logger(ThrottlerModule.name)
      ThrottlerModuleHelper.instance.initRedis = await initRedis({
        redisConfig: config,
        logger: ThrottlerModuleHelper.instance.logger,
      })
    }
    return ThrottlerModuleHelper.instance
  }
}

/** 节流模块 */
@Global()
@Module({
  imports: [
    nestThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { throttlersConfig, storageConfig } = configService.get<IThrottlerConfig>(THROTTLER_CONFIG_KEY)!
        const throttler2ModuleHelper = await ThrottlerModuleHelper.create(storageConfig as RedisOptions)
        const {
          initRedis: { redisClient },
        } = throttler2ModuleHelper
        if (!ThrottlerModuleHelper.redis) ThrottlerModuleHelper.redis = redisClient
        const storage = new ThrottlerStorageRedisService(redisClient as Redis)
        return {
          ...throttlersConfig,
          storage,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: THROTTLER_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        if (ThrottlerModuleHelper.redis) return ThrottlerModuleHelper.redis
        const { storageConfig } = configService.get<IThrottlerConfig>(THROTTLER_CONFIG_KEY)!
        const throttler2ModuleHelper = await ThrottlerModuleHelper.create(storageConfig as RedisOptions)
        const {
          initRedis: { redisClient },
        } = throttler2ModuleHelper
        ThrottlerModuleHelper.redis = redisClient
        return ThrottlerModuleHelper.redis
      },
      inject: [ConfigService],
    },
  ],
  // 导出redis实例
  exports: [nestThrottlerModule, THROTTLER_REDIS_CLIENT_TOKEN],
})
export class ThrottlerModule {}
