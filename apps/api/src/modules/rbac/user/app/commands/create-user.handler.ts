import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { DEFAULT_ROLES, RoleDomainService } from '@/modules/rbac/role/domain'
import { UserDomainService } from '../../domain'
import { UserVOAssembler } from '../assemblers'
import { UserRoleService } from '../services'
import { CreateUserByNameCommand } from './create-user.command'

/** 创建用户Handler */
@CommandHandler(CreateUserByNameCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserByNameCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly userDomainService: UserDomainService,
    private readonly roleDomainService: RoleDomainService,
    private readonly userRoleService: UserRoleService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: CreateUserByNameCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      // 创建新用户
      const [[user], [role]] = await Promise.all([
        this.userDomainService.createUsers(em, [command.createUserDTO], by),
        this.roleDomainService.getRolesByCodes([DEFAULT_ROLES.USER.roleCode], false, em),
      ])
      // 赋予默认角色(普通用户)
      await this.userRoleService.assignUsersRoleByIds(em, { ids: [user.id], roleIds: [role.id] }, by)
      return UserVOAssembler.toDetailsVO(user)
    })
  }
}
