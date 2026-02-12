import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { UserRoleService } from '../services'
import { AssignUserRoleCommand } from './assign-user-role.command'

/** 给用户分配角色Handler */
@CommandHandler(AssignUserRoleCommand)
export class AssignUserRoleHandler implements ICommandHandler<AssignUserRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: AssignUserRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { id, roleIds } = command.assignUserRoleDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.userRoleService.assignUsersRoleByIds(em, { ids: [id], roleIds }, by)
      return []
    })
  }
}
