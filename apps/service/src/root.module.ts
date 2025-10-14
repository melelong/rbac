import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import type { ConfigFactory } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { HttpExceptionFilter } from '@/common/filters/httpException.filter'
import { systemExceptionFilter } from '@/common/filters/systemException.filter'
import { JwtGuard } from '@/common/guards/jwt.guard'
import { HttpInterceptor } from '@/common/interceptors/http.interceptor'
import { ALL_CONFIG } from '@/configs'
import { InfrastructureModule } from '@/infrastructure/infrastructure.module'
import { Logger2Middleware } from '@/infrastructure/logger2/logger2.middleware'
import { Throttler2Guard } from '@/infrastructure/throttler2/throttler2.guard'
import { BusinessModule } from '@/modules/business.module'
/** 根模块 */
@Module({
  imports: [
    /** 配置模块 */
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
      envFilePath: ['.env.local', `.env.${process.env.ENV_NAME}`, '.env'],
      load: [...Object.values<ConfigFactory>(ALL_CONFIG)],
      cache: true,
    }),
    InfrastructureModule,
    BusinessModule,
  ],
  providers: [
    // 节流器守卫
    { provide: APP_GUARD, useClass: Throttler2Guard },
    // JWT守卫
    { provide: APP_GUARD, useClass: JwtGuard },
    // 系统异常过滤器
    { provide: APP_FILTER, useClass: systemExceptionFilter },
    // http异常过滤器
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // http拦截器
    { provide: APP_INTERCEPTOR, useClass: HttpInterceptor },
  ],
})
export class RootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger2Middleware).forRoutes('*')
  }
}
