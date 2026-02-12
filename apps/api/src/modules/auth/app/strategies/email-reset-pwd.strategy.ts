import type { Request } from 'express'
import type { ITokenInfo } from '../../domain/services/ITokenService'
import type { EmailResetPwdDTO } from '../dto'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { EntityManager } from 'typeorm'
import { REQ_CTX } from '@/common/infra'
import { UserDomainService } from '@/modules/rbac/user/domain'
import { CaptchaService, TokenService } from '../../domain'

/** 邮箱重置密码策略 */
@Injectable()
export class EmailResetPwdStrategy extends PassportStrategy(Strategy, 'email-reset-pwd') {
  constructor(
    private readonly captchaService: CaptchaService,
    private readonly userDomainService: UserDomainService,
    private readonly clsService: ClsService,
    private readonly tokenService: TokenService,
    private readonly em: EntityManager,
  ) {
    super()
  }

  async validate(req: Request) {
    return await this.em.transaction(async (em: EntityManager) => {
      const accessToken = this.tokenService.getAccessToken(req)
      let accessInfo: ITokenInfo | null = null
      if (accessToken) {
        try {
          accessInfo = await this.tokenService.verifyToken(accessToken)
          if (accessInfo.type !== 'access') accessInfo = null
        } catch {
          // 过期或无效，忽略
        }
      }
      const { email, captcha, pwd } = req.body as EmailResetPwdDTO
      // 验证码校验
      const key = this.captchaService.getCaptchaKey({ type: 'email', name: 'resetPwd', id: email })
      await this.captchaService.validateCaptcha(key, captcha)
      // 用户校验
      const [user] = await this.userDomainService.getUsersByEmails([email], em)
      await this.userDomainService.resetUsersPwd(em, [user.id], [pwd])
      // 用于后续拉黑相关用户令牌
      this.clsService.set<string>(REQ_CTX.USER_ID, user.id)
      this.clsService.set<ITokenInfo>(REQ_CTX.ACCESS_INFO, accessInfo)
      this.clsService.set<string>(REQ_CTX.ACCESS_TOKEN, accessToken)
      return true
    })
  }
}
