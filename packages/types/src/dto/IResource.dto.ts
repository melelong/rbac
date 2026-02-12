import type { ResourceTypeEnum } from '../enums'

/** 创建资源接口参数校验 */
export interface ICreateResourceDTO {
  /** 资源名 */
  name: string
  /** 资源类型 */
  resourceType: ResourceTypeEnum
  /** 领域 */
  domain: string
  /** 方法 */
  method: string
  /** 备注 */
  remark?: string
}

/** 更新资源接口参数校验 */
export interface IUpdateResourceDTO {
  /** 资源名 */
  name?: string
  /** 资源类型 */
  resourceType?: ResourceTypeEnum
  /** 领域 */
  domain?: string
  /** 方法 */
  method?: string
  /** 备注 */
  remark?: string
}
