import type { CheckEnum, IMenuDetailsVO, MenuTypeEnum } from '@packages/types'
import type { MenuEntity } from '../../domain'
import { ApiSchema } from '@nestjs/swagger'
import { omit } from 'lodash-es'
import { BaseVO } from '@/common/vo'

/** 菜单详情 */
@ApiSchema({ description: '菜单详情' })
export class MenuDetailsVO extends BaseVO implements IMenuDetailsVO {
  /**
   * 菜单父节点ID
   * @example '菜单父节点ID'
   */
  parentId: string | null
  /**
   * 菜单ID
   * @example 'xxx'
   */
  id: string
  /**
   * 菜单名
   * @example '菜单名'
   */
  name: string
  /**
   * 菜单编码(菜单类型:领域:操作类型)
   * @example 'MENU:USER:MANAGEMENT'
   */
  menuCode: string
  /**
   * 菜单类型
   * @example 10
   */
  menuType: MenuTypeEnum
  /**
   * 菜单领域
   * @example 'USER'
   */
  domain: string
  /**
   * 菜单操作类型
   * @example 'MANAGEMENT'
   */
  action: string
  /**
   * 访问路径(MENU,LINK,INNER_LINK)
   * @example '/user'
   */
  path: string | null
  /**
   * 路由参数(MENU)
   * @example '{id:"xxx"}'
   */
  query: string | null
  /**
   * 组件路径(COMPONENT)
   * @example 'UserButton'
   */
  component: string | null
  /**
   * 图标地址(MENU,DIRECTORY,LINK,INNER_LINK)
   * @example 'https://www.icon.com'
   */
  icon: string | null
  /**
   * 是否缓存(MENU,COMPONENT,INNER_LINK)
   * @example 10
   */
  isCache: CheckEnum
  /**
   * 是否隐藏(MENU)
   * @example 10
   */
  isVisible: CheckEnum
  /**
   * 是否刷新(MENU)
   * @example 10
   */
  isRefresh: CheckEnum

  constructor(menu?: MenuEntity) {
    super()
    if (menu) {
      const keys = ['_id', 'ancestorNodes', 'descendantNodes', 'roles']
      const omitResult = omit(menu, keys)
      Object.assign(this, omitResult)
    }
  }
}
