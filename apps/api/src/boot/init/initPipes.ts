import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import { Logger, ValidationPipe } from '@nestjs/common'
/**
 * 初始化管道
 * @param appInstance 应用实例
 * @param _configService 配置服务
 */
export async function initPipes(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  _configService: ConfigService,
) {
  const logger = new Logger(initPipes.name)
  logger.log(`Pipes 初始化中...`)
  // 添加全局管道验证
  appInstance.useGlobalPipes(
    new ValidationPipe({
      // 配合 @Allow 装饰器添加到白名单
      whitelist: true,
      // 自动类型转换
      transform: true,
      // 白名单里面没有的属性会报错
      forbidNonWhitelisted: true,
    }),
  )
  logger.log(`Pipes 初始化完成`)
}
