import type { IRefreshTokenDTO } from '@packages/types'
import type { Request } from 'express'
import type { IDelCookieOptions, ISetCookieOptions, ITokenInfo, ITokenService } from '../ITokenService'
import type { IAppConfig, IJwtConfig } from '@/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { LogContextClass } from '@/common/deco'
import { CacheService } from '@/common/infra'
import { APP_CONFIG_KEY, DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN, JWT_CONFIG_KEY } from '@/config'

/** 令牌服务实现 */
@Injectable()
@LogContextClass()
export class TokenService implements ITokenService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  getAccessToken(req: Request) {
    const token =
      (req.headers.authorization?.split(' ')[1] as string) ??
      (req.cookies.Authorization?.split(' ')[1] as string) ??
      (req.cookies.authorization?.split(' ')[1] as string)
    return token || null
  }

  getRefreshToken(req: Request) {
    const token = (req.cookies.refresh as string) ?? ((req.body as IRefreshTokenDTO)?.refreshToken as string)
    return token || null
  }

  async generateToken(tokenInfo: ITokenInfo, expiresIn: string | number) {
    const { salt: secret } = this.configService.get<IAppConfig>(APP_CONFIG_KEY)!
    return await this.jwtService.signAsync(tokenInfo, { expiresIn, secret })
  }

  async verifyToken(token: string) {
    const { salt: secret } = this.configService.get<IAppConfig>(APP_CONFIG_KEY)!
    return await this.jwtService.verifyAsync<ITokenInfo>(token, { secret })
  }

  getRefreshKey(userId: string) {
    return `jwt:refresh:${userId}`
  }

  async setRefreshCache(userId: string, refreshToken: string) {
    const { refreshTokenCookieExpiresIn } = this.configService.get<IJwtConfig>(JWT_CONFIG_KEY)!
    const refreshKey = this.getRefreshKey(userId)
    await this.cacheService.set(refreshKey, refreshToken, refreshTokenCookieExpiresIn)
  }

  async getRefreshCache(userId: string) {
    const refreshKey = this.getRefreshKey(userId)
    const refreshToken = await this.cacheService.get<null | string>(refreshKey)
    return refreshToken
  }

  async delRefreshCache(userId: string) {
    const refreshKey = this.getRefreshKey(userId)
    await this.cacheService.del(refreshKey)
  }

  getBlackListKey(tokenInfo: ITokenInfo) {
    const { jti, type } = tokenInfo
    return `jwt:blacklist:${type}:${jti}`
  }

  async setBlackListCache(tokenInfo: ITokenInfo, token: string, maxAge: number) {
    const blackListKey = this.getBlackListKey(tokenInfo)
    await this.cacheService.set(blackListKey, token, maxAge)
  }

  async delaySetBlackListCache(tokenInfo: ITokenInfo, token: string, maxAge: number) {
    const blackListKey = this.getBlackListKey(tokenInfo)
    await this.cacheService.delayedSet(blackListKey, token, maxAge, 30 * 1000)
  }

  async getBlackListCache(tokenInfo: ITokenInfo) {
    const blackListKey = this.getBlackListKey(tokenInfo)
    const blackListToken = await this.cacheService.get<null | string>(blackListKey)
    return blackListToken
  }

  async setCookieToken(options: ISetCookieOptions) {
    const { res, key, value, maxAge = DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN, secure = false, httpOnly = true, sameSite = 'lax' } = options
    res.cookie(key, value, { httpOnly, maxAge, sameSite, secure })
  }

  async delCookieToken(options: IDelCookieOptions) {
    const { res, key, maxAge = DEFAULT_JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN, secure = false, httpOnly = true, sameSite = 'lax' } = options
    res.clearCookie(key, { httpOnly, maxAge, sameSite, secure })
  }
}
