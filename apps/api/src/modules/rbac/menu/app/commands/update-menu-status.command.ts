import type { MenuIdDTO } from '../dto'
import type { UpdateStatusDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新菜单状态Command */
export class UpdateMenuStatusCommand extends Command<never[]> {
  constructor(
    public readonly id: MenuIdDTO['id'],
    public readonly updateStatusDTO: UpdateStatusDTO,
  ) {
    super()
  }
}
