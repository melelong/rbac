import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { ClsService } from 'nestjs-cls'
import { EntityManager } from 'typeorm'
import { SYSTEM_DEFAULT_BY } from '@/common/constants'
import { LogContextMethod } from '@/common/deco'
import { REQ_CTX } from '@/common/infra'
import { RoleDomainService } from '../../domain'
import { RoleVOAssembler } from '../assemblers'
import { MoveRoleCommand } from './move-role.command'

/** 移动角色树节点Handler */
@CommandHandler(MoveRoleCommand)
export class MoveRoleHandler implements ICommandHandler<MoveRoleCommand> {
  constructor(
    private readonly em: EntityManager,
    private readonly roleDomainService: RoleDomainService,
    private readonly clsService: ClsService,
  ) {}

  @LogContextMethod()
  async execute(command: MoveRoleCommand) {
    return this.em.transaction(async (em: EntityManager) => {
      const { parentId } = command.moveRoleDTO
      const by = this.clsService.get<string>(REQ_CTX.USER_ID) ?? SYSTEM_DEFAULT_BY
      const [role] = await this.roleDomainService.moveRoles(em, [command.id], [parentId ?? null], by)
      return RoleVOAssembler.toDetailsVO(role)
    })
  }
}
