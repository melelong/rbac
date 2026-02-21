import type { Job } from 'bullmq'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { LogContextClass } from '@/common/deco'
import { LOGGING_QUEUE_TOKEN } from '@/common/infra/queue'
import { ILoggingJobData } from './ILogging'
import { LoggingService } from './logging.service'

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
    } catch (err) {
      this.loggingService.error(`延迟写入日志失败:${err.message}`, err.stack)
      await job.log(`延迟写入日志失败:${err.message}`)
      throw err
    }
  }
}
