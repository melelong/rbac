/** 用于注入redis实例的key */
export const QUEUE_REDIS_CLIENT_TOKEN = Symbol('QUEUE_REDIS_CLIENT_TOKEN')
/** 注册的缓存队列名(提供给其他模块获取队列实例) */
export const CACHE_QUEUE_TOKEN = 'cache'
/** 注册的邮箱队列名(提供给其他模块获取队列实例) */
export const EMAIL_QUEUE_TOKEN = 'email'
/** 注册的日志队列名(提供给其他模块获取队列实例) */
export const LOGGING_QUEUE_TOKEN = 'logger'
