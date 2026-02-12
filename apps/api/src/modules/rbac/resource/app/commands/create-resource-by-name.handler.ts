import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { ResourceDomainService } from '../../domain'
import { ResourceVOAssembler } from '../assemblers'
import { CreateResourceByNameCommand } from './create-resource-by-name.command'

/** 通过名字创建资源Handler */
@CommandHandler(CreateResourceByNameCommand)
export class CreateResourceByNameHandler implements ICommandHandler<CreateResourceByNameCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly resourceDomainService: ResourceDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: CreateResourceByNameCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const [resource] = await this.resourceDomainService.createResources(em, [command.createResourceDTO], by)
      return ResourceVOAssembler.toDetailsVO(resource)
    })
  }
}
