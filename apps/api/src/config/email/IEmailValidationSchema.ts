/** 邮箱配置验证接口 */
export interface IEmailValidationSchema {
  EMAIL_HOST: string
  EMAIL_PORT: number
  EMAIL_USER: string
  EMAIL_PASS: string
  EMAIL_SECURE: boolean
  EMAIL_TEMPLATE_DIR: string
}
