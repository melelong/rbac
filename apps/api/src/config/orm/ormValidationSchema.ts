import type { IOrmValidationSchema } from './IOrmValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

/** typeOrm配置相关 */
export const DEFAULT_ORM_TYPE = 'mysql'
export const DEFAULT_ORM_PORT = 3306
export const DEFAULT_ORM_HOST = '127.0.0.1'
export const DEFAULT_ORM_DATABASE = 'base'
export const DEFAULT_ORM_USERNAME = 'root'
export const DEFAULT_ORM_PASSWORD = 'Aa123456'
export const DEFAULT_ORM_POOL_SIZE = 10
export const DEFAULT_ORM_CONNECTOR_PACKAGE = 'mysql2'
export const DEFAULT_ORM_TIMEZONE = 'local'
export const DEFAULT_ORM_CHARSET = 'utf8mb4'
export const DEFAULT_ORM_EXTRA = {
  /** 连接池满时等待 */
  waitForConnections: true,
  /** 连接池大小(推荐数据库最大连接数的50-75%) */
  connectionLimit: 10,
  /** 最大空闲连接数，默认等于 `connectionLimit`,设置为0则不闲置连接超时 */
  maxIdle: 0,
  /** 空闲连接超时，以毫秒为单位，默认值为 60000 ms */
  idleTimeout: 60000,
  /** 日期字符串格式 */
  dateStrings: true,
  /** 等待队列长度(0=无限制) */
  queueLimit: 0,
  /** 开启KeepAlive */
  enableKeepAlive: true,
  /** 心跳检测初始延迟 */
  keepAliveInitialDelay: 0,
}
export const DEFAULT_ORM_SYNCHRONIZE = false
export const DEFAULT_ORM_AUTO_LOAD_ENTITIES = true
export const DEFAULT_ORM_LOGGING = false
export const DEFAULT_ORM_RETRY_ATTEMPTS = 50
export const DEFAULT_ORM_RETRY_DELAY = 3000
/** typeorm配置验证 */
export const OrmValidationSchema = BaseValidationSchema.append<IOrmValidationSchema>({
  ORM_TYPE: Joi.string().empty('').default(DEFAULT_ORM_TYPE),
  ORM_PORT: Joi.number().empty('').default(DEFAULT_ORM_PORT),
  ORM_HOST: Joi.string().empty('').default(DEFAULT_ORM_HOST),
  ORM_DATABASE: Joi.string().empty('').default(DEFAULT_ORM_DATABASE),
  ORM_USERNAME: Joi.string().empty('').default(DEFAULT_ORM_USERNAME),
  ORM_PASSWORD: Joi.string().empty('').default(DEFAULT_ORM_PASSWORD),
  ORM_POOL_SIZE: Joi.number().empty('').default(DEFAULT_ORM_POOL_SIZE),
  ORM_CONNECTOR_PACKAGE: Joi.string().empty('').default(DEFAULT_ORM_CONNECTOR_PACKAGE),
  ORM_TIMEZONE: Joi.string().empty('').default(DEFAULT_ORM_TIMEZONE),
  ORM_CHARSET: Joi.string().empty('').default(DEFAULT_ORM_CHARSET),
  ORM_SYNCHRONIZE: Joi.boolean().empty('').default(DEFAULT_ORM_SYNCHRONIZE),
  ORM_AUTO_LOAD_ENTITIES: Joi.boolean().empty('').default(DEFAULT_ORM_AUTO_LOAD_ENTITIES),
  ORM_LOGGING: Joi.boolean().empty('').default(DEFAULT_ORM_LOGGING),
  ORM_RETRY_ATTEMPTS: Joi.number().empty('').default(DEFAULT_ORM_RETRY_ATTEMPTS),
  ORM_RETRY_DELAY: Joi.number().empty('').default(DEFAULT_ORM_RETRY_DELAY),
})
