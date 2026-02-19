import type { Job } from 'bullmq'
import type SMTPConnection from 'nodemailer/lib/smtp-connection'
import type { IEmailJobData } from './IEmail'
import type { AppConfigType, EmailConfigType } from '@/config'
import { MailerService } from '@nestjs-modules/mailer'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { ConfigService } from '@nestjs/config'
import { LoggingService } from '@/common/infra/logging'
import { EMAIL_QUEUE_TOKEN } from '@/common/infra/queue'
import { APP_CONFIG_KEY, EMAIL_CONFIG_KEY, EMAIL_SERVICE_KEYS } from '@/config'

/** 邮件队列处理 */
@Processor(EMAIL_QUEUE_TOKEN)
export class EmailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly logging: LoggingService,
  ) {
    super()
  }

  /** 处理 */
  async process(job: Job<IEmailJobData>) {
    const { name: appName } = this.configService.get<AppConfigType>(APP_CONFIG_KEY)!
    const { transports } = this.configService.get<EmailConfigType>(EMAIL_CONFIG_KEY)!
    let lastError: Error | null = null
    const { fromName, ...data } = job.data
    for (const transport of EMAIL_SERVICE_KEYS) {
      try {
        const res = await this.mailerService.sendMail({
          transporterName: transport,
          ...data,
          from: `"${appName ?? 'test'}" <${(transports![transport] as SMTPConnection.Options)?.auth?.user}>`,
          sender: `${fromName ?? 'test'}`,
          date: new Date(),
        })
        await job.log(JSON.stringify(res))
        return
      } catch (error) {
        lastError = error
        this.logging.error(`邮件发送失败:${error.message}`, EmailProcessor.name)
        await job.log(`邮件发送失败:${error.message}`)
      }
    }
    if (lastError) throw lastError
  }
}
