/** 给部门分配角色接口参数校验  */
export interface IAssignDeptRoleDTO {
  /** 部门ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

/** 批量给部门分配角色接口参数校验  */
export interface IAssignDeptsRoleDTO {
  /** 部门ID列表 */
  ids: string[]
  /** 角色ID列表 */
  roleIds: string[]
}
