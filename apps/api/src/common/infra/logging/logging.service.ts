import type mongoose from 'mongoose'
import type { Logger } from 'winston'
import type { ILoggingJobData, ILoggingService } from './ILogging'
import type { WINSTON_TYPE } from '@/config'
import { pid } from 'node:process'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import winston, { createLogger } from 'winston'
import { redisIsOk } from '@/common/utils'
import { DEFAULT_APP_NAME } from '@/config'
import { LOGGING_QUEUE_TOKEN, QueueModuleHelper } from '../queue'

/** 应用日志服务 */
@Injectable()
export class LoggingService implements ILoggingService {
  /** 日志上下文 */
  public static context: string = 'Application'
  /** winston实例 */
  public static Logger: Logger | null
  /** 日志模块的 MongoDB 连接 */
  public static MongoConnection: mongoose.Connection | null = null
  /** 应用名称 */
  public static appName: string = DEFAULT_APP_NAME

  constructor(@InjectQueue(LOGGING_QUEUE_TOKEN) private readonly loggingQueue: Queue<ILoggingJobData>) {}
  record(loggingJobData: ILoggingJobData) {
    const { fnName, args } = loggingJobData
    redisIsOk(QueueModuleHelper.redis!)
      ? this.loggingQueue.add(
          'delayedLog',
          { fnName, args },
          {
            /** 失败重试 */
            attempts: 3,
            /** 指数退避重试 */
            backoff: { type: 'exponential', delay: 500 },
          },
        )
      : LoggingService.Logger![fnName](...args)
  }

  log(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    const args: [string, ...any[]] = [message, { context, isLog: true, pid, appName: LoggingService.appName, winstonType }]
    this.record({ args, fnName: 'info' })
  }

  error(message: string, trace?: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    const args: [string, ...any[]] = [message, { context, pid, appName: LoggingService.appName, trace, winstonType }]
    this.record({ args, fnName: 'error' })
  }

  warn(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    const args: [string, ...any[]] = [message, { context, pid, appName: LoggingService.appName, winstonType }]
    this.record({ args, fnName: 'warn' })
  }

  debug(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    const args: [string, ...any[]] = [message, { context, pid, appName: LoggingService.appName, winstonType }]
    this.record({ args, fnName: 'debug' })
  }

  verbose(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    const args: [string, ...any[]] = [message, { context, pid, appName: LoggingService.appName, winstonType }]
    this.record({ args, fnName: 'verbose' })
  }

  fatal(message: string, context?: string, winstonType: (typeof WINSTON_TYPE)[number] = 'app') {
    context = `${context || LoggingService.context}`
    const args: [string, ...any[]] = [message, { context, pid, appName: LoggingService.appName, winstonType }]
    this.record({ args, fnName: 'http' })
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
