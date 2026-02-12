import type { RoleIdDTO } from '../dto'
import type { UpdateSortDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新角色排序Command */
export class UpdateRoleSortCommand extends Command<never[]> {
  constructor(
    public readonly id: RoleIdDTO['id'],
    public readonly updateSortDTO: UpdateSortDTO,
  ) {
    super()
  }
}
