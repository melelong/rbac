import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { ResourceDomainService } from '../../domain'
import { UpdateResourceStatusCommand } from './update-resource-status.command'

/** 更新资源状态Handler */
@CommandHandler(UpdateResourceStatusCommand)
export class UpdateResourceStatusHandler implements ICommandHandler<UpdateResourceStatusCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly resourceDomainService: ResourceDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateResourceStatusCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.resourceDomainService.updateResourcesStatus(em, [command.id], [command.updateStatusDTO], by)
      return []
    })
  }
}
