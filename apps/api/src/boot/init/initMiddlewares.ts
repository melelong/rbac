import type { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'

import type { ICorsConfig, IHelmetConfig } from '@/config'
import { Logger } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { CORS_CONFIG_KEY, HELMET_CONFIG_KEY } from '@/config'

/**
 * 初始化中间件
 * @param appInstance 应用实例
 * @param configService 配置服务
 */
export async function initMiddlewares(
  appInstance: NestExpressApplication<Server<typeof IncomingMessage, typeof ServerResponse>>,
  configService: ConfigService,
) {
  const logger = new Logger(initMiddlewares.name)
  logger.log(`Middlewares 初始化中...`)

  // Cors 中间件
  const corsConfig = configService.get<ICorsConfig>(CORS_CONFIG_KEY)!
  corsConfig.enabled ? appInstance.enableCors(corsConfig.config) : logger.debug(`Cors 未启用`)

  // Cookie解析 中间件
  appInstance.use(cookieParser())

  // csrf防御
  // const { doubleCsrfProtection } = doubleCsrf({
  //   getSecret: () => sha256(`${name}-${hostname}-${port}`, wordArray(uuid_v4())),
  //   getSessionIdentifier: (req: Request) => {
  //     const authHeader = req.headers.authorization
  //     if (!authHeader || !authHeader.startsWith('Bearer ')) return ''
  //     const token = authHeader.split(' ')[1]
  //     try {
  //       const jwt = this.app.get<JwtService>(JwtService)
  //       const decoded = jwt.verify(token, {
  //         secret: this.jwtConfig.serviceConfig.secret,
  //       })
  //       console.warn(decoded)
  //       return ''
  //     } catch (error) {
  //       this.logger.warn(error.message, Bootstrap.name)
  //       return ''
  //     }
  //   },
  //   cookieName: 'X-CSRF-Token',
  //   cookieOptions: {
  //     httpOnly: true,
  //     sameSite: 'lax',
  //     secure: false,
  //   },
  //   size: 64,
  // })
  // this.app.use(doubleCsrfProtection)

  // Helmet 中间件 https://docs.nestjs.com/security/helmet
  const helmetConfig = configService.get<IHelmetConfig>(HELMET_CONFIG_KEY)!
  helmetConfig.enabled ? appInstance.use(helmet(helmetConfig.config)) : logger.debug(`Helmet 未启用`)

  logger.log(`Middlewares 初始化完成`)
}
