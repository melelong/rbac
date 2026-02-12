import type { MenuIdDTO } from '../dto'
import type { MenuDetailsVO } from '../vo'
import { Query } from '@nestjs/cqrs'

/** 获取菜单详情Query */
export class GetMenuByIdQuery extends Query<MenuDetailsVO> {
  constructor(public readonly id: MenuIdDTO['id']) {
    super()
  }
}
