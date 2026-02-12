/** 排序类型枚举 */
export enum OrderTypeEnum {
  /** asc(升序) */
  ASC = 'asc',
  /** desc(降序) */
  DESC = 'desc',
}

/** 排序类型枚举文本映射 */
export const OrderTypeTextMap: Record<OrderTypeEnum, string> = {
  [OrderTypeEnum.ASC]: '升序',
  [OrderTypeEnum.DESC]: '降序',
}
