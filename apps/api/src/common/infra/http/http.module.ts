import type { IHttpConfig } from '@/config'
import { HttpModule as nestHttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HTTP_CONFIG_KEY } from '@/config'

/** HTTP模块 */
@Global()
@Module({
  imports: [
    nestHttpModule.registerAsync({
      useFactory(configService: ConfigService) {
        const config = configService.get<IHttpConfig>(HTTP_CONFIG_KEY)!
        return config
      },
      inject: [ConfigService],
    }),
  ],
  exports: [nestHttpModule],
})
export class HttpModule {}
