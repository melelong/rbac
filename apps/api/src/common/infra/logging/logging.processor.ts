import type { Job } from 'bullmq'
import type { Logger } from 'winston'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { LogContextClass } from '@/common/deco'
import { LOGGING_QUEUE_TOKEN } from '@/common/infra/queue'
import { LoggingService } from './logging.service'

/** 传给日志任务队列的数据格式 */
export interface ILoggingJobData {
  /** 日志服务方法名 */
  fnName: keyof Logger
  /** 参数 */
  args: [string, ...any[]]
}
/** 日志队列处理 */
@Processor(LOGGING_QUEUE_TOKEN)
@LogContextClass()
export class LoggingProcessor extends WorkerHost {
  constructor(private readonly loggingService: LoggingService) {
    super()
  }

  async process(job: Job<ILoggingJobData>) {
    try {
      const { fnName, args } = job.data
      LoggingService.Logger![fnName](...args)
      await job.log(`延迟写入日志成功`)
    } catch (error) {
      this.loggingService.error(`延迟写入日志失败:${error.message}`)
      await job.log(`延迟写入日志失败:${error.message}`)
      throw error
    }
  }
}
