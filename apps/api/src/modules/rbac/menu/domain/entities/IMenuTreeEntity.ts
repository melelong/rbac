import type { IMenuEntity } from './IMenuEntity'

/** 菜单树表实体接口 */
export interface IMenuTreeEntity {
  /** 祖先菜单ID */
  ancestorId: string
  /** 后代菜单ID */
  descendantId: string
  /** 路径长度(0 表示自己，1 表示父子 ，>1 表示子孙) */
  depth: number
  /** 祖先菜单 */
  ancestorMenu: IMenuEntity
  /** 后代菜单 */
  descendantMenu: IMenuEntity
}
