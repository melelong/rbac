import type { LoginTypeEnum } from '../enums'
/** 验证名参数校验 */
export interface ICaptchaNameDTO {
  /** 验证名 */
  name: string
}
/** 邮箱验证码接口参数校验 */
export interface IEmailCaptchaDTO {
  /** 邮箱 */
  email: string
}
/** 手机号验证码接口参数校验 */
export interface IPhoneCaptchaDTO {
  /** 手机号 */
  phone: string
}
/** svg登录接口参数校验 */
export interface ISvgLoginDTO {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd: string
  /** 验证码令牌 */
  token: string
  /** 验证码 */
  captcha: string
}
/** 邮箱登录接口参数校验 */
export interface IEmailLoginDTO {
  /** 邮箱 */
  email: string
  /** 密码 */
  pwd: string
  /** 验证码 */
  captcha: string
}
/** 邮箱注册接口参数校验 */
export interface IEmailRegisterDTO extends IEmailLoginDTO {
  /** 用户名 */
  name: string
}
/** 邮箱重置密码接口参数校验 */
export interface IEmailResetPwdDTO extends IEmailLoginDTO {
  /** 确认密码 */
  confirmPwd: string
}
/** 手机号登录接口参数校验 */
export interface IPhoneLoginDTO {
  /** 手机号 */
  phone: string
  /** 密码 */
  pwd: string
  /** 验证码 */
  captcha: string
}
/** 手机号注册接口参数校验 */
export interface IPhoneRegisterDTO extends IPhoneLoginDTO {
  /** 用户名 */
  name: string
}
/** 手机号重置密码接口参数校验 */
export interface IPhoneResetPwdDTO extends IPhoneLoginDTO {
  /** 确认密码 */
  confirmPwd: string
}
/** 刷新令牌接口参数校验 */
export interface IRefreshTokenDTO {
  /** 刷新token */
  refreshToken?: string
}

/** 退出登录接口参数校验 */
export interface ILogoutDTO extends IRefreshTokenDTO {}

/** 统一登录接口参数校验 */
export interface IUnifiedLoginDTO extends IEmailLoginDTO, ISvgLoginDTO {
  /** 登录类型 */
  loginType: LoginTypeEnum
}

/** 创建认证接口参数校验 */
export interface ICreateAuthDTO {
  /** 认证名 */
  name: string
  /** 备注 */
  remark?: string
}

/** 更新认证接口参数校验 */
export interface IUpdateAuthDTO {
  /** 认证名 */
  name?: string
  /** 备注 */
  remark?: string
}
