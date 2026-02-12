/** cors配置验证接口 */
export interface ICorsValidationSchema {
  CORS_ENABLED: boolean
  CORS_ORIGINS: string
  CORS_METHODS: string
  CORS_ALLOWED_HEADERS: string
  CORS_CREDENTIALS: boolean
  CORS_MAX_AGE: number
}
