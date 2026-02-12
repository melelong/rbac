import type { MenuIdDTO, UpdateMenuDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 更新菜单Command */
export class UpdateMenuCommand extends Command<never[]> {
  constructor(
    public readonly id: MenuIdDTO['id'],
    public readonly updateMenuDTO: UpdateMenuDTO,
  ) {
    super()
  }
}
