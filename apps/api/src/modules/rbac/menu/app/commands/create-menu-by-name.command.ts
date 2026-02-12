import type { CreateMenuDTO } from '../dto'
import type { MenuDetailsVO } from '../vo'
import { Command } from '@nestjs/cqrs'

/** 通过名字创建菜单Command */
export class CreateMenuByNameCommand extends Command<MenuDetailsVO> {
  constructor(public readonly createMenuDTO: CreateMenuDTO) {
    super()
  }
}
