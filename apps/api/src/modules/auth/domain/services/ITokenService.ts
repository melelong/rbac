import type { CookieOptions, Request, Response } from 'express'
/** 令牌类型 */
export const TOKEN_TYPE = ['access', 'refresh'] as const
export type TTokenType = (typeof TOKEN_TYPE)[number]

export interface ITokenInfo {
  /** 用户ID */
  sub: string
  /** 唯一标识 */
  jti: string
  /** 令牌类型 */
  type: TTokenType
  iat?: number
  exp?: number
}
export interface IDelCookieOptions extends CookieOptions {
  /** 响应对象 */
  res: Response
  /** 键名 */
  key: string
}
export interface ISetCookieOptions extends IDelCookieOptions {
  /** 值 */
  value: string
}
/** 令牌服务接口 */
export interface ITokenService {
  /** 生成Token */
  generateToken: (tokenInfo: ITokenInfo, expiresIn: string | number) => Promise<string>
  /** 验证Token */
  verifyToken: (token: string) => Promise<ITokenInfo>
  /** 获取访问令牌(请求头 > cookie) */
  getAccessToken: (req: Request) => string | null
  /** 获取刷新令牌(cookie > body) */
  getRefreshToken: (req: Request) => string | null
  /** 获取刷新令牌缓存键名 */
  getRefreshKey: (userId: string) => string
  /**
   * 设置刷新令牌到缓存
   * @param userId 用户ID
   * @param refreshToken 刷新令牌
   */
  setRefreshCache: (userId: string, refreshToken: string) => Promise<void>
  /**
   * 检查用户是否有刷新令牌
   * @param userId 用户ID
   */
  getRefreshCache: (userId: string) => Promise<string | null>
  /**
   * 删除刷新令牌的缓存
   * @param userId 用户ID
   */
  delRefreshCache: (userId: string) => Promise<void>
  /** 获取黑名单令牌缓存键名 */
  getBlackListKey: (tokenInfo: ITokenInfo) => string
  /**
   * 设置刷新令牌到黑名单缓存
   * @param tokenInfo 令牌信息
   * @param token 令牌
   * @param maxAge 过期时间(毫秒)
   */
  setBlackListCache: (tokenInfo: ITokenInfo, token: string, maxAge: number) => Promise<void>
  /**
   * 延迟设置刷新令牌到黑名单缓存
   * @param tokenInfo 令牌信息
   * @param token 令牌
   * @param maxAge 过期时间(毫秒)
   */
  delaySetBlackListCache: (tokenInfo: ITokenInfo, token: string, maxAge: number) => Promise<void>
  /**
   * 检查令牌是否在黑名单中
   * @param tokenInfo 令牌信息
   */
  getBlackListCache: (tokenInfo: ITokenInfo) => Promise<string | null>
  /** 设置令牌到Cookie */
  setCookieToken: (options: ISetCookieOptions) => Promise<void>
  /** 删除Cookie中的令牌 */
  delCookieToken: (options: IDelCookieOptions) => Promise<void>
}
