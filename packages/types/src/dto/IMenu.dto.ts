import type { CheckEnum, MenuTypeEnum } from '../enums'

/** 创建菜单接口参数校验 */
export interface ICreateMenuDTO {
  /** 父菜单ID */
  parentId?: string
  /** 菜单名 */
  name: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType: MenuTypeEnum
  /** 菜单领域 */
  domain: string
  /** 菜单操作类型 */
  action: string
  /** 访问路径(MENU,LINK,INNER_LINK) */
  path: string
  /** 路由参数(MENU) */
  query?: string
  /** 组件路径(COMPONENT) */
  component?: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon?: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache?: CheckEnum
  /** 是否隐藏(MENU) */
  isVisible?: CheckEnum
  /** 是否刷新(MENU) */
  isRefresh?: CheckEnum
  /** 备注 */
  remark?: string
}

/** 更新菜单接口参数校验 */
export interface IUpdateMenuDTO {
  /** 菜单名 */
  name?: string
  /** 菜单类型(10:菜单 20:按钮 30:组件 40:目录 50:外链 60:内链) */
  menuType?: MenuTypeEnum
  /** 菜单领域 */
  domain?: string
  /** 菜单操作类型 */
  action?: string
  /** 访问路径(MENU,LINK,INNER_LINK) */
  path?: string
  /** 路由参数(MENU) */
  query?: string
  /** 组件路径(COMPONENT) */
  component?: string
  /** 图标地址(MENU,DIRECTORY,LINK,INNER_LINK) */
  icon?: string
  /** 是否缓存(MENU,COMPONENT,INNER_LINK) */
  isCache?: CheckEnum
  /** 是否隐藏(MENU) */
  isVisible?: CheckEnum
  /** 是否刷新(MENU) */
  isRefresh?: CheckEnum
  /** 备注 */
  remark?: string
}
