import type { MenuIdDTO, MoveMenuDTO } from '../dto'
import type { MenuDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 移动菜单树节点Command */
export class MoveMenuCommand extends Command<MenuDetailsVO> {
  constructor(
    public readonly id: MenuIdDTO['id'],
    public readonly moveMenuDTO: MoveMenuDTO,
  ) {
    super()
  }
}
