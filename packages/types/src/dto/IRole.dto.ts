import type { DataScopeEnum } from '../enums'

/** 创建角色接口参数校验 */
export interface ICreateRoleDTO {
  /** 角色名 */
  name: string
  /** 角色编码 */
  roleCode: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope: DataScopeEnum
  /** 父角色ID */
  parentId?: string
  /** 备注 */
  remark?: string
}

/** 更新角色接口参数校验 */
export interface IUpdateRoleDTO {
  /** 角色名 */
  name?: string
  /** 角色编码 */
  roleCode?: string
  /** 数据范围(全部:10 仅本人:20 本部门:30 本部门及以下部门:40 自定义:50) */
  dataScope?: DataScopeEnum
  /** 备注 */
  remark?: string
}
