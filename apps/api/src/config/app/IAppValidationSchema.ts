/** app配置验证接口 */
export interface IAppValidationSchema {
  APP_NAME: string
  APP_PORT: number
  APP_HOSTNAME: string
  APP_GLOBAL_PREFIX: string
  APP_SALT: string
  APP_SUPER_NAME: string
  APP_ADMIN_NAME: string
  APP_USER_NAME: string
  APP_SUPER_EMAIL: string
  APP_SUPER_PWD: string
  APP_ADMIN_PWD: string
  APP_USER_PWD: string
  APP_DEFAULT_VERSION: string
}
