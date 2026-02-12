import type { RoleIdDTO } from '../dto'
import type { UpdateStatusDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新角色状态Command */
export class UpdateRoleStatusCommand extends Command<never[]> {
  constructor(
    public readonly id: RoleIdDTO['id'],
    public readonly updateStatusDTO: UpdateStatusDTO,
  ) {
    super()
  }
}
