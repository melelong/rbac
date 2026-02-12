import type { MenuIdDTO } from '../dto'
import { Command } from '@nestjs/cqrs'

/** 删除菜单Command */
export class DeleteMenuCommand extends Command<never[]> {
  constructor(public readonly id: MenuIdDTO['id']) {
    super()
  }
}
