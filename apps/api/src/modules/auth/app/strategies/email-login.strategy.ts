import type { Request } from 'express'
import type { EmailLoginDTO } from '../dto'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { BusinessException, ExceptionCode, ExceptionCodeTextMap } from '@/common/exceptions'
import { REQ_CTX } from '@/common/infra'
import { UserDomainService } from '@/modules/rbac/user/domain'
import { CaptchaService } from '../../domain'

/** 邮箱登录策略 */
@Injectable()
export class EmailLoginStrategy extends PassportStrategy(Strategy, 'email-login') {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly captchaService: CaptchaService,
    private readonly clsService: ClsService,
    private readonly em: EntityManager,
  ) {
    super()
  }

  async validate(req: Request) {
    return await this.em.transaction(async (em: EntityManager) => {
      const { email, pwd, captcha } = req.body as EmailLoginDTO
      // 验证码校验
      const key = this.captchaService.getCaptchaKey({ type: 'email', name: 'login', id: email })
      await this.captchaService.validateCaptcha(key, captcha)
      // 用户校验
      const [user] = await this.userDomainService.getUsersByEmails([email], em)
      const compare = await this.userDomainService.comparePwd(pwd, user.salt, user.pwd)
      if (!compare) throw new BusinessException(ExceptionCode.AUTH_INCORRECT_PASSWORD, ExceptionCodeTextMap)
      const loginIp = this.clsService.get<string>(REQ_CTX.CLIENT_IP)
      const loginAt = new Date(this.clsService.get<string>(REQ_CTX.START_TIMESTAMP))
      user.loginIp = loginIp
      user.loginAt = loginAt
      await this.userDomainService.userRepo.patch([user], SYSTEM_DEFAULT_BY, em)
      this.clsService.set<string>(REQ_CTX.USER_ID, user.id)
      return true
    })
  }
}
