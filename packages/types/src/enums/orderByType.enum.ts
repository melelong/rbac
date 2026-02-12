/** 排序字段类型枚举 */
export enum OrderByTypeEnum {
  /** createdAt(创建时间) */
  CREATED_AT = 'createdAt',
  /** updatedAt(更新时间) */
  UPDATED_AT = 'updatedAt',
  /** name(名称) */
  NAME = 'name',
}

/** 排序字段类型枚举文本映射 */
export const OrderByTypeTextMap: Record<OrderByTypeEnum, string> = {
  [OrderByTypeEnum.CREATED_AT]: '创建时间',
  [OrderByTypeEnum.UPDATED_AT]: '更新时间',
  [OrderByTypeEnum.NAME]: '名称',
}
