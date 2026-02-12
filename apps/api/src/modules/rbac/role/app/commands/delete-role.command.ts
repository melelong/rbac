import type { RoleIdDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 删除角色Command */
export class DeleteRoleCommand extends Command<never[]> {
  constructor(public readonly id: RoleIdDTO['id']) {
    super()
  }
}
