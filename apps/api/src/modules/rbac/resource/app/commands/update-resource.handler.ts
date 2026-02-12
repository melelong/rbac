import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { ResourceDomainService } from '../../domain'
import { UpdateResourceCommand } from './update-resource.command'

/** 更新资源Handler */
@CommandHandler(UpdateResourceCommand)
export class UpdateResourceHandler implements ICommandHandler<UpdateResourceCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly resourceDomainService: ResourceDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateResourceCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.resourceDomainService.updateResources(em, [command.id], [command.updateResourceDTO], by)
      return []
    })
  }
}
