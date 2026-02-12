import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import type { IOKResponse } from '@packages/types'
import type { Response } from 'express'
import type { ILoggingCls } from '@/common/infra/logging'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { HttpStatus } from '@packages/types'
import { omit } from 'lodash-es'
import { ClsService } from 'nestjs-cls'
import { map, Observable } from 'rxjs'
import { IS_NO_FORMAT_KEY, LogContextClass } from '@/common/deco'
import { LoggingService } from '@/common/infra/logging'
import { ResVO } from '@/common/vo'

@Injectable()
@LogContextClass()
export class HttpInterceptor implements NestInterceptor {
  constructor(
    private readonly clsService: ClsService<ILoggingCls>,
    private readonly loggingService: LoggingService,
    private readonly reflector: Reflector,
  ) {}

  intercept<T>(context: ExecutionContext, next: CallHandler): Observable<Promise<IOKResponse<T>>> {
    this.loggingService.log('前置拦截器')
    const cxt = context.switchToHttp()
    const res = cxt.getResponse<Response>()
    if (res.statusCode === 201) res.statusCode = HttpStatus.OK
    const isNoFormat = this.reflector.getAllAndOverride<boolean>(IS_NO_FORMAT_KEY, [context.getHandler(), context.getClass()])
    return next.handle().pipe(
      map(async (data): Promise<IOKResponse<T>> => {
        LoggingService.setContext(`HttpInterceptor.intercept`)
        this.loggingService.log('后置拦截器')
        ResVO.setLoggerContext(this.clsService)
        if (isNoFormat) return data
        const VO = ResVO.success(data, this.clsService)
        /** 排除 data 字段(日志不记录) */
        const log = omit(VO, ['data'])
        this.loggingService.http(`${JSON.stringify(log)}`)
        return VO
      }),
    )
  }
}
