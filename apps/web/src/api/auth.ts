import type {
  IEmailCaptchaDTO,
  ILoginByEmailDTO,
  ILoginBySvgDTO,
  ILoginVO,
  ILogoutDTO,
  IOKResponse,
  IRefreshTokenDTO,
  IRegisterByEmailDTO,
  IResetPwdByEmailDTO,
  ISvgCaptchaVO,
  IUserVO,
} from '@packages/types'
import type { CustomConfig } from './axios'
import { request } from './axios'

/** svg验证码接口(登录) */
export async function loginBySvgCaptcha() {
  return (await request.get<CustomConfig, ISvgCaptchaVO>(`/auth/login/svg/captcha`, undefined, {
    requestIdRules: 'method:url',
    customConfig: {
      limitTime: 3000,
      limitType: 'Debounce',
    },
  })) as IOKResponse<ISvgCaptchaVO>
}

/**
 * 邮箱验证码接口(登录)
 * @param emailCaptchaDTO 邮箱验证码接口参数校验
 */
export async function loginByEmailCaptcha(emailCaptchaDTO: IEmailCaptchaDTO) {
  return (await request.post<CustomConfig, string>(`/auth/login/email/captcha`, emailCaptchaDTO, {})) as IOKResponse<string>
}

/**
 * 邮箱登录接口
 * @param loginByEmailDTO 邮箱登录接口参数校验
 */
export async function loginByEmail(loginByEmailDTO: ILoginByEmailDTO) {
  return (await request.post<CustomConfig, ILoginVO>(`/auth/login/email`, loginByEmailDTO, {})) as IOKResponse<ILoginVO>
}

/**
 * 图片验证码登录接口
 * @param loginBySvgDTO 图片验证码登录接口参数校验
 */
export async function loginBySvg(loginBySvgDTO: ILoginBySvgDTO) {
  return (await request.post<CustomConfig, ILoginVO>(`/auth/login/svg`, loginBySvgDTO, {
    requestIdRules: 'method:url',
    customConfig: {
      // limitTime: 3000,
      // limitType: 'Debounce',
    },
  })) as IOKResponse<ILoginVO>
}

/**
 * 邮箱验证码接口(注册)
 * @param emailCaptchaDTO 邮箱验证码接口参数校验
 * @returns
 */

export async function registerByEmailCaptcha(emailCaptchaDTO: IEmailCaptchaDTO) {
  return (await request.post<CustomConfig, string>(`/auth/register/email/captcha`, emailCaptchaDTO, {})) as IOKResponse<string>
}

/**
 * 邮箱注册接口
 * @param registerByEmailDTO 邮箱注册接口参数校验
 */
export async function registerByEmail(registerByEmailDTO: IRegisterByEmailDTO) {
  return (await request.post<CustomConfig, string>(`/auth/register/email`, registerByEmailDTO, {})) as IOKResponse<string>
}

/**
 * 邮箱验证码接口(重置密码)
 * @param emailCaptchaDTO 邮箱验证码接口参数校验
 */
export async function resetPwdByEmailCaptcha(emailCaptchaDTO: IEmailCaptchaDTO) {
  return (await request.post<CustomConfig, string>(`/auth/pwd/email/captcha`, emailCaptchaDTO, {})) as IOKResponse<string>
}

/**
 * 邮箱重置密码接口
 * @param resetPwdByEmailDTO 邮箱重置密码接口参数校验
 */
export async function resetPwdByEmail(resetPwdByEmailDTO: IResetPwdByEmailDTO) {
  return (await request.post<CustomConfig, string>(`/auth/pwd`, resetPwdByEmailDTO, {})) as IOKResponse<string>
}

/**
 * 退出登录接口
 * @param logoutDTO 退出登录接口参数校验
 */
export async function logout(logoutDTO?: ILogoutDTO) {
  return (await request.post<CustomConfig, string>(`/auth/logout`, logoutDTO, {
    customConfig: {
      limitTime: 3000,
      limitType: 'Debounce',
    },
  })) as IOKResponse<string>
}

/**
 * 刷新令牌接口
 * @param refreshTokenDTO 刷新令牌接口参数校验
 */
export async function refresh(refreshTokenDTO: IRefreshTokenDTO) {
  return (await request.post<CustomConfig, ILoginVO>(`/auth/refresh`, refreshTokenDTO, {})) as IOKResponse<ILoginVO>
}

export async function getUserInfo() {
  return (await request.get<CustomConfig, IUserVO>(`/auth/info`, undefined, {})) as IOKResponse<IUserVO>
}
