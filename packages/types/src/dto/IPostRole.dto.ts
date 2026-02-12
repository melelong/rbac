/** 给岗位分配角色接口参数校验  */
export interface IAssignPostRoleDTO {
  /** 岗位ID */
  id: string
  /** 角色ID列表 */
  roleIds: string[]
}

/** 批量给岗位分配角色接口参数校验  */
export interface IAssignPostsRoleDTO {
  /** 岗位ID列表 */
  ids: string[]
  /** 角色ID列表 */
  roleIds: string[]
}
