import type { ConfigType } from '@nestjs/config'
import type { LoggerOptions } from 'winston'
import type { IWinstonValidationSchema, LEVEL_TYPE, WINSTON_MODE } from './IWinstonValidationSchema'
import { join } from 'node:path'
import * as process from 'node:process'
import { Logger } from '@nestjs/common'
import { registerAs } from '@nestjs/config'
import chalk from 'chalk'
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { mkdir } from '@/common/utils'
import { WinstonValidationSchema } from './winstonValidationSchema'

/** winston配置key */
export const WINSTON_CONFIG_KEY = 'WINSTON_CONFIG_KEY'

/** winston配置接口 */
export interface IWinstonConfig {
  /** 日志级别 */
  level: string
  /** 日志模式 */
  mode: (typeof WINSTON_MODE)[number]
  /** 文件日志配置 */
  fileConfig: {
    /** 日志目录名 */
    dirname: string
    /** 日志文件名 */
    filename: string
    /** 日期格式 */
    datePattern: string
    /** 是否压缩归档 */
    zippedArchive: boolean
    /** 日志文件分片最大尺寸 */
    maxSize: string
    /** 日志文件保留天数或日志文件最大数量 */
    maxFiles: string
  }
  /** mongodb配置 */
  mongodbConfig: any
}
/** 控制台日志 */
export function consoleWinstonConfig(name: string = 'Nest') {
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
        const appStr = chalkColor(`[${name}]`)
        const pidStr = chalkColor(`${process.pid}  -`)
        const contextStr = chalk.yellow(`[${info.context}]`)
        const messageStr = chalkColor(`${info.message}`)
        const levelStr = chalkColor(`${(info.isLog ? 'LOG' : level.toUpperCase()).padStart(8, ' ')}`)
        const msStr = chalk.yellow(`${info.ms}`)
        return `${appStr} ${pidStr} ${info.timestamp}${levelStr} ${contextStr} ${messageStr} ${msStr}`
      }),
    ),
  })
}
// 创建自定义过滤器函数
export function levelFilter(level: string) {
  return winston.format((info) => {
    return info.level === level ? info : false
  })()
}
const logger = new Logger('WinstonConfig')
/**
 * 文件日志配置
 * @param level 日志级别
 * @param value 日志配置
 */
export function fileWinstonConfig(level: (typeof LEVEL_TYPE)[number], value: IWinstonValidationSchema) {
  const _dirname = join(value.WINSTON_FILE_DIRNAME, level as unknown as string)
  mkdir(_dirname)
  const format = [levelFilter(level), winston.format.timestamp()]
  level === 'error' ? format.push(winston.format.errors({ stack: true }), winston.format.json()) : format.push(winston.format.json())
  logger.log(`${level}类型文件日志目录:${_dirname}`)
  return new DailyRotateFile({
    level,
    dirname: _dirname,
    filename: `${level}/${level}-%DATE%.json`,
    datePattern: value.WINSTON_FILE_DATE_PATTERN,
    zippedArchive: value.WINSTON_FILE_ZIPPED_ARCHIVE,
    maxSize: value.WINSTON_FILE_MAX_SIZE,
    maxFiles: value.WINSTON_FILE_MAX_FILES,
    format: winston.format.combine(...format),
  })
}

/** winston配置 */
export const WinstonConfig = registerAs(WINSTON_CONFIG_KEY, (): LoggerOptions => {
  const { error, value } = WinstonValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${WinstonConfig.name}:${error.message}`)
  return {
    level: value.WINSTON_LEVEL,
    transports: [
      fileWinstonConfig('error', value),
      fileWinstonConfig('verbose', value),
      fileWinstonConfig('warn', value),
      fileWinstonConfig('http', value),
    ],
    exitOnError: false,
  }
})
/** winston配置类型 */
export type WinstonConfigType = ConfigType<typeof WinstonConfig>
