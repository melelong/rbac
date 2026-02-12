import type { ModuleMetadata } from '@nestjs/common'
import type { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import type { JwtConfigType } from '@/config'
import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JWT_CONFIG_KEY } from '@/config'
import {
  CreateAuthByNameHandler,
  DeleteAuthHandler,
  GetAuthByIdHandler,
  GetAuthsHandler,
  GetMeInfoHandler,
  GetSvgCaptchaHandler,
  LoginHandler,
  LogoutHandler,
  RefreshTokenHandler,
  RegisterHandler,
  ResetPwdHandler,
  SendEmailCaptchaHandler,
  UpdateAuthHandler,
  UpdateAuthSortHandler,
  UpdateAuthStatusHandler,
} from './app'
import { AuthUserService } from './app/services'
import {
  EmailLoginStrategy,
  EmailRegisterStrategy,
  EmailResetPwdStrategy,
  JwtStrategy,
  PhoneLoginStrategy,
  RefreshTokenStrategy,
  SvgLoginStrategy,
} from './app/strategies'
import { AuthDomainListener, AuthDomainService, AuthEntity, AuthValidateService, CaptchaService, TokenService } from './domain'
import { AuthController } from './iface/controllers'
import { AuthRepository } from './infra/repo'

/** 实体 */
const entities: EntityClassOrSchema[] = [AuthEntity]
/** 控制器 */
const controllers: ModuleMetadata['controllers'] = [AuthController]
/** 护照策略 */
const passportStrategies: ModuleMetadata['providers'] = [
  SvgLoginStrategy,
  EmailLoginStrategy,
  PhoneLoginStrategy,
  JwtStrategy,
  RefreshTokenStrategy,
  EmailRegisterStrategy,
  EmailResetPwdStrategy,
]
/** 命令处理 */
const commandHandlers: ModuleMetadata['providers'] = [
  CreateAuthByNameHandler,
  DeleteAuthHandler,
  UpdateAuthHandler,
  UpdateAuthSortHandler,
  UpdateAuthStatusHandler,
  SendEmailCaptchaHandler,
  LoginHandler,
  LogoutHandler,
  RefreshTokenHandler,
  RegisterHandler,
  ResetPwdHandler,
]
/** 查询处理 */
const queryHandlers: ModuleMetadata['providers'] = [GetAuthsHandler, GetAuthByIdHandler, GetSvgCaptchaHandler, GetMeInfoHandler]
/** 事件处理 */
const eventHandlers: ModuleMetadata['providers'] = [AuthDomainListener]
/** 服务 */
const services: ModuleMetadata['providers'] = [AuthValidateService, AuthDomainService, CaptchaService, TokenService, JwtService, AuthUserService]
/** 仓库 */
const repo: ModuleMetadata['providers'] = [AuthRepository]
/** 认证模块 */
@Global()
@Module({
  imports: [
    /** JWT 模块 */
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const { config } = configService.get<JwtConfigType>(JWT_CONFIG_KEY)!
        return config
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers,
  providers: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...passportStrategies],
  exports: [...repo, ...services, ...commandHandlers, ...queryHandlers, ...eventHandlers, ...passportStrategies],
})
export class AuthModule {}
