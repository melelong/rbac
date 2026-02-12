import type { SortEnum, StatusEnum } from '../enums'

/** 对id参数校验 */
export interface IIdDTO {
  /** 业务ID */
  id: string
}

/** 对name参数校验 */
export interface INameDTO {
  /** 名字 */
  name: string
}

/** 对id列表参数校验 */
export interface IIdsDTO {
  /** 业务ID列表 */
  ids: string[]
}

/** 对name列表参数校验 */
export interface INamesDTO {
  /** 名字列表 */
  names: string[]
}

/** 更新状态接口参数校验 */
export interface IUpdateStatusDTO {
  /** 状态 */
  status: StatusEnum
}

/** 更新排序优先级接口参数校验 */
export interface IUpdateSortDTO {
  /** 排序优先级 */
  sort: SortEnum
}

/** 移动单个树节点接口参数校验 */
export interface IMoveTreeNodeDTO {
  /** 父节点ID */
  parentId?: string
}

/** 移动多个树节点接口参数校验 */
export interface IMoveTreeNodesDTO {
  /** 业务ID列表 */
  ids: string[]
  /** 父节点ID */
  parentId?: string
}

/** 查看单个树结构深度参数校验 */
export interface IGetTreeDepthDTO {
  /** 树结构深度 */
  depth?: number
}

/** 查看多个树结构深度参数校验 */
export interface IGetTreeDepthsDTO {
  /** 业务ID列表 */
  ids: string[]
  /** 树结构深度 */
  depth?: number
}
