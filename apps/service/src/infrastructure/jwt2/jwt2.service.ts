import type { Response } from 'express'
import type Redis from 'ioredis'
import type { IJwt2Service, IPayLoad, IRedisToken, ISetRedisTokenOptions } from './IJwt2'
import type { TokenType } from './jwt2.constant'
import type { UserInfo } from '@/modules/auth/vo'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CacheTemplate } from '@/common/template'
import { JWT_REDIS_CLIENT_TOKEN } from './jwt2.constant'

@Injectable()
export class Jwt2Service extends CacheTemplate implements IJwt2Service {
  constructor(
    @Inject(CACHE_MANAGER) memory: Cache,
    @Inject(JWT_REDIS_CLIENT_TOKEN) redis: Redis,
    private readonly jwtService: JwtService,
  ) {
    super({ className: Jwt2Service.name, redis, memory })
  }

  async generatePayload(userInfo: UserInfo, tokenType: (typeof TokenType)[keyof typeof TokenType]) {
    return { ...userInfo, tokenType }
  }

  async generateToken(userInfo: UserInfo, expiresIn: string, secret: string, tokenType: (typeof TokenType)[keyof typeof TokenType]) {
    const payload = await this.generatePayload(userInfo, tokenType)
    return await this.jwtService.signAsync(payload, { expiresIn, secret })
  }

  async setCookieToken(res: Response, key: string, value: string, maxAge: number) {
    res.cookie(key, value, { httpOnly: true, secure: false, sameSite: 'lax', maxAge })
  }

  async delCookieToken(res: Response, key: (typeof TokenType)[keyof typeof TokenType]) {
    res.clearCookie(key, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 0 })
  }

  async setRedisToken(setRedisTokenOptions: ISetRedisTokenOptions) {
    const { userId, refreshToken, accessToken, ttl } = setRedisTokenOptions
    const redisToken: IRedisToken = {
      refreshToken,
      accessToken,
    }
    return await this.set(userId, redisToken, ttl)
  }

  async delRedisToken(userId: string) {
    return await this.del(userId)
  }

  async getRedisToken(userId: string) {
    const redisToken = await this.get<IRedisToken>(userId)
    if (!redisToken) throw new UnauthorizedException()
    return redisToken
  }

  async validateToken(token: string, secret?: string | Buffer<ArrayBufferLike>) {
    try {
      const payload = await this.jwtService.verifyAsync<IPayLoad>(token, { secret, ignoreExpiration: false })
      await this.getRedisToken(payload.id)
      return payload
    } catch (error) {
      console.warn('validateToken', error.message)
      return null
    }
  }
}
