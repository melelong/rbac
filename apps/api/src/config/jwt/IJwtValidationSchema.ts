/** JWT配置验证接口 */
export interface IJwtValidationSchema {
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  JWT_ACCESS_TOKEN_EXPIRES_IN: string
  JWT_REFRESH_TOKEN_EXPIRES_IN: string
  JWT_ACCESS_TOKEN_COOKIE_EXPIRES_IN: number
  JWT_REFRESH_TOKEN_COOKIE_EXPIRES_IN: number
}
