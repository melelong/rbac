import type { MenuIdDTO } from '../dto'
import type { UpdateSortDTO } from '@/common/dto'
import { Command } from '@nestjs/cqrs'

/** 更新菜单排序Command */
export class UpdateMenuSortCommand extends Command<never[]> {
  constructor(
    public readonly id: MenuIdDTO['id'],
    public readonly updateSortDTO: UpdateSortDTO,
  ) {
    super()
  }
}
