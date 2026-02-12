import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { AuthDomainService } from '../../domain'
import { UpdateAuthStatusCommand } from './update-auth-status.command'

/** 更新认证状态Handler */
@CommandHandler(UpdateAuthStatusCommand)
export class UpdateAuthStatusHandler implements ICommandHandler<UpdateAuthStatusCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly authDomainService: AuthDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateAuthStatusCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.authDomainService.updateAuthsStatus(em, [command.id], [command.updateStatusDTO], by)
      return []
    })
  }
}
