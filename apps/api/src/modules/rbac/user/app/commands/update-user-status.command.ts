import type { UserIdDTO } from '../dto'
import type { UpdateStatusDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新用户状态Command */
export class UpdateUserStatusCommand extends Command<never[]> {
  constructor(
    public readonly id: UserIdDTO['id'],
    public readonly updateStatusDTO: UpdateStatusDTO,
  ) {
    super()
  }
}
