import type { ResourceTypeEnum } from '../enums'
import type { ICommonVO, IFindAllVO, IIdsVO } from './ICommon.vo'

/** 资源详情 */
export interface IResourceDetailsVO extends ICommonVO {
  /** 资源名 */
  name: string
  /** 资源编码(资源类型:领域:方法) */
  resourceCode: string
  /** 资源类型(接口:10 静态资源:20 WebSocket连接点:30 定时任务:40 数据权限:50) */
  resourceType: ResourceTypeEnum
  /** 领域 */
  domain: string
  /** 方法 */
  method: string
}

/** 分页查询资源详情列表 */
export interface IFindAllResourceVO extends IFindAllVO<IResourceDetailsVO> {}

/** 资源ID列表 */
export interface IResourceIdsVO extends IIdsVO {}
