import type { Queue } from 'bullmq'
import type { Response } from 'express'
import type Redis from 'ioredis'
import type { MongoDBTransportInstance } from 'winston-mongodb'
import type { IInitMongoDBOptions, ILogger2JobData, ILoggerCls, ILoggerInfo, ILoggerService } from './ILogger2'
import type { WinstonLogger } from './logger2.util'
import type { ILoggerConfig } from '@/configs'
import { join } from 'node:path'
import { InjectQueue } from '@nestjs/bullmq'
import { HttpException, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpStatus } from '@packages/types'
import dayjs from 'dayjs'
import { MongoClient } from 'mongodb'
import { ClsService } from 'nestjs-cls'
import DailyRotateFile from 'winston-daily-rotate-file'
import { MongoDB } from 'winston-mongodb'
import { BusinessException, SystemException } from '@/common/exceptions'
import { isType, mkdir } from '@/common/utils'
import { LOGGER_CONFIG_KEY } from '@/configs'
import { LEVEL_TYPE, LOGGER_MODE } from '@/configs/interfaces'
import { LOGGER_QUEUE_TOKEN, QUEUE_REDIS_CLIENT_TOKEN } from '@/infrastructure/queues/queues.constant'
import { redisIsOk } from '@/infrastructure/redis/redis.utils'
import { LOGGER2_SERVICE_TOKEN, LOGGER_CLS, LOGGER_TYPES } from './logger2.constant'
import { createTransportFormat } from './logger2.util'

@Injectable()
export class Logger2Service implements ILoggerService {
  /** 文件日志配置 */
  fileTransports: DailyRotateFile[] = []
  /** mongodb日志配置 */
  mongoDBTransport: MongoDBTransportInstance | null = null
  /** logger配置 */
  loggerConfig: ILoggerConfig
  /** mongodb实例 */
  mongoDBClient: MongoClient | null = null
  constructor(
    @Inject(LOGGER2_SERVICE_TOKEN) private readonly _logger: WinstonLogger,
    @InjectQueue(LOGGER_QUEUE_TOKEN)
    private readonly loggerQueue: Queue,
    @Inject(QUEUE_REDIS_CLIENT_TOKEN) private readonly queueRedis: Redis,
    private readonly clsService: ClsService<ILoggerCls>,
    private readonly configService: ConfigService,
  ) {
    this.loggerConfig = this.configService.get<ILoggerConfig>(LOGGER_CONFIG_KEY)!
    this.initMode()
  }

  initMode() {
    const { mode } = this.loggerConfig
    // none
    if (mode === LOGGER_MODE[0]) this.warn('日志持久化服务已关闭', Logger2Service.name)
    // file
    if (mode === LOGGER_MODE[1]) return this.addFileTransport([this.createFileTransport('info'), this.createFileTransport('error')])
    // mongodb
    // if (mode === LOGGER_MODE[2]) this.addMongoDBTransport('info')
  }

  // 文件日志相关
  createFileTransport(level: (typeof LEVEL_TYPE)[number]) {
    const { dirname, filename, datePattern, maxSize, maxFiles, zippedArchive } = this.loggerConfig.fileConfig
    const _dirname = join(dirname, level as unknown as string)
    mkdir(_dirname)
    return new DailyRotateFile({
      level: level as unknown as string,
      dirname: _dirname,
      filename: `${filename}.${level}.json`,
      datePattern,
      zippedArchive,
      maxSize,
      maxFiles,
      format: createTransportFormat(),
    })
  }

  async addFileTransport(fileTransports: DailyRotateFile[]) {
    console.warn(this.addFileTransport.name)
    if (this.fileTransports.length === 0) {
      fileTransports.forEach((item) => {
        this.fileTransports.push(item)
        this.logger.add(item)
      })
    }
  }

  async removeAllFileTransport() {
    console.warn(this.removeAllFileTransport.name)
    if (this.fileTransports.length > 0) {
      this.fileTransports.forEach((item) => {
        this.logger.remove(item)
        item.destroy()
      })
      this.fileTransports.length = 0
    }
  }

  // mongodb日志相关
  async initMongoDB(url: string, options?: IInitMongoDBOptions, reconnectInterval: number = 5000): Promise<MongoClient> {
    if (!this.mongoDBClient) {
      console.warn(this.initMongoDB.name)
      this.mongoDBClient = new MongoClient(url, options)
      this.mongoDBClient.on('connectionPoolClosed', async () => {
        this.warn('connectionPoolClosed事件触发: MongoDB连接池已关闭', Logger2Service.name)
      })

      this.mongoDBClient.on('connectionReady', async (info) => {
        this.warn(`connectionReady事件触发：mongodb日志连接${info.connectionId}成功`, Logger2Service.name)
        console.warn(!!this.mongoDBTransport)
        // 连接成功,升级为mongodb日志
        await this.removeAllFileTransport()
      })

      this.mongoDBClient.on('connectionClosed', async (info) => {
        this.warn(`connectionClosed事件触发:MongoDB连接${info.connectionId}已关闭`, Logger2Service.name)
      })

      // 中途重连
      this.mongoDBClient.on('connectionPoolCleared', async () => {
        this.warn('connectionPoolCleared事件触发：MongoDB连接池已清空，自动降级到文件日志', Logger2Service.name)

        // 降级为文件日志
        await this.addFileTransport([this.createFileTransport('info'), this.createFileTransport('error')])
        // await this.removeMongoDBTransport()
        // 重试
        // await this.initMongoDB(url, options, reconnectInterval)
      })
    }
    try {
      await this.mongoDBClient.connect()
      return this.mongoDBClient
    } catch (error) {
      // 重写winston-mongodb的重连逻辑(原来的重连逻辑只是在初始化连接时有重试10秒，连接成功后中途断开没有重试，而且重试间隔是固定的)
      if (!isType(reconnectInterval, 'Number')) throw new SystemException({ error })
      if (
        Object.is(Number.NaN, reconnectInterval) ||
        Object.is(reconnectInterval, +Infinity) ||
        Object.is(reconnectInterval, -Infinity) ||
        reconnectInterval < 5000
      ) {
        throw new SystemException({ error: new Error(`mongodb reconnectInterval must be greater than 5000`) })
      }
      // console.error(error)
      console.warn(`winston-mongodb将在 ${reconnectInterval} ms后重试`)

      // 初始化重连,降级为文件日志
      await this.removeMongoDBTransport()
      await this.addFileTransport([this.createFileTransport('info'), this.createFileTransport('error')])

      return new Promise((resolve) => setTimeout(resolve, reconnectInterval)).then(() => this.initMongoDB(url, options, reconnectInterval))
    }
  }

  async addMongoDBTransport(level: (typeof LEVEL_TYPE)[number]) {
    console.warn(this.addMongoDBTransport.name)
    // const { cappedMax } = this.loggerConfig.mongodbConfig
    const url = `mongodb://root:Aa123456@localhost:27017/logs?authSource=admin&retryWrites=true&retryReads=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=5000&socketTimeoutMS=0&heartbeatFrequencyMS=4000&maxPoolSize=10&minPoolSize=2`
    await this.initMongoDB(url)
    this.mongoDBTransport = new MongoDB({
      db: Promise.resolve(this.mongoDBClient),
      name: level,
      collection: `${level}-logs`,
      // cappedMax,
      // leaveConnectionOpen: false,
      level,
      silent: false,
      format: createTransportFormat(),
    })
    this.logger.add(this.mongoDBTransport)
  }

  async removeMongoDBTransport() {
    console.warn(this.removeMongoDBTransport.name)
    if (this.mongoDBTransport) {
      this.logger.remove(this.mongoDBTransport!)
      this.mongoDBTransport = null
    }
    if (this.mongoDBClient) {
      this.mongoDBClient.close(true)
      this.mongoDBClient = null
    }
  }

  log(message: string, context: string) {
    this._logger.log(message, context)
  }

  error(message: string, context: string) {
    this._logger.error(message, context)
  }

  warn(message: string, context: string) {
    this._logger.warn(message, context)
  }

  info(message: string, context: string) {
    this._logger.info(message, context)
  }

  http(message: string, context: string) {
    this._logger.http(message, context)
  }

  verbose(message: string, context: string) {
    this._logger.verbose(message, context)
  }

  debug(message: string, context: string) {
    this._logger.debug(message, context)
  }

  /** winston日志记录器实例 */
  get logger() {
    return this._logger.logger
  }

  getLoggerInfo(response: Response): ILoggerInfo {
    const status = response.statusCode
    const requestId = this.clsService.getId()
    const userInfo = this.clsService.get(LOGGER_CLS.USER_INFO)
    const clientIp = this.clsService.get(LOGGER_CLS.CLIENT_IP)
    const method = this.clsService.get(LOGGER_CLS.METHOD)
    const startTimestamp = this.clsService.get(LOGGER_CLS.START_TIMESTAMP)
    const endTimestamp = dayjs().valueOf()
    const originUrl = this.clsService.get(LOGGER_CLS.ORIGIN_URL)
    const referer = this.clsService.get(LOGGER_CLS.REFERER)
    const userAgent = this.clsService.get(LOGGER_CLS.USER_AGENT)
    const executionTime = `${dayjs(endTimestamp).diff(dayjs(startTimestamp), 'millisecond', true)}ms`

    return {
      requestId,
      userInfo: userInfo ?? {},
      clientIp,
      method,
      startTimestamp,
      endTimestamp,
      originUrl,
      referer,
      userAgent,
      status,
      executionTime,
      type: null,
      msg: '',
      stack: '',
    }
  }

  getLogger2JobData(response: Response, exception?: unknown): ILogger2JobData {
    const loggerInfo = this.getLoggerInfo(response)
    const context = `${loggerInfo.originUrl}` || Logger2Service.name
    let loggerType: keyof typeof LOGGER_TYPES
    let status: number = response.statusCode
    let msg: string = ''
    let stack: string = ''
    switch (true) {
      // 正常请求
      case !exception: {
        loggerType = 'NORMAL_REQUEST'
        break
      }
      // 业务异常
      case exception instanceof BusinessException: {
        loggerType = 'BUSINESS_ERROR'
        const res = exception.getResponse() as any
        status = exception.getStatus()
        msg = Array.isArray(res.message) ? res.message[0] : res.message
        break
      }
      // 内置HTTP异常
      case exception instanceof HttpException: {
        loggerType = 'BUILTIN_HTTP_ERROR'
        const res = exception.getResponse() as any
        status = exception.getStatus()
        msg = Array.isArray(res.message) ? res.message[0] : res.message
        break
      }
      // 手动系统异常
      case exception instanceof SystemException: {
        loggerType = 'MANUAL_SYSTEM_ERROR'
        status = HttpStatus.INTERNAL_SERVER_ERROR
        msg = exception.message
        stack = exception?.stack ?? ''
        break
      }
      // 非手动系统异常
      case exception instanceof Error: {
        loggerType = 'AUTO_SYSTEM_ERROR'
        status = HttpStatus.INTERNAL_SERVER_ERROR
        msg = exception.message
        stack = exception?.stack ?? ''
        break
      }
      // 未知异常
      default: {
        loggerType = 'UNKNOWN_ERROR'
        status = HttpStatus.INTERNAL_SERVER_ERROR
        msg = (exception as Error).message
        stack = (exception as Error).stack ?? ''
      }
    }
    loggerInfo.type = LOGGER_TYPES[loggerType][0]
    loggerInfo.status = status
    loggerInfo.msg = msg
    loggerInfo.stack = stack
    return {
      context,
      message: JSON.stringify(loggerInfo),
      level: LOGGER_TYPES[loggerType][1],
    }
  }

  async action(response: Response, exception?: unknown) {
    try {
      const jobData = this.getLogger2JobData(response, exception)
      if (redisIsOk(this.queueRedis)) {
        await this.loggerQueue.add('action', jobData, {
          /** 失败重试 */
          attempts: 3,
          /** 指数退避重试 */
          backoff: { type: 'exponential', delay: 1000 },
        })
      } else {
        const { context, level, message } = jobData
        this[level](message, context)
      }
      return true
    } catch (error) {
      throw new SystemException({ error })
    }
  }
}
