import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'
import type { ILoggingCls } from '@/common/infra/logging'
import { Catch } from '@nestjs/common'
import { HttpStatus } from '@packages/types'
import { ClsService } from 'nestjs-cls'
import { RedisError } from 'redis-errors'
import { LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'
import { ResVO } from '@/common/vo'

@Catch(RedisError)
@LogContextClass()
export class CacheExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly clsService: ClsService<ILoggingCls>,
    private readonly loggingService: LoggingService,
  ) {}

  catch(exception: RedisError, host: ArgumentsHost) {
    this.loggingService.log('缓存异常过滤器')
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    ResVO.setLoggerContext(this.clsService, CacheExceptionFilter.name)
    this.loggingService.error(exception.message, exception.stack)
    this.loggingService.debug(Object.prototype.toString.call(exception))
    const VO = ResVO.error(res, this.clsService, String(HttpStatus.INTERNAL_SERVER_ERROR))
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(VO)
  }
}
