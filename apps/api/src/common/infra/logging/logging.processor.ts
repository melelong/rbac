import type { Job } from 'bullmq'
import type { LEVEL_TYPE } from '@/config'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { LogContextClass } from '@/common/deco'
import { LOGGING_QUEUE_TOKEN } from '@/common/infra/queue'
import { LoggingService } from './logging.service'
/** 传给日志任务队列的数据格式 */
export interface ILoggingJobData {
  /** 日志上下文 */
  context: string
  /** 日志内容 */
  message: string
  /** 日志级别 */
  level: (typeof LEVEL_TYPE)[number]
}
/** 日志队列处理 */
@Processor(LOGGING_QUEUE_TOKEN)
@LogContextClass()
export class LoggingProcessor extends WorkerHost {
  constructor(private readonly loggingService: LoggingService) {
    super()
  }

  async process(job: Job) {
    try {
      const { context, level, message } = job.data as ILoggingJobData
      this.loggingService[level](message, context)
      await job.log(`延迟写入日志成功`)
    } catch (error) {
      this.loggingService.error(`延迟写入日志失败:${error.message}`)
      await job.log(`延迟写入日志失败:${error.message}`)
      throw error
    }
  }
}
