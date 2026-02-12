import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleResourceService } from '../services'
import { AssignRolesResourceCommand } from './assign-roles-resource.command'

/** 批量给角色分配资源Handler */
@CommandHandler(AssignRolesResourceCommand)
export class AssignRolesResourceHandler implements ICommandHandler<AssignRolesResourceCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleResourceService: RoleResourceService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: AssignRolesResourceCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleResourceService.assignRolesResourceByIds(em, command.assignRolesResourceDTO, by)
      return []
    })
  }
}
