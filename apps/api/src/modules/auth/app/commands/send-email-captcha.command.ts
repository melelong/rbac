import type { CaptchaNameDTO, EmailCaptchaDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 发送邮件验证码Command */
export class SendEmailCaptchaCommand extends Command<never[]> {
  constructor(
    public readonly name: CaptchaNameDTO['name'],
    public readonly email: EmailCaptchaDTO['email'],
  ) {
    super()
  }
}
