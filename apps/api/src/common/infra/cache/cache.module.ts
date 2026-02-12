import type { RedisOptions } from 'ioredis'
import type { Redis as IOValkey } from 'iovalkey'
import type { IInitRedisReturn, TRedis } from '@/common/utils'
import type { ICacheConfig } from '@/config'
import KeyvValkey from '@keyv/valkey'
import { CacheModule as nestCacheModule } from '@nestjs/cache-manager'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KeyvCacheableMemory } from 'cacheable'
import { Keyv } from 'keyv'
import { initRedis } from '@/common/utils'
import { CACHE_CONFIG_KEY } from '@/config'
import { CacheProcessor } from './cache.processor'
import { CacheService } from './cache.service'
import { CACHE_REDIS_CLIENT_TOKEN } from './constant'

export class CacheModuleHelper {
  public static instance: CacheModuleHelper
  public logger: Logger
  public initRedis: IInitRedisReturn
  public static redis: null | TRedis = null

  /**
   * 创建CacheModuleHelper实例
   * @param config Redis配置
   */
  public static async create(config: RedisOptions) {
    if (!CacheModuleHelper.instance) {
      CacheModuleHelper.instance = new CacheModuleHelper()
      CacheModuleHelper.instance.logger = new Logger(CacheModule.name)
      CacheModuleHelper.instance.initRedis = await initRedis({
        redisConfig: config,
        logger: CacheModuleHelper.instance.logger,
      })
    }
    return CacheModuleHelper.instance
  }
}

/** 缓存模块 */
@Global()
@Module({
  imports: [
    /** 双缓存模块 */
    nestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const { memory, redis: { ttl, ...config } } = configService.get<ICacheConfig>(CACHE_CONFIG_KEY)!
        /** L1 内存缓存 */
        const L1 = new Keyv({ store: new KeyvCacheableMemory({ ttl: memory.ttl, lruSize: memory.lruSize }) })
        /** L2 Redis 缓存 */
        const cacheModuleHelper = await CacheModuleHelper.create(config as RedisOptions)
        const {
          initRedis: { redisClient },
        } = cacheModuleHelper
        if (!CacheModuleHelper.redis) CacheModuleHelper.redis = redisClient
        const store = new KeyvValkey(CacheModuleHelper.redis as IOValkey, { useRedisSets: false })
        const L2 = new Keyv({ store })
        return {
          stores: [L1, L2],
          ttl,
          nonBlocking: true,
          refreshAllStores: true,
          refreshThreshold: memory.ttl * 0.1,
          cacheId: CacheModule.name,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: CACHE_REDIS_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        if (CacheModuleHelper.redis) return CacheModuleHelper.redis
        const { redis: { ttl: _, ...storageConfig } } = configService.get<ICacheConfig>(CACHE_CONFIG_KEY)!
        const throttler2ModuleHelper = await CacheModuleHelper.create(storageConfig)
        const {
          initRedis: { redisClient },
        } = throttler2ModuleHelper
        CacheModuleHelper.redis = redisClient
        return CacheModuleHelper.redis
      },
      inject: [ConfigService],
    },
    CacheService,
    CacheProcessor,
  ],
  exports: [CacheService, CacheProcessor, CACHE_REDIS_CLIENT_TOKEN],
})
export class CacheModule {

}
