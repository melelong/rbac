import type { IQueueValidationSchema } from './IQueueValidationSchema'
import Joi from 'joi'
import { BaseValidationSchema } from '../base'

export const DEFAULT_QUEUE_REDIS_DB = 1
/** 队列配置验证 */
export const QueueValidationSchema = BaseValidationSchema.append<IQueueValidationSchema>({
  QUEUE_HOST: Joi.string(),
  QUEUE_PORT: Joi.number(),
  QUEUE_USERNAME: Joi.string(),
  QUEUE_PASSWORD: Joi.string(),
  QUEUE_REDIS_DB: Joi.number().min(0).max(15).empty('').default(DEFAULT_QUEUE_REDIS_DB),
})
