import type { CheckEnum, MenuTypeEnum } from '@packages/types'
import type { IMenuTreeEntity } from './IMenuTreeEntity'
import type { ICommonEntity } from '@/common/entities'
import type { IRoleEntity } from '@/modules/rbac/role/domain'
/** 菜单表实体接口 */
export interface IMenuEntity extends ICommonEntity {
  /** 父菜单ID */
  parentId: string | null
  /** 菜单名 */
  name: string
  /** 菜单编码(菜单类型:领域:操作类型) */
  menuCode: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType: MenuTypeEnum
  /** 菜单领域 */
  domain: string
  /** 菜单操作类型 */
  action: string
  /** 访问路径(MENU,LINK,INNER_LINK) */
  path: string | null
  /** 路由参数(MENU) */
  query: string | null
  /** 组件路径(COMPONENT) */
  component: string | null
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon: string | null
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache: CheckEnum
  /** 是否隐藏(MENU) */
  isVisible: CheckEnum
  /** 是否刷新(MENU) */
  isRefresh: CheckEnum
  /** 菜单N-N角色 */
  roles: IRoleEntity[]
  /** 菜单N-1菜单树(所有祖先路径) */
  ancestorNodes: IMenuTreeEntity[]
  /** 菜单N-1菜单树(所有后代路径) */
  descendantNodes: IMenuTreeEntity[]
}
