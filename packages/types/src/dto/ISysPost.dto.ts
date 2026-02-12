/** 创建岗位接口参数校验 */
export interface ICreateSysPostDTO {
  /** 岗位名 */
  name: string
  /** 备注 */
  remark?: string
}

/** 更新岗位接口参数校验 */
export interface IUpdateSysPostDTO {
  /** 岗位名 */
  name?: string
  /** 备注 */
  remark?: string
}
