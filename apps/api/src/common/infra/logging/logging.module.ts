import { Global, Module } from '@nestjs/common'
import { LoggingProcessor } from './logging.processor'
import { LoggingService } from './logging.service'

/** 日志模块 */
@Global()
@Module({
  providers: [LoggingService, LoggingProcessor],
  exports: [LoggingService, LoggingProcessor],
})
export class LoggingModule {}
