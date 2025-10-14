import type { Request, Response } from 'express'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { ResFormat } from '@/common/response'
import { Logger2Service } from '@/infrastructure/logger2/logger2.service'

/** http异常过滤器 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger2Service: Logger2Service) {}

  async catch(exception: any, host: ArgumentsHost) {
    console.warn('HttpExceptionFilter')
    // http上下文
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    let data = exception.getResponse()
    switch (true) {
      // 高频的不记录日志
      case exception instanceof ThrottlerException: {
        data = '请求过于频繁，请稍后再试!!!'
        break
      }
      case exception instanceof UnauthorizedException: {
        data = '令牌已失效，请重新登录'
        break
      }
      default: {
        data = exception.getResponse()
        await this.logger2Service.action(response, exception)
      }
    }
    const VO = new ResFormat({ request, response, data, exception })

    response.status(status).json(VO)
  }
}
