import type {
  IAuthDetailsVO,
  ICreateAuthDTO,
  IEmailCaptchaDTO,
  IEmailLoginDTO,
  IEmailRegisterDTO,
  IEmailResetPwdDTO,
  IRefreshTokenDTO,
  ISvgCaptchaVO,
  ISvgLoginDTO,
  ITokenVO,
  IUserDetailsVO,
} from '@packages/types'
import { request } from './http'
import { REQUEST_ID_RULES } from './http/IHttpUtils'

const BasePath = '/auth'

/** 获取svg验证码 */
export async function svgCaptcha(name: 'test' | 'register' | 'login' | 'resetPwd' | 'updateInfo') {
  return await request.get<undefined, ISvgCaptchaVO>(`${BasePath}/svg/${name}`, undefined, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_PARAMS,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 3000,
      //   limitType: 'Debounce',
      //   message: '30秒后再次重试',
      // },
    },
  })
}

/** 发送邮箱验证码 */
export async function emailCaptcha(name: 'test' | 'register' | 'login' | 'resetPwd' | 'updateInfo', DTO: IEmailCaptchaDTO) {
  return await request.post<IEmailCaptchaDTO>(`${BasePath}/email/${name}`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** SVG登录 */
export async function svgLogin(DTO: ISvgLoginDTO) {
  return await request.post<ISvgLoginDTO, ITokenVO>(`${BasePath}/login/svg`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** 邮箱注册 */
export async function emailRegister(DTO: IEmailRegisterDTO) {
  return await request.post<IEmailRegisterDTO>(`${BasePath}/register/email`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** 邮箱登录 */
export async function emailLogin(DTO: IEmailLoginDTO) {
  return await request.post<IEmailLoginDTO, ITokenVO>(`${BasePath}/login/email`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** 邮箱重置密码 */
export async function emailResetPwd(DTO: IEmailResetPwdDTO) {
  return await request.post<IEmailResetPwdDTO>(`${BasePath}/reset-pwd/email`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** 刷新令牌 */
export async function refreshToken(DTO: IRefreshTokenDTO) {
  return await request.post<IRefreshTokenDTO, ITokenVO>(`${BasePath}/refresh`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      TokenPlugin: {
        isRefresh: true,
      },
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** 登出 */
export async function logOut(DTO: IRefreshTokenDTO) {
  return await request.post<IRefreshTokenDTO>(`${BasePath}/logout`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      TokenPlugin: {
        isLogout: true,
      },
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

export async function createAuth(DTO: ICreateAuthDTO) {
  return await request.post<ICreateAuthDTO, IAuthDetailsVO>(`${BasePath}`, DTO, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL_DATA,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}

/** 获取当前登录用户信息 */
export async function getMeInfo() {
  return await request.get<undefined, IUserDetailsVO>(`${BasePath}/me`, undefined, {
    requestIdRules: REQUEST_ID_RULES.METHOD_URL,
    customConfig: {
      // LimitPlugin: {
      //   limitTime: 60000,
      //   limitType: 'Throttle',
      //   message: '1分钟后再次重试',
      // },
    },
  })
}
