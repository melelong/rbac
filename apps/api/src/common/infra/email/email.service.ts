import type { IEmailJobData, IEmailService } from './IEmail'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { LogContextMethod } from '@/common/deco'
import { ExceptionCode, ExceptionCodeTextMap, QueueException } from '@/common/exceptions'
import { LoggingService } from '@/common/infra/logging'
import { EMAIL_QUEUE_TOKEN, QueueModuleHelper } from '@/common/infra/queue'
import { redisIsOk } from '@/common/utils'

/** 邮件服务实现 */
@Injectable()
export class EmailService implements IEmailService {
  constructor(
    @InjectQueue(EMAIL_QUEUE_TOKEN) private readonly emailQueue: Queue<IEmailJobData>,
    private readonly logging: LoggingService,
  ) {}

  @LogContextMethod()
  async sendEmail<T = any>(options: IEmailJobData<T>) {
    if (!redisIsOk(QueueModuleHelper.redis!)) throw new QueueException(ExceptionCode.QUEUE_SERVICE_ERROR, ExceptionCodeTextMap)
    await this.emailQueue.add(`${options.to}`, options, {
      /** 失败重试 */
      attempts: 3,
      /** 指数退避重试 */
      backoff: { type: 'exponential', delay: 1000 },
    })
    return true
  }
}
