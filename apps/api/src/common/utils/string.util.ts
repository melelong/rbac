import { isEmpty } from 'lodash-es'
/**
 * 判断字符串是否有空字符串
 * @param str 字符串
 */
export function hasSpace(str: string) {
  return isEmpty(str)
}

/**
 * 随机生成code
 * @param length 长度
 * @param type 类型
 */
export function getCode(length: number = 6, type: number = 16) {
  return Math.random()
    .toString(type)
    .substring(2, length + 2)
}

/**
 * 驼峰字符串转换为常量字符串
 * @param str 驼峰字符串
 * @returns 常量字符串
 */
export function camelToConst(str: string) {
  // aB → A_B
  // aBc → A_BC
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toUpperCase()
}
