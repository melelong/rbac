import type { RedisClient } from 'bullmq'
import type { Cluster, RedisOptions } from 'ioredis'
import type { WinstonLogger } from '@/infrastructure/logger2/logger2.util'
import { Redis } from 'ioredis'
import {
  DEFAULT_REDIS_COMMAND_TIMEOUT,
  DEFAULT_REDIS_CONNECT_TIMEOUT,
  DEFAULT_REDIS_ENABLE_AUTO_PIPELINING,
  DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE,
  DEFAULT_REDIS_KEEP_ALIVE,
} from '@/configs'

export interface IInitRedisReturn {
  /** redis实例 */
  redisClient: Redis | Cluster
  /** redis配置对象 */
  redisConfig: RedisOptions
}

/** 初始化Redis客户端配置 */
export interface IInitRedisOptions {
  /** Redis客户端配置对象 */
  redisConfig: RedisOptions
  /** 日志服务 */
  logger?: WinstonLogger
  /** 日志上下文 */
  loggerContext?: string
}
/**
 * 初始化Redis客户端
 * @param options 初始化Redis客户端配置
 * @returns 返回初始化后的Redis客户端实例
 */
export async function initRedis(options: IInitRedisOptions): Promise<IInitRedisReturn> {
  const { redisConfig, loggerContext, logger } = options
  /** 统一配置 */
  redisConfig!.enableAutoPipelining = DEFAULT_REDIS_ENABLE_AUTO_PIPELINING
  redisConfig!.commandTimeout = DEFAULT_REDIS_COMMAND_TIMEOUT
  redisConfig!.connectTimeout = DEFAULT_REDIS_CONNECT_TIMEOUT
  redisConfig!.enableOfflineQueue = DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE
  redisConfig!.keepAlive = DEFAULT_REDIS_KEEP_ALIVE
  redisConfig!.autoResubscribe = true
  redisConfig!.maxRetriesPerRequest = null
  redisConfig!.retryStrategy = (times) => {
    return Math.min(times * 50, 2000)
  }
  redisConfig!.reconnectOnError = (error) => {
    const recoverableErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT']
    return recoverableErrors.some((e) => error.message.includes(e))
  }
  const redisClient = new Redis(redisConfig)
  if (logger && loggerContext) {
    const redisInfo: string = `redis${redisConfig.db} `
    redisClient.on('end', () => logger.log(`${redisInfo}连接已手动关闭`, loggerContext))
    redisClient.on('connect', () => logger.log(`${redisInfo}连接成功`, loggerContext))
    redisClient.on('error', (error) => logger.log(`${redisInfo}${error.message}`, loggerContext))
    redisClient.on('connecting', () => logger.log(`${redisInfo}连接中...`, loggerContext))
    redisClient.on('reconnecting', () => logger.log(`${redisInfo}重新连接中...`, loggerContext))
    redisClient.on('close', () => logger.log(`${redisInfo}连接已关闭`, loggerContext))
  }
  return { redisClient, redisConfig }
}

/**
 * 判断当前redis实例是否可用
 * @param redisClient redis实例
 */
export function redisIsOk(redisClient: Redis | RedisClient) {
  return redisClient.status === 'ready' || redisClient.status === 'connect'
}
