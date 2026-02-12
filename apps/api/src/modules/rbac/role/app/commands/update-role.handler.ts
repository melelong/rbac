import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { RoleDomainService } from '../../domain'
import { UpdateRoleCommand } from './update-role.command'

/** 更新角色Handler */
@CommandHandler(UpdateRoleCommand)
export class UpdateRoleHandler implements ICommandHandler<UpdateRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleDomainService: RoleDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleDomainService.updateRoles(em, [command.id], [command.updateRoleDTO], by)
      return []
    })
  }
}
