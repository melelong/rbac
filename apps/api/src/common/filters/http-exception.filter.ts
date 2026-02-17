import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'
import type { ILoggingCls } from '@/common/infra/logging'
import {
  BadRequestException,
  Catch,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { HttpStatus } from '@packages/types'
import { ClsService } from 'nestjs-cls'
import { LogContextClass } from '@/common/deco'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { LoggingService } from '@/common/infra/logging'
import { isType } from '@/common/utils'
import { ResVO } from '@/common/vo'

interface BusinessExceptionRes {
  /** 业务异常状态码 */
  code: string
  /** 业务异常消息 */
  message: string | string[]
}
@Catch(HttpException)
@LogContextClass()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly clsService: ClsService<ILoggingCls>,
    private readonly loggingService: LoggingService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.loggingService.log('http异常过滤器')
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    let status = exception.getStatus()
    let _code = String(status)
    let data = exception.getResponse() as string
    let isLogging = false
    ResVO.setLoggerContext(this.clsService)

    switch (true) {
      // 经常触发的错误，不记录日志
      case exception instanceof ThrottlerException: {
        data = ExceptionCodeTextMap[ExceptionCode.COMMON_TOO_MANY_REQUESTS][0]
        break
      }
      case exception instanceof UnauthorizedException: {
        data = ExceptionCodeTextMap[ExceptionCode.COMMON_UNAUTHORIZED][0]
        break
      }
      case exception instanceof ForbiddenException: {
        data = ExceptionCodeTextMap[ExceptionCode.COMMON_FORBIDDEN][0]
        break
      }
      case exception instanceof NotFoundException: {
        data = ExceptionCodeTextMap[ExceptionCode.COMMON_NOT_FOUND][0]
        break
      }
      case exception instanceof InternalServerErrorException: {
        data = ExceptionCodeTextMap[ExceptionCode.COMMON_INTERNAL_SERVER_ERROR][0]
        this.loggingService.error(exception.message, exception.stack, undefined, 'http')
        break
      }
      case exception instanceof BusinessException: {
        const { code, message } = exception.getResponse() as BusinessExceptionRes
        _code = code
        data = isType(message, 'Array') ? message[0] : (message as string)
        isLogging = true
        break
      }
      case exception instanceof BadRequestException: {
        const { message } = exception.getResponse() as BadRequestException
        data = isType(message, 'Array') ? message[0] : (message as string)
        break
      }
      // 处理未知的HTTP异常
      default: {
        status = status < 200 ? HttpStatus.INTERNAL_SERVER_ERROR : status
        this.loggingService.debug(String(status))
        this.loggingService.error(exception.message, exception.stack, undefined, 'http')
        break
      }
    }

    const VO = ResVO.error(res, this.clsService, _code, data)
    res.status(status < 200 ? 500 : status).json(VO)

    // 业务异常日志
    if (isLogging) this.loggingService.warn(JSON.stringify(VO), undefined, 'http')
  }
}
