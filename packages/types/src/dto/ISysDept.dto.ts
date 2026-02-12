/** 创建部门接口参数校验 */
export interface ICreateSysDeptDTO {
  /** 部门名 */
  name: string
  /** 备注 */
  remark?: string
}

/** 更新部门接口参数校验 */
export interface IUpdateSysDeptDTO {
  /** 部门名 */
  name?: string
  /** 备注 */
  remark?: string
}
