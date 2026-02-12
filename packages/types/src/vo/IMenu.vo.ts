import type { CheckEnum, MenuTypeEnum } from '../enums'
import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'

/** 菜单详情 */
export interface IMenuDetailsVO extends ICommonVO {
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
}

/** 分页查询菜单详情列表 */
export interface IFindAllMenuVO extends IFindAllVO<IMenuDetailsVO> {}

/** 菜单ID列表 */
export interface IMenuIdsVO extends IIdsVO {}
