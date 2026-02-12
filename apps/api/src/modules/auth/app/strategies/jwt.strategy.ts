import type { Request } from 'express'
import type { ITokenInfo } from '../../domain/services/ITokenService'
import type { IJwtConfig } from '@/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { REQ_CTX } from '@/common/infra'
import { JWT_CONFIG_KEY } from '@/config'
import { TokenService } from '../../domain'

/** jwt策略 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly clsService: ClsService,
    private readonly configService: ConfigService,
  ) {
    super()
  }

  async validate(req: Request) {
    const accessToken = this.tokenService.getAccessToken(req)
    if (!accessToken) throw new UnauthorizedException()
    let accessInfo: ITokenInfo | null = null
    try {
      accessInfo = await this.tokenService.verifyToken(accessToken)
    } catch {
      throw new UnauthorizedException()
    }
    if (accessInfo.type !== 'access') throw new UnauthorizedException()
    // 刷新令牌是否在缓存中和是否在黑名单中
    const [refreshToken, hasBlackListAccess] = await Promise.all([
      this.tokenService.getRefreshCache(accessInfo.sub),
      this.tokenService.getBlackListCache(accessInfo),
    ])
    if (!refreshToken) {
      // 拉黑访问令牌
      const { accessTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
      await this.tokenService.setBlackListCache(accessInfo, accessToken, accessTokenCookieExpiresIn)
      throw new UnauthorizedException()
    }
    if (hasBlackListAccess) throw new UnauthorizedException()
    this.clsService.set<string>(REQ_CTX.USER_ID, accessInfo!.sub)
    return true
  }
}
