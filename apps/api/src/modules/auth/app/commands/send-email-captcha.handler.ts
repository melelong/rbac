import type { ICommandHandler } from '@nestjs/cqrs'
import type { TCaptchaName } from '../../domain/services/ICaptchaService'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { LogContextMethod } from '@/common/deco'
import { CaptchaService } from '../../domain'
import { SendEmailCaptchaCommand } from './send-email-captcha.command'

/** 发送邮件验证码Handler */
@CommandHandler(SendEmailCaptchaCommand)
export class SendEmailCaptchaHandler implements ICommandHandler<SendEmailCaptchaCommand> {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: SendEmailCaptchaCommand) {
    const { name, email } = command
    await this.captchaService.generateEmailCaptcha(name as TCaptchaName, { to: email, subject: `${name}验证码`, template: 'Captcha' })
    return []
  }
}
