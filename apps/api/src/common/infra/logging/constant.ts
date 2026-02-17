/** http日志上下文 */
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
/** mongodb capped collection 配置 */
export const MONGO_CAPPED_CONFIG: Record<
  string,
  Record<
    string,
    {
      sizeMB: number
      maxDocs: number
    }
  >
> = {
  app: {
    error: { sizeMB: 200, maxDocs: 50000 },
    warn: { sizeMB: 120, maxDocs: 30000 },
    info: { sizeMB: 80, maxDocs: 20000 },
    verbose: { sizeMB: 60, maxDocs: 10000 },
    http: { sizeMB: 20, maxDocs: 5000 },
  },
  orm: {
    error: { sizeMB: 150, maxDocs: 50000 },
    warn: { sizeMB: 90, maxDocs: 30000 },
    info: { sizeMB: 60, maxDocs: 20000 },
    verbose: { sizeMB: 45, maxDocs: 10000 },
    http: { sizeMB: 15, maxDocs: 5000 },
  },
  http: {
    error: { sizeMB: 100, maxDocs: 50000 },
    warn: { sizeMB: 60, maxDocs: 30000 },
    info: { sizeMB: 40, maxDocs: 20000 },
    verbose: { sizeMB: 30, maxDocs: 10000 },
    http: { sizeMB: 10, maxDocs: 5000 },
  },
  redis: {
    error: { sizeMB: 50, maxDocs: 50000 },
    warn: { sizeMB: 30, maxDocs: 30000 },
    info: { sizeMB: 20, maxDocs: 20000 },
    verbose: { sizeMB: 15, maxDocs: 10000 },
    http: { sizeMB: 5, maxDocs: 5000 },
  },
}
