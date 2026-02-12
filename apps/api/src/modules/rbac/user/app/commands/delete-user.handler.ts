import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { UserDomainService } from '../../domain'
import { UserRoleService } from '../services'
import { DeleteUserCommand } from './delete-user.command'
import { REQ_CTX } from '@/common/infra'

/** 删除用户Handler */
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userDomainService: UserDomainService,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: DeleteUserCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      // 置空关联关系
      await Promise.all([this.userRoleService.assignUsersRoleByIds(em, { ids: [command.id], roleIds: [] }, by)])
      await this.userDomainService.deleteUsers(em, [command.id], by)
      return []
    })
  }
}
