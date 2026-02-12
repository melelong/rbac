/** 给用户分配岗位接口参数校验  */
export interface IAssignUserPostDTO {
  /** 用户ID */
  id: string
  /** 岗位ID */
  postIds: string
}

/** 批量给用户分配岗位接口参数校验  */
export interface IAssignUsersPostDTO {
  /** 用户ID列表 */
  ids: string[]
  /** 岗位ID */
  postId: string
}
