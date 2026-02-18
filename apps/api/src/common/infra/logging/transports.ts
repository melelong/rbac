import type { IWinstonConfig, WINSTON_LEVEL, WINSTON_MODE, WINSTON_TYPE } from '@/config'
import { join } from 'node:path'
import chalk from 'chalk'
import { connect } from 'mongoose'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { mkdir } from '@/common/utils'
import { MONGO_CAPPED_CONFIG } from './constant'
import { LoggingService } from './logging.service'

/** 创建控制台日志 */
export function createConsoleTransport() {
  /** 定义日志级别颜色 */
  const LEVELS_COLORS = {
    info: 'green',
    error: 'red',
    warn: 'yellow',
    http: 'blue',
    verbose: 'cyan',
    debug: 'magenta',
  } as const
  return new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize({ colors: LEVELS_COLORS }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.ms(),
      winston.format.printf((info) => {
        const levelKey = Object.getOwnPropertySymbols(info)[0]
        const level = info[levelKey] as string
        // 获取日志级别的颜色
        const color = LEVELS_COLORS[level]
        const chalkColor = chalk[color]
        const chalkBg = chalk[`bg${color[0].toUpperCase()}${color.slice(1)}`]
        const appNameStr = chalkColor(`(${info.appName}:${info.pid})`)
        const contextStr = `${chalk.blackBright(`[${info.context}]`)}`
        const messageStr = chalkColor(`${info.message}`)
        const levelStr = chalkColor(`${(info.winstonType as string).toUpperCase()}:${info.isLog ? 'LOG' : level.toUpperCase()}`.padStart(12, ' '))
        const msStr = chalk.yellow(`${info.ms}`)
        return `${chalkBg(' ')}[${info.timestamp}] ${levelStr} ${appNameStr}${chalkBg(' ')}${contextStr} ${messageStr} ${msStr}`
      }),
    ),
  })
}

/** 创建日志级别过滤器 */
export function createLevelFilter(level: (typeof WINSTON_LEVEL)[number]) {
  return winston.format((info) => (info.level === level ? info : false))()
}
/** 创建日志类型过滤器 */
export function createTypeFilter(winstonType: (typeof WINSTON_TYPE)[number]) {
  return winston.format((info) => (info.winstonType === winstonType ? info : false))()
}

/** 创建文件日志降级过滤器 */
export function createFileDowngradeFilter(mode: (typeof WINSTON_MODE)[number]) {
  return winston.format((info) => {
    switch (mode) {
      case 'none':
        return false
      case 'file':
        return info
      case 'mongodb':
        if (LoggingService.MongoConnection && LoggingService.MongoConnection.readyState === 1) return false
        return info
    }
  })()
}

/** 创建MongoDB日志降级过滤器 */
export function createMongoDowngradeFilter(mode: (typeof WINSTON_MODE)[number]) {
  return winston.format((info) => {
    switch (mode) {
      case 'none':
        return false
      case 'file':
        return false
      case 'mongodb':
        if (LoggingService.MongoConnection && LoggingService.MongoConnection.readyState === 1) return info
        return false
    }
  })()
}

/** 创建MongoDB日志(主要日志持久化) */
export async function createMongoDBTransport(
  type: (typeof WINSTON_TYPE)[number],
  level: (typeof WINSTON_LEVEL)[number],
  mode: (typeof WINSTON_MODE)[number],
  config: IWinstonConfig['mongodbConfig'],
) {
  const { uri, db: dbName } = config
  if (!LoggingService.MongoConnection) {
    const mongoClient = await connect(uri, {
      autoIndex: false,
      serverSelectionTimeoutMS: 5000,
      heartbeatFrequencyMS: 10000,
      maxPoolSize: 50,
      minPoolSize: 10,
      maxIdleTimeMS: 60000,
      waitQueueTimeoutMS: 5000,
    })
    LoggingService.MongoConnection = mongoClient.connection
  }
  const format = [
    createLevelFilter(level),
    createTypeFilter(type),
    createMongoDowngradeFilter(mode),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.ms(),
    winston.format.json(),
  ]
  if (level === 'error') format.push(winston.format.errors({ stack: true }))
  return new winston.transports.MongoDB({
    level,
    db: Promise.resolve(LoggingService.MongoConnection.getClient()),
    collection: `${type}_${level}_log`,
    dbName,
    decolorize: true,
    capped: true,
    cappedSize: MONGO_CAPPED_CONFIG[type][level].sizeMB * 1024 * 1024,
    cappedMax: MONGO_CAPPED_CONFIG[type][level].maxDocs,
    silent: false,
    storeHost: true,
    name: `${type}_${level}_log`,
    format: winston.format.combine(...format),
  })
}

/** 创建文件日志 */
export function createFileTransport(
  type: (typeof WINSTON_TYPE)[number],
  level: (typeof WINSTON_LEVEL)[number],
  mode: (typeof WINSTON_MODE)[number],
  config: IWinstonConfig['fileConfig'],
) {
  const { dirname, datePattern, zippedArchive, maxSize, maxFiles } = config
  const _dirname = join(dirname, type, level as unknown as string)
  mkdir(_dirname)
  const format = [
    createLevelFilter(level),
    createTypeFilter(type),
    createFileDowngradeFilter(mode),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.ms(),
    winston.format.json(),
  ]
  if (level === 'error') format.push(winston.format.errors({ stack: true }))
  return new DailyRotateFile({
    level,
    dirname: _dirname,
    filename: `${level}/${level}-%DATE%.json`,
    datePattern,
    zippedArchive,
    maxSize,
    maxFiles,
    format: winston.format.combine(...format),
  })
}
