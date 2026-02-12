import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { LogContextMethod } from '@/common/deco'
import { AuthDomainService } from '../../domain'
import { AuthVOAssembler } from '../assemblers'
import { LoginCommand } from './login.command'

/** 登录Handler */
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly clsService: ClsService,
    private readonly authDomainService: AuthDomainService,
  ) {}

  @LogContextMethod()
  async execute(command: LoginCommand) {
    const VO = await this.authDomainService.login(command.res)
    return AuthVOAssembler.toTokenVO(VO)
  }
}
