import type { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'
import { CACHE_QUEUE_TOKEN } from '@/common/infra/queue'
import { CacheTemplate } from '@/common/template'

@Injectable()
@LogContextClass()
export class CacheService extends CacheTemplate {
  constructor(
    @Inject(CACHE_MANAGER) readonly cache: Cache,
    @InjectQueue(CACHE_QUEUE_TOKEN) readonly queue: Queue,
    public readonly loggingService: LoggingService,
  ) {
    super({ cache, queue, loggingService })
  }
}
