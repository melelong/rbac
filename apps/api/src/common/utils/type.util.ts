/** 类型类名 */
export type TypeClassName =
  | 'String'
  | 'Object'
  | 'Array'
  | 'Number'
  | 'Boolean'
  | 'Null'
  | 'Undefined'
  | 'Function'
  | 'Symbol'
  | 'Date'
  | 'RegExp'
  | 'Error'
  | 'Map'
  | 'Set'
  | 'WeakMap'
  | 'WeakSet'
/**
 * 判断类型
 * @param currentValue 当前值
 * @param typeClassName 类型类名
 */
export function isType(currentValue: unknown, typeClassName: TypeClassName) {
  return Object.is(Object.prototype.toString.call(currentValue), `[object ${typeClassName}]`)
}

/** 去掉 Keys 中的字段 */
export type ExcludeKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}

/** 只保留 Keys 中的字段 */
export type PickKeys<T, K extends keyof T> = {
  [P in K]: T[P]
}
