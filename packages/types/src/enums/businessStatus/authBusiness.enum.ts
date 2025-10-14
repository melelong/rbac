import { HttpStatus } from '../httpStatus.enum'
/** 授权模块业务码枚举 */
export enum AuthBusiness {
  /** 密码错误 */
  INCORRECT_PASSWORD = '4200',
  /** 用户不存在 */
  USER_NOT_FOUND = '4201',
  /** 当前邮箱与验证邮箱不一致 */
  EMAIL_MISMATCH = '4202',
  /** 登录方式不支持 */
  LOGIN_TYPE_NOT_SUPPORT = '4203',
}

/** 授权模块业务码文本映射 */
export const AuthBusinessTextMap: Record<AuthBusiness, [string, number]> = {
  [AuthBusiness.INCORRECT_PASSWORD]: ['密码错误', HttpStatus.FORBIDDEN],
  [AuthBusiness.USER_NOT_FOUND]: ['用户不存在', HttpStatus.NOT_FOUND],
  [AuthBusiness.EMAIL_MISMATCH]: ['当前邮箱与验证邮箱不一致', HttpStatus.BAD_REQUEST],
  [AuthBusiness.LOGIN_TYPE_NOT_SUPPORT]: ['登录方式不支持', HttpStatus.BAD_REQUEST],
}
