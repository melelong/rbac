import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { EmailGuard } from '@/common/guards/email.guard'

import { JwtGuard } from '@/common/guards/jwt.guard'
import { SvgGuard } from '@/common/guards/svg.guard'
import { UnifiedLoginGuard } from '@/common/guards/unifiedLogin.guard'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { EmailStrategy } from './strategys/email.strategy'
import { JwtStrategy } from './strategys/jwt.strategy'
import { SvgStrategy } from './strategys/svg.strategy'

/** 认证模块 */
@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, SvgStrategy, JwtStrategy, EmailStrategy, UnifiedLoginGuard, EmailGuard, SvgGuard, JwtGuard],
  exports: [AuthService, SvgStrategy, JwtStrategy, EmailStrategy, UnifiedLoginGuard, EmailGuard, SvgGuard, JwtGuard],
})
export class AuthModule {}
