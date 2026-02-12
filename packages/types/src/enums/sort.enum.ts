/** 排序优先级枚举 */
export enum SortEnum {
  /** 低优先级 */
  LOW_PRIORITY = 10,
  /** 中等优先级 */
  MEDIUM_PRIORITY = 20,
  /** 高优先级 */
  HIGH_PRIORITY = 30,
}

/** 排序优先级枚举文本映射 */
export const SortTextMap: Record<SortEnum, string> = {
  [SortEnum.LOW_PRIORITY]: '低',
  [SortEnum.MEDIUM_PRIORITY]: '中',
  [SortEnum.HIGH_PRIORITY]: '高',
}
