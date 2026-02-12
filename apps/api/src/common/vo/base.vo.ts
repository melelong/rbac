import type { SortEnum, StatusEnum } from '@packages/types'

/** 基础VO */
export abstract class BaseVO {
  /**
   * 业务名(需要子类实现)
   */
  abstract name: string
  /*
   * 业务ID(需要子类实现)
   */
  abstract id: string
  /**
   * 创建者
   * @example 'xxx'
   */
  createdBy: string
  /**
   * 更新者
   * @example 'xxx'
   */
  updatedBy: string
  /**
   * 创建时间
   * @example 'xxx'
   */
  createdAt: Date
  /**
   * 更新时间
   * @example 'xxx'
   */
  updatedAt: Date
  /**
   * 备注
   * @example ''
   */
  remark: string | null
  /**
   * 状态(未知:10 启用:20 禁用:30)
   * @example 20
   */
  status: StatusEnum
  /**
   * 排序优先级(低优先级:10 中等优先级:20 高优先级:30)
   * @example 10
   */
  sort: SortEnum
}
