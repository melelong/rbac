/** 日志类型 */
export const LOGGING_TYPES = {
  /** 正常请求 */
  NORMAL_REQUEST: ['正常请求', 'info'],
  /** 业务异常 */
  BUSINESS_ERROR: ['业务异常', 'warn'],
  /** 内置HTTP异常 */
  BUILTIN_HTTP_ERROR: ['内置HTTP异常', 'warn'],
  /** 手动系统异常 */
  MANUAL_SYSTEM_ERROR: ['手动系统异常', 'error'],
  /** 非手动系统异常 */
  AUTO_SYSTEM_ERROR: ['非手动系统异常', 'error'],
  /** 未知异常 */
  UNKNOWN_ERROR: ['未知异常', 'error'],
} as const
/** 日志上下文 */
export const LOGGING_CLS = {
  /** 用户ID */
  USER_ID: 'USER_ID',
  /** 响应对象 */
  RESPONSE: 'RESPONSE',
  /** 客户端IP */
  CLIENT_IP: 'CLIENT_IP',
  /** 请求方法 */
  METHOD: 'METHOD',
  /** 开始时间戳 */
  START_TIMESTAMP: 'START_TIMESTAMP',
  /** 请求url */
  ORIGIN_URL: 'ORIGIN_URL',
  /** 来源 */
  REFERER: 'REFERER',
  /** 客户端信息 */
  USER_AGENT: 'USER_AGENT',
} as const
