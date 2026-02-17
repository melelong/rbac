import type { ConfigType } from '@nestjs/config'
import type { WINSTON_MODE } from './winstonValidationSchema'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { WinstonValidationSchema } from './winstonValidationSchema'

/** winston配置key */
export const WINSTON_CONFIG_KEY = 'WINSTON_CONFIG_KEY'
export interface IFileConfig {
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
export interface IMongodbConfig {
  /** 主机 */
  host: string
  /** 数据库 */
  db: string
  /** 端口 */
  port: number
  /** 用户名 */
  userName: string
  /** 密码 */
  password: string
  /** 认证数据库 */
  authSource: string
  /** 连接uri */
  uri: string
}
/** winston配置接口 */
export interface IWinstonConfig {
  /** 日志级别 */
  level: string
  /** 日志模式 */
  mode: (typeof WINSTON_MODE)[number]
  /** 文件日志配置 */
  fileConfig: IFileConfig
  /** mongodb日志配置 */
  mongodbConfig: IMongodbConfig
}

/** winston配置 */
export const WinstonConfig = registerAs(WINSTON_CONFIG_KEY, (): IWinstonConfig => {
  const { error, value } = WinstonValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${WinstonConfig.name}:${error.message}`)
  return {
    level: value.WINSTON_LEVEL,
    mode: value.WINSTON_MODE,
    fileConfig: {
      dirname: value.WINSTON_FILE_DIRNAME,
      filename: value.WINSTON_FILE_FILENAME,
      datePattern: value.WINSTON_FILE_DATE_PATTERN,
      zippedArchive: value.WINSTON_FILE_ZIPPED_ARCHIVE,
      maxSize: value.WINSTON_FILE_MAX_SIZE,
      maxFiles: value.WINSTON_FILE_MAX_FILES,
    },
    mongodbConfig: {
      host: value.WINSTON_MONGODB_HOST,
      port: value.WINSTON_MONGODB_PORT,
      db: value.WINSTON_MONGODB_DB,
      userName: value.WINSTON_MONGODB_USER_NAME,
      password: value.WINSTON_MONGODB_PASSWORD,
      authSource: value.WINSTON_MONGODB_AUTH_SOURCE,
      uri: `mongodb://${encodeURIComponent(value.WINSTON_MONGODB_USER_NAME)}:${encodeURIComponent(value.WINSTON_MONGODB_PASSWORD)}@${value.WINSTON_MONGODB_HOST}:${value.WINSTON_MONGODB_PORT}/${value.WINSTON_MONGODB_DB}?authSource=${value.WINSTON_MONGODB_AUTH_SOURCE}`,
    },
  }
})
/** winston配置类型 */
export type WinstonConfigType = ConfigType<typeof WinstonConfig>
