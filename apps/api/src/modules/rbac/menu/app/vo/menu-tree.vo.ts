import type { TTreeNodeVO } from '@packages/types'
import type { MenuEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { MenuDetailsVO } from './menu-details.vo'

/** 菜单树节点 */
@ApiSchema({ description: '菜单树节点' })
export class MenuTreeVO extends MenuDetailsVO implements TTreeNodeVO<MenuDetailsVO> {
  /**
   * 菜单子节点列表
   * @example []
   */
  children: MenuTreeVO[]
  constructor(menu?: MenuEntity) {
    super(menu)
    this.children = []
  }
}
