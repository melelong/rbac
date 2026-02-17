import type { WINSTON_LEVEL, WINSTON_MODE } from './winstonValidationSchema'

/** winston配置验证接口 */
export interface IWinstonValidationSchema {
  WINSTON_MODE: (typeof WINSTON_MODE)[number]
  WINSTON_LEVEL: (typeof WINSTON_LEVEL)[number]
  WINSTON_FILE_DIRNAME: string
  WINSTON_FILE_FILENAME: string
  WINSTON_FILE_DATE_PATTERN: string
  WINSTON_FILE_ZIPPED_ARCHIVE: boolean
  WINSTON_FILE_MAX_SIZE: string
  WINSTON_FILE_MAX_FILES: string
  WINSTON_MONGODB_HOST: string
  WINSTON_MONGODB_PORT: number
  WINSTON_MONGODB_DB: string
  WINSTON_MONGODB_USER_NAME: string
  WINSTON_MONGODB_PASSWORD: string
  WINSTON_MONGODB_AUTH_SOURCE: string
}
