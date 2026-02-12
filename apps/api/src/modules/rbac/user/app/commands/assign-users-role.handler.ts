import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { UserRoleService } from '../services'
import { AssignUsersRoleCommand } from './assign-users-role.command'

/** 批量给用户分配角色Handler */
@CommandHandler(AssignUsersRoleCommand)
export class AssignUsersRoleHandler implements ICommandHandler<AssignUsersRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: AssignUsersRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      await this.userRoleService.assignUsersRoleByIds(em, command.assignUsersRoleDTO, by)
      return []
    })
  }
}
