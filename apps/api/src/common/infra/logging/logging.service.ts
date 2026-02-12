import type { OnApplicationBootstrap } from '@nestjs/common'
import type { Logger, LoggerOptions } from 'winston'
import type { ILoggingService } from './ILogging'
import * as process from 'node:process'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createLogger } from 'winston'
import { consoleWinstonConfig, WINSTON_CONFIG_KEY } from '@/config'

@Injectable()
export class LoggingService implements ILoggingService, OnApplicationBootstrap {
  static context: string = 'Application'
  protected logger: Logger
  protected fileLogger: Logger | null
  protected mongoLogger: Logger | null
  @Inject(ConfigService)
  private readonly configService: ConfigService

  constructor() {
    this.logger = createLogger({
      level: 'info',
      transports: [consoleWinstonConfig()],
      exitOnError: false,
    })
  }

  onApplicationBootstrap() {
    const config = this.configService.get<LoggerOptions>(WINSTON_CONFIG_KEY)!
    this.fileLogger = createLogger(config)
  }

  public static setContext(context: string) {
    LoggingService.context = context
  }

  public setLogger(logger: Logger) {
    this.logger = logger
  }

  public setFileLogger(logger: Logger | null) {
    this.fileLogger = logger
  }

  public setMongoLogger(logger: Logger | null) {
    this.mongoLogger = logger
  }

  log(message: string, context?: string) {
    const logContext = `PID:${process.pid}:${context || LoggingService.context}`
    this.logger.info(message, { context: logContext, isLog: true })
    if (this.fileLogger && !this.mongoLogger) this.fileLogger.info(message, { context: logContext, isLog: true })
    if (this.mongoLogger) this.mongoLogger.info(message, { context: logContext, isLog: true })
  }

  error(message: string, trace?: string, context?: string) {
    const logContext = `PID:${process.pid}:${context || LoggingService.context}`
    this.logger.error(message, { context: logContext, trace })
    if (this.fileLogger && !this.mongoLogger) this.fileLogger.error(message, { context: logContext, trace })
    if (this.mongoLogger) this.mongoLogger.error(message, { context: logContext, trace })
  }

  warn(message: string, context?: string) {
    const logContext = `PID:${process.pid}:${context || LoggingService.context}`
    this.logger.warn(message, { context: logContext })
    if (this.fileLogger && !this.mongoLogger) this.fileLogger.warn(message, { context: logContext })
    if (this.mongoLogger) this.mongoLogger.warn(message, { context: logContext })
  }

  debug(message: string, context?: string) {
    const logContext = `PID:${process.pid}:${context || LoggingService.context}`
    this.logger.debug(message, { context: logContext })
    if (this.fileLogger && !this.mongoLogger) this.fileLogger.debug(message, { context: logContext })
    if (this.mongoLogger) this.mongoLogger.debug(message, { context: logContext })
  }

  verbose(message: string, context?: string) {
    const logContext = `PID:${process.pid}:${context || LoggingService.context}`
    this.logger.verbose(message, { context: logContext })
    if (this.fileLogger && !this.mongoLogger) this.fileLogger.verbose(message, { context: logContext })
    if (this.mongoLogger) this.mongoLogger.verbose(message, { context: logContext })
  }

  http(message: string, context?: string) {
    const logContext = `PID:${process.pid}:${context || LoggingService.context}`
    this.logger.http(message, { context: logContext })
    if (this.fileLogger && !this.mongoLogger) this.fileLogger.http(message, { context: logContext })
    if (this.mongoLogger) this.mongoLogger.http(message, { context: logContext })
  }
}
