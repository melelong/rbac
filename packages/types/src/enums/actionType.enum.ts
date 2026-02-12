/** 操作类型枚举 */
export enum ActionTypeEnum {
  /** 管理 */
  MANAGE = 10,
  /** 读取 */
  READ = 20,
  /** 创建 */
  CREATE = 30,
  /** 更新 */
  UPDATE = 40,
  /** 删除 */
  DELETE = 50,
  /** 导出 */
  EXPORT = 60,
  /** 导入 */
  IMPORT = 70,
}

/** 操作类型枚举文本映射 */
export const ActionTypeTextMap: Record<ActionTypeEnum, string> = {
  [ActionTypeEnum.MANAGE]: '管理',
  [ActionTypeEnum.READ]: '读取',
  [ActionTypeEnum.CREATE]: '创建',
  [ActionTypeEnum.UPDATE]: '更新',
  [ActionTypeEnum.DELETE]: '删除',
  [ActionTypeEnum.EXPORT]: '导出',
  [ActionTypeEnum.IMPORT]: '导入',
}

/** 操作类型枚举Code映射 */
export const ActionTypeCodeMap: Record<ActionTypeEnum, string> = {
  [ActionTypeEnum.MANAGE]: 'MANAGE',
  [ActionTypeEnum.READ]: 'READ',
  [ActionTypeEnum.CREATE]: 'CREATE',
  [ActionTypeEnum.UPDATE]: 'UPDATE',
  [ActionTypeEnum.DELETE]: 'DELETE',
  [ActionTypeEnum.EXPORT]: 'EXPORT',
  [ActionTypeEnum.IMPORT]: 'IMPORT',
}
