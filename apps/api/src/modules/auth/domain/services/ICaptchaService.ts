import type { ISvgCaptchaVO } from '@packages/types'
import type { ConfigObject } from 'svg-captcha'

/** 验证类型 */
export const CAPTCHA_TYPE = ['svg', 'email', 'phone'] as const
export type TCaptchaType = (typeof CAPTCHA_TYPE)[number]
/** 验证名 */
export const CAPTCHA_NAME = ['test', 'register', 'login', 'resetPwd', 'updateInfo'] as const
export type TCaptchaName = (typeof CAPTCHA_NAME)[number]
export interface ICaptchaInfo {
  /** 验证类型 */
  type: TCaptchaType
  /** 验证名 */
  name: TCaptchaName
  /** 唯一凭证:(SVG凭证，邮箱，电话号码等) */
  id: string
}
export interface IEmailConfigObject {
  /** 接收方 */
  to: string
  /** 主题 */
  subject: string
  /** 模板名 */
  template: string
}

export interface IThrottleInfo extends ICaptchaInfo {
  /** 节流时间 */
  timer?: number
  /** 次数 */
  num?: number
}

/** 验证码服务接口 */
export interface ICaptchaService {
  /**
   * 获取验证码缓存键名
   * @param captchaInfo 验证码信息
   */
  getCaptchaKey: (captchaInfo: ICaptchaInfo) => string
  /**
   * 生成svg验证码
   * @param name 验证名
   * @param configObject svg验证码配置
   */
  generateSvgCaptcha: (name: TCaptchaName, configObject?: ConfigObject) => Promise<ISvgCaptchaVO>
  /**
   * 生成邮件验证码
   * @param name 验证名
   * @param configObject 邮箱验证码配置
   */
  generateEmailCaptcha: (name: TCaptchaName, configObject: IEmailConfigObject) => Promise<never[]>
  /** 校验验证码 */
  validateCaptcha: (key: string, code: string) => Promise<void>
  /** 校验发送(邮箱，短信等)节流，默认单个(邮箱，手机号)3分钟内只能发送2次 */
  validateThrottle: (throttleInfo: IThrottleInfo) => Promise<void>
}
