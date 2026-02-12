import type { ExecutionContext } from '@nestjs/common'
import type { Request as ExpressRequest } from 'express'
import type Redis from 'ioredis'
import { Inject, Injectable } from '@nestjs/common'
import { ThrottlerGuard as nestThrottlerGuard } from '@nestjs/throttler'
// import { ExceptionCode, ExceptionCodeTextMap, ThrottlerException } from '@/common/exceptions'
import { THROTTLER_REDIS_CLIENT_TOKEN } from '@/common/infra/throttler'
import { getClientIp, redisIsOk } from '@/common/utils'

/** 节流守卫 */
@Injectable()
export class ThrottlerGuard extends nestThrottlerGuard {
  @Inject(THROTTLER_REDIS_CLIENT_TOKEN)
  private readonly throttlerRedis: Redis

  /** 重写获取原始IP */
  protected async getTracker(req: ExpressRequest): Promise<string> {
    return getClientIp(req)
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 节流器依赖的redis断开,不走节流逻辑
    // if (!RedisModule.redisIsOk(this.throttlerRedis)) throw new ThrottlerException(ExceptionCode.THROTTLER_SERVICE_ERROR, ExceptionCodeTextMap)
    if (redisIsOk(this.throttlerRedis)) return true
    return super.canActivate(context)
  }
}
