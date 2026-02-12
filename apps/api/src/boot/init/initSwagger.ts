import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'
import type { ISwaggerConfig } from '@/config'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { Logger } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { SwaggerTags } from '@/common/constants/SwaggerTags'
import { ResVO } from '@/common/vo'
import { SWAGGER_CONFIG_KEY } from '@/config'
import metadata from '@/metadata'

/**
 * 初始化Swagger
 * @param appInstance 应用实例
 * @param configService 配置服务
 */
export async function initSwagger(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  configService: ConfigService,
) {
  const logger = new Logger(initSwagger.name)
  const swaggerConfig = configService.get<ISwaggerConfig>(SWAGGER_CONFIG_KEY)!
  if (!swaggerConfig.enabled) return logger.debug(`Swagger 未启用`)
  logger.log(`Swagger 初始化中...`)
  const { title, description, version, ignoreGlobalPrefix, path } = swaggerConfig.config
  await SwaggerModule.loadPluginMetadata(metadata)
  const documentBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '在请求头Authorization中携带JWT，格式: Bearer <JWT_TOKEN>',
      },
      'JWT',
    )
    .addCookieAuth(
      'Authorization',
      {
        type: 'apiKey',
        in: 'cookie',
        description: '在Cookie Authorization中携带JWT，格式: Bearer <JWT_TOKEN>',
      },
      'COOKIE-JWT',
    )
    .build()
  // 模块标签
  documentBuilder.tags = SwaggerTags
  const swaggerDocument = SwaggerModule.createDocument(appInstance, documentBuilder, {
    ignoreGlobalPrefix,
    extraModels: [ResVO],
    deepScanRoutes: true,
  })
  // 导出json
  writeFileSync(resolve(cwd(), `./${title}-${path}-v${version}.json`), `${JSON.stringify(swaggerDocument, null, 2)}\n`, 'utf-8')
  SwaggerModule.setup(path, appInstance, swaggerDocument, {
    customSiteTitle: title,
    jsonDocumentUrl: `/${path}.json`,
    yamlDocumentUrl: `/${path}.yaml`,
  })
  const ui = apiReference({ theme: 'mars', url: `/${path}.json` })
  appInstance.use(`/${path}-ui`, ui)
  logger.log(`Swagger 初始化完成`)
  setTimeout(async () => {
    const url = await appInstance.getUrl()
    logger.log(`Swagger 文档(旧UI) 运行在 ${url}/${path}`)
    logger.log(`Swagger 文档(新UI) 运行在 ${url}/${path}-ui`)
    logger.log(`Swagger 文档 json 版 运行在 ${url}/${path}.json`)
    logger.log(`Swagger 文档 yaml 版 运行在 ${url}/${path}.yaml`)
  }, 0)
}
