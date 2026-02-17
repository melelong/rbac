import type { IAppConfig, IWinstonConfig } from '@/config'

import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { WinstonModule } from 'nest-winston'
import { APP_CONFIG_KEY, WINSTON_CONFIG_KEY } from '@/config'
import { LoggingProcessor } from './logging.processor'
import { LoggingService } from './logging.service'
import { createConsoleTransport, createMongoDBTransport } from './transports'

/** 日志模块 */
@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const {
          mongodbConfig: { uri },
        } = configService.get<IWinstonConfig>(WINSTON_CONFIG_KEY)!
        return {
          uri,
          onConnectionCreate(connection) {
            if (LoggingService.MongoConnection) return
            LoggingService.MongoConnection = connection
            LoggingService.MongoConnection.on('connected', () => console.log('mongo connected'))
            LoggingService.MongoConnection.on('open', () => console.log('mongo open'))
            LoggingService.MongoConnection.on('disconnected', () => console.log('mongo disconnected'))
            LoggingService.MongoConnection.on('reconnected', () => console.log('mongo reconnected'))
            LoggingService.MongoConnection.on('disconnecting', () => console.log('mongo disconnecting'))
          },
        }
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const { name } = configService.get<IAppConfig>(APP_CONFIG_KEY)!
        LoggingService.appName = name
        const { level, mongodbConfig } = configService.get<IWinstonConfig>(WINSTON_CONFIG_KEY)!
        if (!LoggingService.Logger) {
          LoggingService.Logger = LoggingService.createLogger({
            level,
            transports: [createConsoleTransport()],
            exitOnError: false,
          })
        } else {
          LoggingService.Logger.level = level
        }
        LoggingService.Logger.add(await createMongoDBTransport('app', 'warn', mongodbConfig))
        return {
          level,
          instance: LoggingService.Logger,
        }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [LoggingService, LoggingProcessor],
  exports: [LoggingService, LoggingProcessor],
})
export class LoggingModule {}
