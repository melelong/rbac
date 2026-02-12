import type { ApiResponseOptions } from '@nestjs/swagger'
import type { IOKResponse } from '@packages/types'
import type { Response } from 'express'
import type { ClsService } from 'nestjs-cls'
import { ApiSchema, getSchemaPath } from '@nestjs/swagger'
import { HttpStatus } from '@packages/types'
import dayjs from 'dayjs'
import { COMMAND_VO, SYSTEM_EXCEPTION_MSG } from '@/common/constants'
import { LoggingService, REQ_CTX } from '@/common/infra'

@ApiSchema({ description: '响应格式化' })
export class ResVO<T = any> implements IOKResponse<T> {
  /**
   * 业务码
   * @example '0'
   * @examples ['0', 'AUTH_000', '500']
   */
  code: string
  /**
   * 业务信息
   * @example '操作成功'
   * @examples ['操作成功', '业务错误信息']
   */
  msg: string
  /**
   * 业务数据(对象或数组)
   */
  data: any | T
  /**
   * 请求地址
   * @example 'xxx'
   */
  originUrl: string
  /**
   * 请求源
   * @example 'xxx'
   */
  referer: string
  /**
   * 客户端信息
   * @example 'xxx'
   */
  userAgent: string
  /**
   * 时间戳
   * @example 1672531200000
   */
  timestamp: number
  /**
   * 客户端IP
   * @example 'xxx'
   */
  clientIp: string
  /**
   * 构建成功响应体
   * @param data 响应数据
   * @param clsService 上下文服务
   */
  public static success<T = any>(data: T, clsService: ClsService): ResVO<T> {
    let VO = new ResVO<T>()
    VO.code = '0'
    VO.msg = COMMAND_VO
    VO.data = data
    VO = Object.assign(VO, this.getClsInfo(clsService))
    return VO
  }

  /**
   * 构建成功Swagger ApiResponseOptions配置
   * @param VO VO类
   */
  public static SwaggerSuccess(VO?: new (...args: any[]) => any, isArray: boolean = false): ApiResponseOptions {
    return {
      status: HttpStatus.OK,
      schema: VO
        ? {
            allOf: [
              { $ref: getSchemaPath(ResVO) },
              {
                properties: {
                  data: isArray
                    ? {
                        type: 'array',
                        items: {
                          $ref: getSchemaPath(VO),
                        },
                      }
                    : { $ref: getSchemaPath(VO) },
                },
              },
            ],
          }
        : { allOf: [{ $ref: getSchemaPath(ResVO) }, { properties: { data: { example: [] } } }] },
    }
  }

  /**
   * 构建错误响应体
   * @param res 响应对象
   * @param clsService 上下文服务
   * @param code 错误码
   * @param msg 错误信息
   */
  public static error<T = any>(
    res: Response,
    clsService: ClsService,
    code: string = String(res.statusCode),
    msg: string = SYSTEM_EXCEPTION_MSG,
  ): ResVO<T> {
    let VO = new ResVO<T>()
    VO.code = String(code) ?? String(HttpStatus.INTERNAL_SERVER_ERROR)
    VO.msg = msg
    VO.data = []
    VO = Object.assign(VO, this.getClsInfo(clsService))
    return VO
  }

  /**
   * 构建错误Swagger ApiResponseOptions配置
   */
  public static SwaggerError(status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, msg: string = SYSTEM_EXCEPTION_MSG): ApiResponseOptions {
    return {
      status,
      schema: {
        allOf: [{ $ref: getSchemaPath(ResVO) }, { properties: { code: { example: String(status) }, msg: { example: msg }, data: { example: [] } } }],
      },
    }
  }

  /**
   * 构建上下文信息
   * @param clsService 上下文服务
   */
  public static getClsInfo(clsService: ClsService) {
    return {
      originUrl: clsService.get<string>(REQ_CTX.ORIGIN_URL),
      referer: clsService.get<string>(REQ_CTX.REFERER),
      userAgent: clsService.get<string>(REQ_CTX.USER_AGENT),
      timestamp: dayjs().valueOf(),
      clientIp: clsService.get<string>(REQ_CTX.CLIENT_IP),
    }
  }

  /**
   * 设置日志上下文
   * @param clsService 上下文服务
   * @param context 日志上下文
   */
  public static setLoggerContext(clsService: ClsService, context?: string) {
    if (context) return LoggingService.setContext(context)
    const originUrl = clsService.get(REQ_CTX.ORIGIN_URL)
    const method = clsService.get(REQ_CTX.METHOD)
    LoggingService.setContext(`${method} - ${originUrl}`)
  }
}
