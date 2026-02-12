import type { RoleIdDTO, UpdateRoleDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 更新角色Command */
export class UpdateRoleCommand extends Command<never[]> {
  constructor(
    public readonly id: RoleIdDTO['id'],
    public readonly updateRoleDTO: UpdateRoleDTO,
  ) {
    super()
  }
}
