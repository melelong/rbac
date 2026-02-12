import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleMenuService } from '../services'
import { AssignRolesMenuCommand } from './assign-roles-menu.command'

/** 批量给角色分配菜单Handler */
@CommandHandler(AssignRolesMenuCommand)
export class AssignRolesMenuHandler implements ICommandHandler<AssignRolesMenuCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleMenuService: RoleMenuService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: AssignRolesMenuCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.roleMenuService.assignRolesMenuByIds(em, command.assignRolesMenuDTO, by)
      return []
    })
  }
}
