import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { LogContextMethod } from '@/common/deco'
import { AuthDomainService } from '../../domain'
import { AuthVOAssembler } from '../assemblers'
import { RefreshTokenCommand } from './refresh-token.command'

/** 刷新令牌Handler */
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly clsService: ClsService,
    private readonly authDomainService: AuthDomainService,
  ) {}

  @LogContextMethod()
  async execute(command: RefreshTokenCommand) {
    const VO = await this.authDomainService.refreshToken(command.res)
    return AuthVOAssembler.toTokenVO(VO)
  }
}
