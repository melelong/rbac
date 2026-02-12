import type { AssignUsersRoleDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 批量给用户分配角色Command */
export class AssignUsersRoleCommand extends Command<never[]> {
  constructor(public readonly assignUsersRoleDTO: AssignUsersRoleDTO) {
    super()
  }
}
