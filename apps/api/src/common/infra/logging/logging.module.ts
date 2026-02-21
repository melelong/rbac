import type { IAppConfig, IWinstonConfig } from '@/config'
import { Global, Logger, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { WinstonModule } from 'nest-winston'
import { APP_CONFIG_KEY, WINSTON_CONFIG_KEY } from '@/config'
import { LoggingProcessor } from './logging.processor'
import { LoggingService } from './logging.service'
import { createConsoleTransport, createFileTransport, createMongoDBTransport } from './transports'

/** 日志模块 */
@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { name } = configService.get<IAppConfig>(APP_CONFIG_KEY)!
        LoggingService.appName = name
        const { level, mongodbConfig, mode, fileConfig } = configService.get<IWinstonConfig>(WINSTON_CONFIG_KEY)!
        if (!LoggingService.Logger) {
          LoggingService.Logger = LoggingService.createLogger({
            level,
            transports: [createConsoleTransport()],
            exitOnError: false,
          })
        } else {
          LoggingService.Logger.level = level
        }
        LoggingService.Logger.add(createFileTransport('app', 'error', mode, fileConfig))
        LoggingService.Logger.add(createFileTransport('app', 'warn', mode, fileConfig))
        LoggingService.Logger.add(createFileTransport('app', 'verbose', mode, fileConfig))
        LoggingService.Logger.add(createFileTransport('http', 'info', mode, fileConfig))
        if (mode === 'mongodb') {
          LoggingService.Logger!.add(await createMongoDBTransport('app', 'error', mode, mongodbConfig))
          LoggingService.Logger!.add(await createMongoDBTransport('app', 'warn', mode, mongodbConfig))
          LoggingService.Logger!.add(await createMongoDBTransport('app', 'verbose', mode, mongodbConfig))
          LoggingService.Logger!.add(await createMongoDBTransport('http', 'info', mode, mongodbConfig))
        }
        return {
          level,
          instance: LoggingService.Logger,
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const {
          mongodbConfig: { uri },
        } = configService.get<IWinstonConfig>(WINSTON_CONFIG_KEY)!
        return {
          uri,
          retryAttempts: 30,
          retryDelay: 3000,
          // lazyConnection: true,
          connectionErrorFactory(err) {
            LoggingModule.logger.error(`mongodb1:${err.message}`, err.stack)
            return err
          },
          onConnectionCreate(connection) {
            if (LoggingService.MongoConnection) return LoggingService.MongoConnection
            LoggingService.MongoConnection = connection
            LoggingService.MongoConnection.on('open', () => LoggingModule.logger.verbose('mongodb 连接成功'))
            LoggingService.MongoConnection.on('disconnected', () => LoggingModule.logger.warn('mongodb 已断开连接'))
            LoggingService.MongoConnection.on('reconnected', () => LoggingModule.logger.warn('mongodb 重新连接中...'))
            LoggingService.MongoConnection.on('disconnecting', () => LoggingModule.logger.warn('mongodb 断开连接中...'))
            LoggingService.MongoConnection.on('error', (err) => LoggingModule.logger.error(`mongodb:${err.message}`, err.stack))
            return LoggingService.MongoConnection
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [LoggingService, LoggingProcessor],
  exports: [LoggingService, LoggingProcessor],
})
export class LoggingModule {
  public static logger: Logger = new Logger(LoggingModule.name)
}
