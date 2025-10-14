import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailStrategy } from './strategys/email.strategy'
import { JwtStrategy } from './strategys/jwt.strategy'
import { NameStrategy } from './strategys/name.strategy'

/** 认证模块 */
@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, NameStrategy, JwtStrategy, EmailStrategy],
  exports: [AuthService, NameStrategy, JwtStrategy, EmailStrategy],
})
export class AuthModule {}
