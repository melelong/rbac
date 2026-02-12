import type { Request } from 'express'
import type { EmailRegisterDTO } from '../dto'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { CaptchaService } from '../../domain'

/** 邮箱注册策略 */
@Injectable()
export class EmailRegisterStrategy extends PassportStrategy(Strategy, 'email-register') {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly clsService: ClsService,
  ) {
    super()
  }

  async validate(req: Request) {
    const { email, captcha } = req.body as EmailRegisterDTO
    // 验证码校验
    const key = this.captchaService.getCaptchaKey({ type: 'email', name: 'register', id: email })
    await this.captchaService.validateCaptcha(key, captcha)
    return true
  }
}
