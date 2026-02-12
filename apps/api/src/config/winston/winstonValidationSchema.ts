import Joi from 'joi'
import { BaseValidationSchema } from '../base'
import { IWinstonValidationSchema, LEVEL_TYPE, WINSTON_MODE } from './IWinstonValidationSchema'

export const DEFAULT_WINSTON_MODE: (typeof WINSTON_MODE)[number] = 'mongodb'
export const DEFAULT_WINSTON_LEVEL = 'info'
export const DEFAULT_WINSTON_FILE_DIRNAME = 'logs'
export const DEFAULT_WINSTON_FILE_FILENAME = '%DATE%'
export const DEFAULT_WINSTON_FILE_DATE_PATTERN = 'YYYY-MM-DD'
export const DEFAULT_WINSTON_FILE_ZIPPED_ARCHIVE = true
export const DEFAULT_WINSTON_FILE_MAX_SIZE = '5M'
export const DEFAULT_WINSTON_FILE_MAX_FILES = '204'
/** winston配置验证 */
export const WinstonValidationSchema = BaseValidationSchema.append<IWinstonValidationSchema>({
  WINSTON_MODE: Joi.string()
    .valid(...WINSTON_MODE)
    .empty('')
    .default(DEFAULT_WINSTON_MODE),
  WINSTON_LEVEL: Joi.string()
    .valid(...LEVEL_TYPE)
    .empty('')
    .default(DEFAULT_WINSTON_LEVEL),
  WINSTON_FILE_DIRNAME: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_DIRNAME),
  WINSTON_FILE_FILENAME: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_FILENAME),
  WINSTON_FILE_DATE_PATTERN: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_DATE_PATTERN),
  WINSTON_FILE_ZIPPED_ARCHIVE: Joi.boolean().empty('').default(DEFAULT_WINSTON_FILE_ZIPPED_ARCHIVE),
  WINSTON_FILE_MAX_SIZE: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_MAX_SIZE),
  WINSTON_FILE_MAX_FILES: Joi.string().empty('').default(DEFAULT_WINSTON_FILE_MAX_FILES),
})
