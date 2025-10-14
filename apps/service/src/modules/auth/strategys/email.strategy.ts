import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-local'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { AuthService } from '../auth.service'

@Injectable()
export class EmailStrategy extends PassportStrategy(Strategy, 'Email') {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService<ILoggerCls>,
  ) {
    super({ usernameField: 'email', passwordField: 'pwd' })
  }

  async validate(email: string, pwd: string) {
    const userInfo = await this.authService.validateEmail(email, pwd)
    this.clsService.set(LOGGER_CLS.USER_INFO, userInfo)
    return userInfo
  }
}
