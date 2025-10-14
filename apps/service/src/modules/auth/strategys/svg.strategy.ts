import type { ILoggerCls } from '@/infrastructure/logger2/ILogger2'
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ClsService } from 'nestjs-cls'
import { Strategy } from 'passport-local'
import { LOGGER_CLS } from '@/infrastructure/logger2/logger2.constant'
import { AuthService } from '../auth.service'

@Injectable()
export class SvgStrategy extends PassportStrategy(Strategy, 'Svg') {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService<ILoggerCls>,
  ) {
    super({ usernameField: 'name', passwordField: 'pwd' })
  }

  async validate(name: string, pwd: string) {
    const userInfo = await this.authService.validateUser(name, pwd)
    this.clsService.set(LOGGER_CLS.USER_INFO, userInfo)
    return userInfo
  }
}
