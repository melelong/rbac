import type { MiddlewareConsumer, ModuleMetadata, NestModule, Type } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { CacheExceptionFilter, HttpExceptionFilter, OrmExceptionFilter, UnknownExceptionFilter } from '@/common/filters'
import { JwtGuard, ResourceGuard, ThrottlerGuard } from '@/common/guards'
import { CacheModule, EmailModule, HttpModule, LoggingModule, OrmModule, QueueModule, ThrottlerModule } from '@/common/infra'
import { CtxModule } from '@/common/infra/ctx'
import { HttpInterceptor } from '@/common/interceptors'
import { CtxMiddleware } from '@/common/middlewares'
import { ConfigModule } from '@/config'
import { AuthModule, MenuModule, ResourceModule, RoleModule, UserModule } from '@/modules'
import { BootController } from './boot.controller'

/** 基础设施模块 */
const infrastructureModule: ModuleMetadata['imports'] = [
  ConfigModule,
  EventEmitterModule.forRoot({
    maxListeners: 0,
    wildcard: true,
    delimiter: '.',
    newListener: true,
    removeListener: true,
    verboseMemoryLeak: true,
  }),
  CtxModule,
  CqrsModule.forRoot(),
  HttpModule,
  OrmModule,
  ThrottlerModule,
  QueueModule,
  CacheModule,
  EmailModule,
  LoggingModule,
]

/** 业务模块 */
const businessModule: ModuleMetadata['imports'] = [MenuModule, ResourceModule, RoleModule, UserModule, AuthModule]

/** 全局中间件 */
// eslint-disable-next-line ts/no-unsafe-function-type
const globalMiddleware: (Type<any> | Function)[] = [CtxMiddleware]

/** 全局守卫 */
const globalGuard: ModuleMetadata['providers'] = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  {
    provide: APP_GUARD,
    useClass: JwtGuard,
  },
  {
    provide: APP_GUARD,
    useClass: ResourceGuard,
  },
]

/** 全局拦截器 */
const globalInterceptor: ModuleMetadata['providers'] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: HttpInterceptor,
  },
]

/** 全局过滤器 */
const globalFilter: ModuleMetadata['providers'] = [
  {
    provide: APP_FILTER,
    useClass: UnknownExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: OrmExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: CacheExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
]

/** 启动模块 */
@Module({
  imports: [...infrastructureModule, ...businessModule],
  controllers: [BootController],
  providers: [...globalGuard, ...globalInterceptor, ...globalFilter],
})
export class BootModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(...globalMiddleware).forRoutes('*')
  }
}
