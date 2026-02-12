import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { AuthDomainService } from '../../domain'
import { DeleteAuthCommand } from './delete-auth.command'

/** 删除认证Handler */
@CommandHandler(DeleteAuthCommand)
export class DeleteAuthHandler implements ICommandHandler<DeleteAuthCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly authDomainService: AuthDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: DeleteAuthCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await Promise.all([this.authDomainService.deleteAuths(em, [command.id], by)])
      return []
    })
  }
}
