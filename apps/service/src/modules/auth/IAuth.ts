import type { Request, Response } from 'express'
import type { UserVO } from '../system/user/vo'
import type { LOGOUT_VO, REGISTER_VO, RESET_PWD_VO } from './auth.constant'
import type { LoginBySvgDTO, LogoutDTO, RefreshTokenDTO, ResetPwdByEmailDTO, UnifiedLoginDTO } from './dto'
import type { EmailCaptchaDTO } from './dto/emailCaptcha.dto'
import type { LoginByEmailDTO } from './dto/loginByEmail.dto'
import type { RegisterByEmailDTO } from './dto/registerByEmail.dto'
import type { LoginVO, UserInfo } from './vo'
import type { SEND_EMAIL_CAPTCHA_VO } from '@/infrastructure/captcha/captcha.constant'
import type { SvgCaptchaVO } from '@/infrastructure/captcha/vo/svgCaptcha.vo'

/** 登录类型 */
export type LoginType = 'email' | 'svg'

/** 验证用户参数 */
export interface IValidateUserOptions {
  /** 用户名 */
  name: string
  /** 用户密码 */
  pwd: string
}

export interface IAuthService {
  /**
   * 邮箱注册用户
   * @param registerByEmailDTO 邮箱注册接口参数校验
   */
  registerByEmail: (registerByEmailDTO: RegisterByEmailDTO) => Promise<boolean>

  /**
   * 邮箱重置密码
   * @param response 响应对象
   * @param resetPwdByEmailDTO 邮箱重置密码接口参数校验
   */
  resetPwdByEmail: (response: Response, resetPwdByEmailDTO: ResetPwdByEmailDTO) => Promise<boolean>

  /**
   * 邮箱登录
   * @param response 响应对象
   * @param loginByEmailDTO 邮箱登录接口参数校验
   */
  loginByEmail: (response: Response, loginByEmailDTO: LoginByEmailDTO) => Promise<LoginVO>

  /**
   * 图片验证码登录
   * @param response 响应对象
   * @param loginBySvgDTO 图片验证码登录接口参数校验
   */
  loginBySvg: (response: Response, loginBySvgDTO: LoginBySvgDTO) => Promise<LoginVO>

  /**
   * 退出登录
   * @param request 请求对象
   * @param response 响应对象
   * @param logoutDTO 退出登录接口参数校验
   */
  logout: (request: Request, response: Response, logoutDTO: LogoutDTO) => Promise<boolean>

  /**
   * 刷新令牌
   * @param request 请求对象
   * @param response  响应对象
   * @param refreshTokenDTO 刷新令牌接口参数校验
   */
  refresh: (request: Request, response: Response, refreshTokenDTO: RefreshTokenDTO) => Promise<LoginVO>

  /**
   * 设置所有token
   * @param response 响应对象
   */
  setAllToken: (response: Response) => Promise<LoginVO>

  /**
   * 删除所有token
   * @param id 用户ID
   * @param response 响应对象
   */
  delAllToken: (id: string, response: Response) => Promise<boolean>

  /**
   * 验证用户
   * @param name 用户名
   * @param pwd 密码
   */
  validateUser: (name: string, pwd: string) => Promise<UserInfo>
}

export interface IAuthController {
  /** svg验证码接口(登录) */
  loginBySvgCaptcha: () => Promise<SvgCaptchaVO>

  /**
   * 邮箱验证码接口(登录)
   * @param emailCaptchaDTO 邮箱验证码接口参数校验
   */
  loginByEmailCaptcha: (emailCaptchaDTO: EmailCaptchaDTO) => Promise<typeof SEND_EMAIL_CAPTCHA_VO>

  /**
   * 统一登录接口
   * @param response 响应对象
   * @param unifiedLoginDTO 统一登录接口参数校验
   */
  unifiedLogin: (response: Response, unifiedLoginDTO: UnifiedLoginDTO) => Promise<LoginVO>

  /**
   * 邮箱登录接口
   * @param response 响应对象
   * @param loginByEmailDTO 邮箱登录接口参数校验
   */
  loginByEmail: (response: Response, loginByEmailDTO: LoginByEmailDTO) => Promise<LoginVO>

  /**
   * 图片验证码登录接口
   * @param response 响应对象
   * @param loginBySvgDTO 图片验证码登录接口参数校验
   */
  loginBySvg: (response: Response, loginBySvgDTO: LoginBySvgDTO) => Promise<LoginVO>

  /**
   * 邮箱验证码接口(注册)
   * @param emailCaptchaDTO 邮箱验证码接口参数校验
   */
  registerByEmailCaptcha: (emailCaptchaDTO: EmailCaptchaDTO) => Promise<typeof SEND_EMAIL_CAPTCHA_VO>

  /**
   * 邮箱注册接口
   * @param registerByEmailDTO 邮箱注册接口参数校验
   */
  registerByEmail: (registerByEmailDTO: RegisterByEmailDTO) => Promise<typeof REGISTER_VO>

  /**
   * 邮箱验证码接口(重置密码)
   * @param emailCaptchaDTO 邮箱验证码接口参数校验
   */
  resetPwdByEmailCaptcha: (emailCaptchaDTO: EmailCaptchaDTO) => Promise<typeof SEND_EMAIL_CAPTCHA_VO>

  /**
   * 邮箱重置密码接口
   * @param response 响应对象
   * @param resetPwdByEmailDTO 邮箱重置密码接口参数校验
   */
  resetPwdByEmail: (response: Response, resetPwdByEmailDTO: ResetPwdByEmailDTO) => Promise<typeof RESET_PWD_VO>

  /**
   * 退出登录接口
   * @param request 请求对象
   * @param response 响应对象
   * @param logoutDTO 退出登录接口参数校验
   */
  logout: (request: Request, response: Response, logoutDTO: LogoutDTO) => Promise<typeof LOGOUT_VO>

  /**
   * 刷新令牌接口
   * @param request 请求对象
   * @param response  响应对象
   * @param refreshTokenDTO 刷新令牌接口参数校验
   */
  refresh: (request: Request, response: Response, refreshTokenDTO: RefreshTokenDTO) => Promise<LoginVO>

  /** 获取当前登录用户信息接口 */
  getUserInfo: () => Promise<UserVO>
}
