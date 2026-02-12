import type { DataScopeEnum } from '../enums'
import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'
// import type { IMenuDetailsVO } from './IMenu.vo'
// import type { IResourceDetailsVO } from './IResource.vo'

/** 角色详情 */
export interface IRoleDetailsVO extends ICommonVO {
  /** 父角色ID */
  parentId: string | null
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope: DataScopeEnum
  /** 菜单列表 */
  // menus: IMenuDetailsVO[]
  /** 资源列表 */
  // resources: IResourceDetailsVO[]
}

/** 分页查询角色详情列表 */
export interface IFindAllRoleVO extends IFindAllVO<IRoleDetailsVO> {}

/** 角色ID列表 */
export interface IRoleIdsVO extends IIdsVO {}
