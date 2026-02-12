/** 请求上下文 */
export const REQ_CTX = {
  /** 用户ID */
  USER_ID: 'USER_ID',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_INFO: 'REFRESH_INFO',
  ACCESS_INFO: 'ACCESS_INFO',
  /** 响应对象 */
  RESPONSE: 'RESPONSE',
  // 日志相关
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
