import type { AggregateRoot } from '@nestjs/cqrs'
import type { SortEnum, StatusEnum } from '@packages/types'
/** 实体公共字段接口 */
export interface ICommonEntity extends AggregateRoot {
  /** 表索引 */
  _id: number
  /** 业务ID */
  id: string
  /** 创建者 */
  createdBy: string
  /** 更新者 */
  updatedBy: string
  /** 删除者 */
  deletedBy: string | null
  /** 创建时间 */
  createdAt: Date
  /** 更新时间 */
  updatedAt: Date
  /** 删除时间 */
  deletedAt: Date | null
  /** 备注说明 */
  remark: string | null
  /** 状态(10:禁用 20:启用 30:未知 默认:20) */
  status: StatusEnum
  /** 排序优先级(10:高 20:中 30:低 默认:20) */
  sort: SortEnum
  /** 插入前初始化 */
  init: () => void
  /** 更新前初始化 */
  updateInit: () => void
  /** 软删除前初始化 */
  softRemoveInit: () => void
}
