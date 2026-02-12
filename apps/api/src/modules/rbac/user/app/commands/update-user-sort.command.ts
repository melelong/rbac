import type { UserIdDTO } from '../dto'
import type { UpdateSortDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新用户排序Command */
export class UpdateUserSortCommand extends Command<never[]> {
  constructor(
    public readonly id: UserIdDTO['id'],
    public readonly updateSortDTO: UpdateSortDTO,
  ) {
    super()
  }
}
