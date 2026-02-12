import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { IAppConfig } from '@/config'
import { join } from 'node:path'
import { Logger, VersioningType } from '@nestjs/common'
import { APP_CONFIG_KEY } from '@/config'

/**
 * 初始化全局设置
 * @param appInstance 应用实例
 * @param configService 配置服务
 */
export async function initGlobalSettings(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  configService: ConfigService,
) {
  const logger = new Logger(initGlobalSettings.name)
  logger.log(`GlobalSettings 初始化中...`)
  const { globalPrefix, defaultVersion } = configService.get<IAppConfig>(APP_CONFIG_KEY)!
  // 应用关闭钩子
  appInstance.enableShutdownHooks()

  // 信任代理设置(用于节流器)
  appInstance.set('trust proxy', 'loopback')

  // 设置全局前缀
  appInstance.setGlobalPrefix(globalPrefix)
  //  增加版本前缀(默认V1,没有前缀也可以访问)
  // appInstance.enableVersioning({ type: VersioningType.URI, defaultVersion: [VERSION_NEUTRAL] })
  appInstance.enableVersioning({ type: VersioningType.URI, defaultVersion: [defaultVersion] })

  appInstance.setBaseViewsDir(join(__dirname, '..', 'templates'))
  appInstance.setViewEngine('hbs')
  logger.log(`GlobalSettings 初始化完成`)
}
