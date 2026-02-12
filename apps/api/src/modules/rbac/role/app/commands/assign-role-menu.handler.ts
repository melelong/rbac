import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleMenuService } from '../services'
import { AssignRoleMenuCommand } from './assign-role-menu.command'

/** 给角色分配菜单Handler */
@CommandHandler(AssignRoleMenuCommand)
export class AssignRoleMenuHandler implements ICommandHandler<AssignRoleMenuCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleMenuService: RoleMenuService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: AssignRoleMenuCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { id, menuIds } = command.assignRoleMenuDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleMenuService.assignRolesMenuByIds(em, { ids: [id], menuIds }, by)
      return []
    })
  }
}
