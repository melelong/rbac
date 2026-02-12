/** 给用户分配角色接口参数校验  */
export interface IAssignUserRoleDTO {
  /** 用户ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

/** 批量给用户分配角色接口参数校验  */
export interface IAssignUsersRoleDTO {
  /** 用户ID列表 */
  ids: string[]
  /** 角色ID列表 */
  roleIds: string[]
}
