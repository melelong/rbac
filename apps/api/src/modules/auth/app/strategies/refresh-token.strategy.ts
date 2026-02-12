import type { Request } from 'express'
import type { ITokenInfo } from '../../domain/services/ITokenService'
import type { IJwtConfig } from '@/config'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-custom'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { JWT_CONFIG_KEY } from '@/config'
import { TokenService } from '../../domain'

/** 刷新令牌策略 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'refresh-token') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly clsService: ClsService,
    private readonly loggingService: LoggingService,
    private readonly configService: ConfigService,
  ) {
    super()
  }

  async validate(req: Request) {
    const accessToken = this.tokenService.getAccessToken(req)
    const refreshToken = this.tokenService.getRefreshToken(req)
    if (!refreshToken) throw new UnauthorizedException()
    let refreshInfo: ITokenInfo | null = null
    try {
      refreshInfo = await this.tokenService.verifyToken(refreshToken)
    } catch {
      throw new UnauthorizedException()
    }
    if (refreshInfo.type !== 'refresh') throw new UnauthorizedException()
    // 刷新令牌是否在缓存中
    const hasCache = await this.tokenService.getRefreshCache(refreshInfo.sub)
    if (!hasCache) throw new UnauthorizedException()
    // 对比
    if (hasCache !== refreshToken) {
      // 拉黑刷新令牌
      const { refreshTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
      await Promise.all([
        this.tokenService.setBlackListCache(refreshInfo, refreshToken, refreshTokenCookieExpiresIn),
        this.tokenService.delRefreshCache(refreshInfo.sub),
      ])
      throw new UnauthorizedException()
    }
    // 是否在黑名单缓存中
    const hasBlackList = await this.tokenService.getBlackListCache(refreshInfo)
    if (hasBlackList) throw new UnauthorizedException()
    let accessInfo: ITokenInfo | null = null
    if (accessToken) {
      try {
        accessInfo = await this.tokenService.verifyToken(accessToken)
        if (accessInfo.type !== 'access' || accessInfo.sub !== refreshInfo.sub) accessInfo = null
      } catch {
        // 过期或无效，忽略
      }
    }
    this.clsService.set<string>(REQ_CTX.USER_ID, refreshInfo.sub)
    this.clsService.set<ITokenInfo>(REQ_CTX.ACCESS_INFO, accessInfo)
    this.clsService.set<string>(REQ_CTX.ACCESS_TOKEN, accessToken)
    this.clsService.set<ITokenInfo>(REQ_CTX.REFRESH_INFO, refreshInfo)
    this.clsService.set<string>(REQ_CTX.REFRESH_TOKEN, refreshToken)
    return true
  }
}
