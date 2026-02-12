import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleResourceService } from '../services'
import { AssignRoleResourceCommand } from './assign-role-resource.command'

/** 给角色分配资源Handler */
@CommandHandler(AssignRoleResourceCommand)
export class AssignRoleResourceHandler implements ICommandHandler<AssignRoleResourceCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleResourceService: RoleResourceService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: AssignRoleResourceCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { id, resourceIds } = command.assignRoleResourceDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleResourceService.assignRolesResourceByIds(em, { ids: [id], resourceIds }, by)
      return []
    })
  }
}
