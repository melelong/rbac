import type { Queue } from 'bullmq'
import type Redis from 'ioredis'
import { InjectQueue } from '@nestjs/bullmq'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import { CacheTemplate } from '@/common/template'
import { CACHE_QUEUE_TOKEN } from '@/infrastructure/queues/queues.constant'
import { CACHE_REDIS_CLIENT_TOKEN } from './cache2.constant'

export class Cache2Service extends CacheTemplate {
  constructor(
    @Inject(CACHE_REDIS_CLIENT_TOKEN) readonly redis: Redis,
    @Inject(CACHE_MANAGER) readonly memory: Cache,
    @InjectQueue(CACHE_QUEUE_TOKEN) readonly cacheQueue: Queue,
  ) {
    super({
      className: Cache2Service.name,
      redis,
      memory,
      queue: cacheQueue,
    })
  }
}
