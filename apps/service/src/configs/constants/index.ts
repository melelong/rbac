import type { LOGGER_MODE } from '../interfaces'

/** app配置相关 */
export const DEFAULT_APP_NAME = 'NestApp'
export const DEFAULT_APP_PORT = 4001
export const DEFAULT_APP_HOSTNAME = '0.0.0.0'
export const DEFAULT_APP_GLOBAL_PREFIX = ''
export const DEFAULT_APP_SALT = 'NEST_APP_SALT'
export const DEFAULT_APP_SUPER_ADMIN_NAME = 'superAdmin'
export const DEFAULT_APP_ADMIN_NAME = 'admin'
export const DEFAULT_APP_USER_NAME = 'user'
/** cors配置相关 */
export const DEFAULT_CORS_ENABLED = true
export const DEFAULT_CORS_ORIGINS = 'http://127.0.0.1:4002,http://localhost:4002'
export const DEFAULT_CORS_METHODS = 'GET,PATCH,POST,DELETE,HEAD,OPTIONS'
export const DEFAULT_CORS_ALLOWED_HEADERS = 'Content-Type,Authorization'
export const DEFAULT_CORS_CREDENTIALS = true
export const DEFAULT_CORS_MAX_AGE = 3600
/** helmet配置相关 */
export const DEFAULT_HELMET_ENABLED = true
export const DEFAULT_HELMET_CROSS_ORIGIN_OPENER_POLICY = 'same-origin-allow-popups'
export const DEFAULT_HELMET_CROSS_ORIGIN_RESOURCE_POLICY = false
export const DEFAULT_HELMET_CONTENT_SECURITY_POLICY = false
/** swagger配置相关 */
export const DEFAULT_SWAGGER_ENABLED = true
export const DEFAULT_SWAGGER_TAG = DEFAULT_APP_NAME
export const DEFAULT_SWAGGER_TITLE = DEFAULT_APP_NAME
export const DEFAULT_SWAGGER_DESCRIPTION = `${DEFAULT_SWAGGER_TITLE} API description`
export const DEFAULT_SWAGGER_VERSION = '1.0.0'
export const DEFAULT_SWAGGER_IGNORE_GLOBAL_PREFIX = false
export const DEFAULT_SWAGGER_PATH = 'api-docs'
/** redis配置相关 */
export const DEFAULT_REDIS_HOST = '127.0.0.1'
export const DEFAULT_REDIS_PORT = 6379
export const DEFAULT_REDIS_USERNAME = 'default'
export const DEFAULT_REDIS_PASSWORD = 'Aa123456'
export const DEFAULT_REDIS_ENABLE_AUTO_PIPELINING = true
export const DEFAULT_REDIS_COMMAND_TIMEOUT = 20000
export const DEFAULT_REDIS_CONNECT_TIMEOUT = 20000
export const DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE = true
export const DEFAULT_REDIS_KEEP_ALIVE = 3000
/** cache配置相关 */
export const DEFAULT_CACHE_TTL = 7 * 1000
export const DEFAULT_CACHE_MEMORY_NAME = 'MEMORY'
export const DEFAULT_CACHE_MEMORY_MAX = 500
export const DEFAULT_CACHE_MEMORY_TTL = DEFAULT_CACHE_TTL
export const DEFAULT_CACHE_REDIS_DB = 2
export const DEFAULT_CACHE_REDIS_TTL = DEFAULT_CACHE_TTL
/** captcha配置相关 */
export const DEFAULT_CAPTCHA_REDIS_DB = 3
/** jwt配置相关 */
export const DEFAULT_JWT_SECRET = DEFAULT_APP_NAME
export const DEFAULT_JWT_EXPIRES_IN = '30m'
export const DEFAULT_JWT_REDIS_DB = 4
export const DEFAULT_JWT_ACCESS_TOKEN_EXPIRES_IN = '15m'
export const DEFAULT_JWT_REFRESH_TOKEN_EXPIRES_IN = '7d'
export const DEFAULT_JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN = 15 * 60 * 1000
export const DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000
/** queue配置相关 */
export const DEFAULT_QUEUE_REDIS_DB = 1
/** throttler配置相关 */
export const DEFAULT_THROTTLER_REDIS_DB = 0
export const DEFAULT_THROTTLER_DEFAULT_NAME = 'default'
export const DEFAULT_THROTTLER_DEFAULT_TTL = 60000
export const DEFAULT_THROTTLER_DEFAULT_LIMIT = 50
export const DEFAULT_THROTTLER_STRICT_NAME = 'strict'
export const DEFAULT_THROTTLER_STRICT_TTL = 1000
export const DEFAULT_THROTTLER_STRICT_LIMIT = 3
export const DEFAULT_THROTTLER_LONG_NAME = 'long'
export const DEFAULT_THROTTLER_LONG_TTL = 3600000
export const DEFAULT_THROTTLER_LONG_LIMIT = 1000
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
/** 邮箱配置相关 */
export const DEFAULT_EMAIL_HOST = 'smtp.qq.com'
export const DEFAULT_EMAIL_PORT = 587
export const DEFAULT_EMAIL_SECURE = false
export const DEFAULT_EMAIL_TEMPLATE_DIR = 'templates'
/** 日志配置相关 */
export const DEFAULT_LOGGER_MODE: (typeof LOGGER_MODE)[number] = 'mongodb'
export const DEFAULT_LOGGER_LEVEL = 'info'
export const DEFAULT_LOGGER_FILE_DIRNAME = 'logs'
export const DEFAULT_LOGGER_FILE_FILENAME = '%DATE%'
export const DEFAULT_LOGGER_FILE_DATE_PATTERN = 'YYYY-MM-DD'
export const DEFAULT_LOGGER_FILE_ZIPPED_ARCHIVE = true
export const DEFAULT_LOGGER_FILE_MAX_SIZE = '5M'
export const DEFAULT_LOGGER_FILE_MAX_FILES = '204'
