import type { AuthIdDTO } from '../dto'
import type { UpdateStatusDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新认证状态Command */
export class UpdateAuthStatusCommand extends Command<never[]> {
  constructor(
    public readonly id: AuthIdDTO['id'],
    public readonly updateStatusDTO: UpdateStatusDTO,
  ) {
    super()
  }
}
