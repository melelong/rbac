/** 级别类型 */
export const LEVEL_TYPE = ['error', 'warn', 'info', 'http', 'verbose', 'debug'] as const
/** 日志模式(none:关闭日志持久化 file:file日志，mongodb:mongodb日志,会自动降级(优先mongodb日志，下线则降级为file日志)) */
export const WINSTON_MODE = ['none', 'file', 'mongodb'] as const
/** winston配置验证接口 */
export interface IWinstonValidationSchema {
  WINSTON_MODE: (typeof WINSTON_MODE)[number]
  WINSTON_LEVEL: (typeof LEVEL_TYPE)[number]
  WINSTON_FILE_DIRNAME: string
  WINSTON_FILE_FILENAME: string
  WINSTON_FILE_DATE_PATTERN: string
  WINSTON_FILE_ZIPPED_ARCHIVE: boolean
  WINSTON_FILE_MAX_SIZE: string
  WINSTON_FILE_MAX_FILES: string
  WINSTON_MONGODB: string
}
