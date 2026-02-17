import type mongoose from 'mongoose'
import type { Logger } from 'winston'
import type { ILoggingService } from './ILogging'
import type { IWinstonConfig, WINSTON_MODE, WINSTON_TYPE } from '@/config'
import { pid } from 'node:process'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import winston, { createLogger } from 'winston'
import { DEFAULT_APP_NAME, WINSTON_CONFIG_KEY } from '@/config'

/** 应用日志服务 */
@Injectable()
export class LoggingService implements ILoggingService {
  /** 日志上下文 */
  public static context: string = 'Application'
  /** winston实例 */
  public static Logger: Logger | null
  /** 日志模式 */
  public static mode: (typeof WINSTON_MODE)[number]
  /** 日志模块的 MongoDB 连接 */
  public static MongoConnection: mongoose.Connection | null = null
  /** 应用名称 */
  public static appName: string = DEFAULT_APP_NAME

  constructor(private readonly configService: ConfigService) {
    const { mode } = this.configService.get<IWinstonConfig>(WINSTON_CONFIG_KEY)!
    LoggingService.mode = mode
  }

  log(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    LoggingService.Logger!.info(message, { context, isLog: true, pid, appName: LoggingService.appName, winstonType })
  }

  error(message: string, trace?: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    LoggingService.Logger!.error(message, { context, pid, appName: LoggingService.appName, trace, winstonType })
  }

  warn(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    LoggingService.Logger!.warn(message, { context, pid, appName: LoggingService.appName, winstonType })
  }

  debug(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    LoggingService.Logger!.debug(message, { context, pid, appName: LoggingService.appName, winstonType })
  }

  verbose(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    LoggingService.Logger!.verbose(message, { context, pid, appName: LoggingService.appName, winstonType })
  }

  fatal(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    LoggingService.Logger!.http(message, { context, pid, appName: LoggingService.appName, winstonType })
  }

  public static setContext(context: string) {
    LoggingService.context = context
  }

  public static setAppName(appName: string) {
    LoggingService.appName = appName
  }

  /** 创建winston实例 */
  public static createLogger(options?: winston.LoggerOptions) {
    if (LoggingService.Logger) return LoggingService.Logger
    LoggingService.Logger = createLogger(options)
    return LoggingService.Logger
  }
}
