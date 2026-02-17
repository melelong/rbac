import Joi from 'joi'
import { BaseValidationSchema } from '../base'
import { IWinstonValidationSchema } from './IWinstonValidationSchema'
/** 日志类型 */
export const WINSTON_TYPE = ['app', 'http', 'orm', 'redis'] as const
/** 日志级别 */
export const WINSTON_LEVEL = ['error', 'warn', 'info', 'http', 'verbose', 'debug'] as const
/** 日志模式(none:关闭日志持久化 file:file日志，mongodb:mongodb日志,会自动降级(优先mongodb日志，下线则降级为file日志)) */
export const WINSTON_MODE = ['none', 'file', 'mongodb'] as const

export const DEFAULT_WINSTON_MODE: (typeof WINSTON_MODE)[number] = 'mongodb'
export const DEFAULT_WINSTON_LEVEL = 'info'
export const DEFAULT_WINSTON_FILE_DIRNAME = 'logs'
export const DEFAULT_WINSTON_FILE_FILENAME = '%DATE%'
export const DEFAULT_WINSTON_FILE_DATE_PATTERN = 'YYYY-MM-DD'
export const DEFAULT_WINSTON_FILE_ZIPPED_ARCHIVE = true
export const DEFAULT_WINSTON_FILE_MAX_SIZE = '5M'
export const DEFAULT_WINSTON_FILE_MAX_FILES = '2048'
export const DEFAULT_WINSTON_MONGODB_HOST = 'localhost'
export const DEFAULT_WINSTON_MONGODB_PORT = 27017
export const DEFAULT_WINSTON_MONGODB_DB = 'logging'
export const DEFAULT_WINSTON_MONGODB_USER_NAME = 'root'
export const DEFAULT_WINSTON_MONGODB_PASSWORD = 'Aa123456'
export const DEFAULT_WINSTON_MONGODB_AUTH_SOURCE = 'admin'
/** winston配置验证 */
export const WinstonValidationSchema = BaseValidationSchema.append<IWinstonValidationSchema>({
  WINSTON_MODE: Joi.string()
    .valid(...WINSTON_MODE)
    .empty('')
    .default(DEFAULT_WINSTON_MODE),
  WINSTON_LEVEL: Joi.string()
    .valid(...WINSTON_LEVEL)
    .empty('')
    .default(DEFAULT_WINSTON_LEVEL),
  WINSTON_FILE_DIRNAME: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_DIRNAME),
  WINSTON_FILE_FILENAME: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_FILENAME),
  WINSTON_FILE_DATE_PATTERN: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_DATE_PATTERN),
  WINSTON_FILE_ZIPPED_ARCHIVE: Joi.boolean().empty('').default(DEFAULT_WINSTON_FILE_ZIPPED_ARCHIVE),
  WINSTON_FILE_MAX_SIZE: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_MAX_SIZE),
  WINSTON_FILE_MAX_FILES: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_MAX_FILES),
  WINSTON_MONGODB_HOST: Joi.string().empty('').default(DEFAULT_WINSTON_MONGODB_HOST),
  WINSTON_MONGODB_PORT: Joi.number().empty('').default(DEFAULT_WINSTON_MONGODB_PORT),
  WINSTON_MONGODB_DB: Joi.string().empty('').default(DEFAULT_WINSTON_MONGODB_DB),
  WINSTON_MONGODB_USER_NAME: Joi.string().empty('').default(DEFAULT_WINSTON_MONGODB_USER_NAME),
  WINSTON_MONGODB_PASSWORD: Joi.string().empty('').default(DEFAULT_WINSTON_MONGODB_PASSWORD),
  WINSTON_MONGODB_AUTH_SOURCE: Joi.string().empty('').default(DEFAULT_WINSTON_MONGODB_AUTH_SOURCE),
})
