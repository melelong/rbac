import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleDomainService } from '../../domain'
import { RoleMenuService, RoleResourceService } from '../services'
import { DeleteRoleCommand } from './delete-role.command'

/** 删除角色Handler */
@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleDomainService: RoleDomainService,
    private readonly roleMenuService: RoleMenuService,
    private readonly roleResourceService: RoleResourceService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: DeleteRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      // 置空关联关系
      await Promise.all([
        this.roleMenuService.assignRolesMenuByIds(em, { ids: [command.id], menuIds: [] }, by),
        this.roleResourceService.assignRolesResourceByIds(em, { ids: [command.id], resourceIds: [] }, by),
      ])
      await this.roleDomainService.deleteRoles(em, [command.id], by)
      return []
    })
  }
}
