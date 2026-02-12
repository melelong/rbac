import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { LogContextMethod } from '@/common/deco'
import { AuthDomainService } from '../../domain'
import { LogoutCommand } from './logout.command'

/** 登出Handler */
@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly clsService: ClsService,
    private readonly authDomainService: AuthDomainService,
  ) {}

  @LogContextMethod()
  async execute(command: LogoutCommand) {
    await this.authDomainService.logout(command.res)
    return []
  }
}
