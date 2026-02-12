import type { LoggerService } from '@nestjs/common'
import type { ClsStore } from 'nestjs-cls'
import type { Logger } from 'winston'

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
   * 设置上下文
   * @param context 上下文
   */
  // setContext: (context: string) => void
  /**
   * 设置控制台日志实例
   * @param logger 日志实例
   */
  setLogger: (logger: Logger) => void
  /**
   * 设置文件日志实例
   * @param logger 日志实例
   */
  setFileLogger: (logger: Logger | null) => void
  /**
   * 添加mongo日志实例
   * @param logger 日志实例
   */
  setMongoLogger: (logger: Logger | null) => void
  /**
   * 普通日志
   * @param message 日志信息
   * @param context 上下文
   */
  log: (message: string, context?: string) => void
  /**
   * 错误日志
   * @param message 日志信息
   * @param trace 错误信息
   * @param context 上下文
   */
  error: (message: string, trace?: string, context?: string) => void
  /**
   * 警告日志
   * @param message 日志信息
   * @param context 上下文
   */
  warn: (message: string, context?: string) => void
  /**
   * 调试日志
   * @param message 日志信息
   * @param context 上下文
   */
  debug: (message: string, context?: string) => void
  /**
   * 详细日志
   * @param message 日志信息
   * @param context 上下文
   */
  verbose: (message: string, context?: string) => void
  /**
   * HTTP日志
   * @param message 日志信息
   * @param context 上下文
   */
  http: (message: string, context?: string) => void
}
