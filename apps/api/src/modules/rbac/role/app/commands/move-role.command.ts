import type { MoveRoleDTO, RoleIdDTO } from '../dto'
import type { RoleDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 移动角色树节点Command */
export class MoveRoleCommand extends Command<RoleDetailsVO> {
  constructor(
    public readonly id: RoleIdDTO['id'],
    public readonly moveRoleDTO: MoveRoleDTO,
  ) {
    super()
  }
}
