import type { RedisOptions } from 'ioredis'
import type { IInitRedisReturn, TRedis } from '@/common/utils'
import type { IQueueConfig } from '@/config'
import { BullModule } from '@nestjs/bullmq'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { initRedis } from '@/common/utils'
import { QUEUE_CONFIG_KEY } from '@/config'
import { CACHE_QUEUE_TOKEN, EMAIL_QUEUE_TOKEN, LOGGING_QUEUE_TOKEN, QUEUE_REDIS_CLIENT_TOKEN } from './constant'

export class QueueModuleHelper {
  public static instance: QueueModuleHelper
  public logger: Logger
  public initRedis: IInitRedisReturn
  public static redis: null | TRedis = null

  /**
   * 创建QueueModuleHelper实例
   * @param config Redis配置
   */
  public static async create(config: RedisOptions) {
    config.keyPrefix = `${QueueModuleHelper.name}:`
    if (!QueueModuleHelper.instance) {
      QueueModuleHelper.instance = new QueueModuleHelper()
      QueueModuleHelper.instance.logger = new Logger(QueueModule.name)
      QueueModuleHelper.instance.initRedis = await initRedis({
        redisConfig: config,
        logger: QueueModuleHelper.instance.logger,
      })
    }
    return QueueModuleHelper.instance
  }
}

/** 队列模块 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<IQueueConfig>(QUEUE_CONFIG_KEY)!
        const queueModuleHelper = await QueueModuleHelper.create(config.connection as RedisOptions)
        const {
          initRedis: { redisConfig, redisClient },
        } = queueModuleHelper
        if (!QueueModuleHelper.redis) QueueModuleHelper.redis = redisClient
        config.connection = redisConfig
        return config
      },
      inject: [ConfigService],
    }),
    /** 注册队列 */
    BullModule.registerQueueAsync(
      {
        name: CACHE_QUEUE_TOKEN,
      },
      {
        name: EMAIL_QUEUE_TOKEN,
      },
      {
        name: LOGGING_QUEUE_TOKEN,
      },
    ),
  ],
  providers: [
    {
      provide: QUEUE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        if (QueueModuleHelper.redis) return QueueModuleHelper.redis
        const config = configService.get<IQueueConfig>(QUEUE_CONFIG_KEY)!
        const queueModuleHelper = await QueueModuleHelper.create(config.connection as RedisOptions)
        const {
          initRedis: { redisClient },
        } = queueModuleHelper
        QueueModuleHelper.redis = redisClient
        return QueueModuleHelper.redis
      },
      inject: [ConfigService],
    },
  ],
  // 导出redis实例
  exports: [BullModule, QUEUE_REDIS_CLIENT_TOKEN],
})
export class QueueModule {}
