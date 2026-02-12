import type { Logger } from '@nestjs/common'
import type { RedisClient } from 'bullmq'
import type { Cluster, RedisOptions } from 'ioredis'
import { Redis as IORedis } from 'ioredis'
import { Redis as IOValkey } from 'iovalkey'
import {
  DEFAULT_REDIS_COMMAND_TIMEOUT,
  DEFAULT_REDIS_CONNECT_TIMEOUT,
  DEFAULT_REDIS_ENABLE_AUTO_PIPELINING,
  DEFAULT_REDIS_ENABLE_OFFLINE_QUEUE,
  DEFAULT_REDIS_KEEP_ALIVE,
} from '@/config'

export type TRedis = IORedis | Cluster | IOValkey | RedisClient
export interface IInitRedisReturn {
  /** redis实例 */
  redisClient: TRedis
  /** redis配置对象 */
  redisConfig: RedisOptions
}

/** 初始化Redis客户端配置 */
export interface IInitRedisOptions {
  /** Redis客户端配置对象 */
  redisConfig: RedisOptions
  /** 日志服务 */
  logger?: Logger
  /** 是否为keyv(默认false) */
  isKeyv?: boolean
}
/** redis动态连接模块配置 */
export interface IRedisModuleOptions {
  /** 返回redisClient的配置 */
  useFactory: (...args: any[]) => Promise<RedisOptions>
  /** 是否为全局模块 */
  isGlobal?: boolean
  inject?: any[]
  /** redisClient服务的token */
  redisClientToken: string | symbol
  /** 为哪些service模块提供redisClient */
  serviceClass: any[]
  /** 日志实例 */
  logger?: Logger
}

/**
 * 初始化Redis客户端
 * @param options 初始化Redis客户端配置
 * @returns 返回初始化后的Redis客户端实例
 */
export async function initRedis(options: IInitRedisOptions): Promise<IInitRedisReturn> {
  const { redisConfig, logger, isKeyv = false } = options
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
  const Redis = isKeyv ? IOValkey : IORedis
  const redisClient = new Redis(redisConfig)
  if (logger) {
    const redisInfo: string = `redis${redisConfig.db} `
    redisClient.on('end', () => logger.warn(`${redisInfo}连接已手动关闭`))
    redisClient.on('connect', () => logger.verbose(`${redisInfo}连接成功`))
    redisClient.on('error', (error) => logger.error(`${redisInfo}${error.message}`))
    redisClient.on('connecting', () => logger.log(`${redisInfo}连接中...`))
    redisClient.on('reconnecting', () => logger.log(`${redisInfo}重新连接中...`))
    redisClient.on('close', () => logger.warn(`${redisInfo}连接已关闭`))
  }
  return { redisClient, redisConfig }
}

/**
 * 判断当前redis实例是否可用
 * @param redisClient redis实例
 */
export function redisIsOk(redisClient: TRedis) {
  return redisClient.status === 'ready'
}
