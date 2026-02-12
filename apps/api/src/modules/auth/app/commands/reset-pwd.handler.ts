import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { LogContextMethod } from '@/common/deco'
import { AuthDomainService } from '../../domain'
import { ResetPwdCommand } from './reset-pwd.command'

/** 重置密码Handler */
@CommandHandler(ResetPwdCommand)
export class ResetPwdHandler implements ICommandHandler<ResetPwdCommand> {
  constructor(
    private readonly clsService: ClsService,
    private readonly authDomainService: AuthDomainService,
  ) {}

  @LogContextMethod()
  async execute(command: ResetPwdCommand) {
    await this.authDomainService.resetPwd(command.res)
    return []
  }
}
