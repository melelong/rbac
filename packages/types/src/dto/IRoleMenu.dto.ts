/** 给角色分配菜单接口参数校验  */
export interface IAssignRoleMenuDTO {
  /** 角色ID */
  id: string
  /** 菜单ID列表 */
  menuIds: string[]
}

/** 批量给角色分配菜单接口参数校验  */
export interface IAssignRolesMenuDTO {
  /** 角色ID列表 */
  ids: string[]
  /** 菜单ID列表 */
  menuIds: string[]
}
