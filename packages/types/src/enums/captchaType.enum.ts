/** 验证码类型枚举 */
export enum CaptchaTypeEnum {
  /** 测试 */
  TEST = 10,
  /** 注册 */
  REGISTER = 20,
  /** 登录 */
  LOGIN = 30,
  /** 重置密码 */
  RESET_PWD = 40,
}

/** 验证码类型枚举文本映射 */
export const CaptchaTypeTextMap: Record<CaptchaTypeEnum, string> = {
  [CaptchaTypeEnum.TEST]: '测试',
  [CaptchaTypeEnum.REGISTER]: '注册',
  [CaptchaTypeEnum.LOGIN]: '登录',
  [CaptchaTypeEnum.RESET_PWD]: '重置密码',
}
