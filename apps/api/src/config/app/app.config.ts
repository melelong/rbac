import type { ConfigType } from '@nestjs/config'
import * as process from 'node:process'
import { registerAs } from '@nestjs/config'
import { AppValidationSchema } from './appValidationSchema'

/** app配置key */
export const APP_CONFIG_KEY = 'APP_CONFIG_KEY'

/** app配置接口 */
export interface IAppConfig {
  /** app名称 */
  name: string
  /** app端口 */
  port: number
  /** 主机名 */
  hostname: string
  /** app全局访问前缀 */
  globalPrefix: string
  /** app盐 */
  salt: string
  /** 初始化用户配置(用于判断不能删除内置用户)  */
  initUser: {
    super: {
      /** 内置超级管理员名 */
      name: string
      /** 超级管理员邮箱 */
      email: string
      /** 超级管理员密码 */
      pwd: string
    }
    admin: {
      /** 内置管理员名 */
      name: string
      /** 管理员密码 */
      pwd: string
    }
    user: {
      /** 内置普通用户名 */
      name: string
      /** 普通用户默认密码 */
      pwd: string
    }
  }
  /** app进程id */
  pid: number
  /** app默认版本 */
  defaultVersion: string
}

/** app配置 */
export const AppConfig = registerAs(APP_CONFIG_KEY, (): IAppConfig => {
  const { error, value } = AppValidationSchema.validate(process.env, {
    allowUnknown: true,
    abortEarly: false,
  })
  if (error) throw new Error(`${AppConfig.name}:${error.message}`)
  return {
    name: value.APP_NAME,
    port: value.APP_PORT,
    hostname: value.APP_HOSTNAME,
    globalPrefix: value.APP_GLOBAL_PREFIX,
    salt: value.APP_SALT,
    initUser: {
      super: {
        name: value.APP_SUPER_NAME,
        email: value.APP_SUPER_EMAIL,
        pwd: value.APP_SUPER_PWD,
      },
      admin: {
        name: value.APP_ADMIN_NAME,
        pwd: value.APP_ADMIN_PWD,
      },
      user: {
        name: value.APP_USER_NAME,
        pwd: value.APP_USER_PWD,
      },
    },
    pid: process.pid,
    defaultVersion: value.APP_DEFAULT_VERSION,
  }
})
/** app配置类型 */
export type AppConfigType = ConfigType<typeof AppConfig>
