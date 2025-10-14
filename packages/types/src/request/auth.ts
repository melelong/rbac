/** 邮箱验证码接口参数校验 */
export interface IEmailCaptchaDTO {
  /** 邮箱 */
  email: string
}
/** 邮箱登录接口参数校验 */
export interface ILoginByEmailDTO {
  /** 邮箱 */
  email: string
  /** 密码 */
  pwd: string
  /** 验证码 */
  captcha: string
}
/** svg登录接口参数校验 */
export interface ILoginBySvgDTO {
  /** 用户名 */
  name: string
  /** 密码 */
  pwd: string
  /** 验证码凭证 */
  token: string
  /** 验证码 */
  captcha: string
}
/** 邮箱注册接口参数校验 */
export interface IRegisterByEmailDTO extends ILoginByEmailDTO {
  /** 用户名 */
  name: string
}
/** 邮箱重置密码接口参数校验 */
export interface IResetPwdByEmailDTO extends ILoginByEmailDTO {
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
