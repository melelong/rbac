import type { Request } from 'express'
import type { SvgLoginDTO } from '../dto'
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

/** SVG登录策略 */
@Injectable()
export class SvgLoginStrategy extends PassportStrategy(Strategy, 'svg-login') {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly captchaService: CaptchaService,
    private readonly clsService: ClsService,
    private readonly em: EntityManager,
  ) {
    super()
  }

  async validate(req: Request) {
    return await this.em.transaction(async (em) => {
      const { name, pwd, token, captcha } = req.body as SvgLoginDTO
      // 验证码校验
      const key = this.captchaService.getCaptchaKey({ type: 'svg', name: 'login', id: token })
      await this.captchaService.validateCaptcha(key, captcha)
      // 用户校验
      const [user] = await this.userDomainService.getUsersByNames([name], false, em)
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
