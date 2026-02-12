/** swagger配置验证接口 */
export interface ISwaggerValidationSchema {
  SWAGGER_ENABLED: boolean
  SWAGGER_TAG: string
  SWAGGER_TITLE: string
  SWAGGER_DESCRIPTION: string
  SWAGGER_VERSION: string
  SWAGGER_IGNORE_GLOBAL_PREFIX: boolean
  SWAGGER_PATH: string
}
