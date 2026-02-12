import type { AuthIdDTO } from '../dto'
import type { UpdateSortDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新认证排序Command */
export class UpdateAuthSortCommand extends Command<never[]> {
  constructor(
    public readonly id: AuthIdDTO['id'],
    public readonly updateSortDTO: UpdateSortDTO,
  ) {
    super()
  }
}
