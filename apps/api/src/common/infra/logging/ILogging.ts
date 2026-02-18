import type { LoggerService } from '@nestjs/common'
import type { ClsStore } from 'nestjs-cls'
import type { ILoggingJobData } from './logging.processor'
import type { WINSTON_TYPE } from '@/config'

export interface ILoggingCls extends ClsStore {
  /** 用户ID */
  USER_ID: string
  /** 客户端IP */
  CLIENT_IP: string
  /** 请求方法 */
  METHOD: string
  /** 开始时间戳 */
  START_TIMESTAMP: number
  /** 请求url */
  ORIGIN_URL: string
  /** 来源 */
  REFERER: string
  /** 客户端信息 */
  USER_AGENT: string
}

export interface ILoggingService extends LoggerService {
  /**
   * 普通日志
   * @param message 日志信息
   * @param context 上下文
   * @param type 日志类型
   */
  log: (message: string, context?: string, type?: (typeof WINSTON_TYPE)[number]) => void
  /**
   * 错误日志
   * @param message 日志信息
   * @param trace 错误堆栈信息
   * @param context 上下文
   * @param type 日志类型
   */
  error: (message: string, trace?: string, context?: string, type?: (typeof WINSTON_TYPE)[number]) => void
  /**
   * 警告日志
   * @param message 日志信息
   * @param context 上下文
   * @param type 日志类型
   */
  warn: (message: string, context?: string, type?: (typeof WINSTON_TYPE)[number]) => void
  /**
   * 调试日志
   * @param message 日志信息
   * @param context 上下文
   * @param type 日志类型
   */
  debug: (message: string, context?: string, type?: (typeof WINSTON_TYPE)[number]) => void
  /**
   * 详细日志
   * @param message 日志信息
   * @param context 上下文
   * @param type 日志类型
   */
  verbose: (message: string, context?: string, type?: (typeof WINSTON_TYPE)[number]) => void
  /**
   * 致命错误日志
   * @param message 日志信息
   * @param context 上下文
   * @param type 日志类型
   */
  fatal: (message: string, context?: string, type?: (typeof WINSTON_TYPE)[number]) => void
  /** 记录日志(自动队列redis状态来判断直接记录还是记录到队列) */
  record: (loggingJobData: ILoggingJobData) => void
}
