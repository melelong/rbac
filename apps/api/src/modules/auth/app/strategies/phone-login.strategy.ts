import type { Request } from 'express'
import type { PhoneLoginDTO } from '../dto'
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

/** 手机号登录策略 */
@Injectable()
export class PhoneLoginStrategy extends PassportStrategy(Strategy, 'phone-login') {
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
      const { phone, pwd, captcha } = req.body as PhoneLoginDTO
      // 验证码校验
      const key = this.captchaService.getCaptchaKey({ type: 'phone', name: 'login', id: phone })
      await this.captchaService.validateCaptcha(key, captcha)
      // 用户校验
      const [user] = await this.userDomainService.getUsersByPhones([phone], em)
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
