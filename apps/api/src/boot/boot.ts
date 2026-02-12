import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { IBoot } from './IBoot'
import type { IAppConfig } from '@/config'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { CacheService, LoggingService } from '@/common/infra'
import { APP_CONFIG_KEY } from '@/config'
import { initGlobalSettings, initMiddlewares, initPipes, initResource, initRole, initSwagger, initUser } from './init'

/** webpack热更新模块 */
declare const module: any

export class BootImpl implements IBoot {
  /** 应用实例 */
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>
  appConfig: IAppConfig

  /** 创建实例或获取实例 */
  public static async create(bootModule: any) {
    const instance = new BootImpl()
    // 仅控制台日志的日志实例
    // const logger = new LoggingService()
    instance.appInstance = await NestFactory.create<NestExpressApplication>(bootModule, { bufferLogs: true })

    // 替换默认的日志实例
    const logger = instance.appInstance.get(LoggingService)
    instance.appInstance.useLogger(logger)
    return instance
  }

  async init() {
    const configService = this.appInstance.get(ConfigService)
    this.appConfig = configService.get<IAppConfig>(APP_CONFIG_KEY)!
    await initGlobalSettings(this.appInstance, configService)
    await initMiddlewares(this.appInstance, configService)
    await initPipes(this.appInstance, configService)
    setTimeout(async () => {
      const limit = await initResource(this.appInstance, configService)
      await initRole(this.appInstance, configService, limit)
      await initUser(this.appInstance, configService)
    }, 1)
    await initSwagger(this.appInstance, configService)
  }

  async listen() {
    const { name, port, hostname, globalPrefix, defaultVersion } = this.appConfig
    await this.appInstance.listen(port, hostname, async () => {
      const cacheService = this.appInstance.get(CacheService)
      await cacheService.set('startTime', new Date().toISOString())
      const logger = new Logger(BootImpl.name)
      const url = await this.appInstance.getUrl()
      const baseUrl = `${url}${globalPrefix ? `/${globalPrefix}` : ''}${defaultVersion ? `/v${defaultVersion}` : ''}`
      logger.log(`${name} 运行在 ${baseUrl}`)
    })
  }

  enableHotReload() {
    if (!module.hot) return
    module.hot.accept()
    module.hot.dispose(() => {
      this.appInstance.close()
    })
  }
}
