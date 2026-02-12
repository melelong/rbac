import type { SortEnum, StatusEnum } from '../enums'

/** 成功响应 */
export interface IOKResponse<T = any> {
  /** 业务码 */
  code: number | string
  /** 信息 */
  msg: string
  /** 数据 */
  data: T
  /** 请求地址 */
  originUrl: string
  /** 请求源 */
  referer: string
  /** 客户端信息 */
  userAgent: string
  /** 时间戳 */
  timestamp: number
  /** 客户端IP */
  clientIp: string
}
/** 失败响应 */
export interface IErrorResponse extends IOKResponse<never[]> {}

/** 分页查询 */
export interface IFindAllVO<T = any> {
  /** 数据列表 */
  data: T[]
  /** 总数 */
  total: number
  /** 第几页 */
  page: number
  /** 一页几条数据 */
  limit: number
  /** 总页数 */
  totalPages: number
}

/** 树结构 */
export type TTreeNodeVO<VO = any> = VO & {
  /** 子节点列表 */
  children: TTreeNodeVO<VO>[]
}

export interface IIdsVO {
  /** 业务ID列表 */
  ids: string[]
}

/** 公共字段 */
export interface ICommonVO {
  /** 业务ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 备注 */
  remark: string | null
  /** 状态 */
  status: StatusEnum
  /** 排序优先级 */
  sort: SortEnum
}
