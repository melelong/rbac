/** 数据权限范围枚举 */
export enum DataScopeEnum {
  /** 全部数据权限 */
  ALL = 10,
  /** 仅本人数据权限 */
  SELF = 20,
  /** 本部门数据权限 */
  SELF_DEPT = 30,
  /** 本部门及以下数据权限 */
  SELF_DEPT_AND_CHILD = 40,
  /** 自定义数据权限 */
  CUSTOM = 50,
}

/** 数据权限范围枚举文本映射 */
export const DataScopeTextMap: Record<DataScopeEnum, string> = {
  [DataScopeEnum.ALL]: '全部数据权限',
  [DataScopeEnum.SELF]: '仅本人数据权限',
  [DataScopeEnum.SELF_DEPT]: '本部门数据权限',
  [DataScopeEnum.SELF_DEPT_AND_CHILD]: '本部门及以下数据权限',
  [DataScopeEnum.CUSTOM]: '自定义数据权限',
}

/** 数据权限范围枚举编码映射 */
export const DataScopeCodeMap: Record<DataScopeEnum, string> = {
  [DataScopeEnum.ALL]: 'ALL',
  [DataScopeEnum.SELF]: 'SELF',
  [DataScopeEnum.SELF_DEPT]: 'SELF_DEPT',
  [DataScopeEnum.SELF_DEPT_AND_CHILD]: 'SELF_DEPT_AND_CHILD',
  [DataScopeEnum.CUSTOM]: 'CUSTOM',
}
