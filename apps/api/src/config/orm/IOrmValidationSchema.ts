/** typeorm配置验证接口 */
export interface IOrmValidationSchema {
  ORM_TYPE: string
  ORM_PORT: number
  ORM_HOST: string
  ORM_DATABASE: string
  ORM_USERNAME: string
  ORM_PASSWORD: string
  ORM_POOL_SIZE: number
  ORM_CONNECTOR_PACKAGE: string
  ORM_TIMEZONE: string
  ORM_CHARSET: string
  ORM_SYNCHRONIZE: boolean
  ORM_AUTO_LOAD_ENTITIES: boolean
  ORM_LOGGING: boolean
  ORM_RETRY_ATTEMPTS: number
  ORM_RETRY_DELAY: number
}
