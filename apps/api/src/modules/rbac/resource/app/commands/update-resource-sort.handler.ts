import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { LoggingService, REQ_CTX } from '@/common/infra'
import { ResourceDomainService } from '../../domain'
import { UpdateResourceSortCommand } from './update-resource-sort.command'

/** 更新资源排序Handler */
@CommandHandler(UpdateResourceSortCommand)
export class UpdateResourceSortHandler implements ICommandHandler<UpdateResourceSortCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly resourceDomainService: ResourceDomainService,
    private readonly loggingService: LoggingService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: UpdateResourceSortCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.resourceDomainService.updateResourcesSort(em, [command.id], [command.updateSortDTO], by)
      return []
    })
  }
}
