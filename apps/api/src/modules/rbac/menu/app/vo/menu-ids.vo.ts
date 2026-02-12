import type { IMenuIdsVO } from '@packages/types'
import type { MenuEntity } from '../../domain'

/** 菜单ID列表VO */
export class MenuIdsVO implements IMenuIdsVO {
  /**
   * 菜单ID列表
   * @example []
   */
  ids: string[]
  constructor(menus?: MenuEntity[]) {
    if (menus) this.ids = menus.map((item) => item.id)
  }
}
