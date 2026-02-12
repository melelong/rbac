import type { AssignUserRoleDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 给用户分配角色Command */
export class AssignUserRoleCommand extends Command<never[]> {
  constructor(public readonly assignUserRoleDTO: AssignUserRoleDTO) {
    super()
  }
}
