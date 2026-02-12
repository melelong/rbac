/** 给角色分配资源接口参数校验  */
export interface IAssignRoleResourceDTO {
  /** 角色ID */
  id: string
  /** 资源ID列表 */
  resourceIds: string[]
}

/** 批量给角色分配资源接口参数校验  */
export interface IAssignRolesResourceDTO {
  /** 角色ID列表 */
  ids: string[]
  /** 资源ID列表 */
  resourceIds: string[]
}
