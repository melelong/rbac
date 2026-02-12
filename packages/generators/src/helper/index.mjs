/** 判断数组中是否包含某个元素 */
export function has(arr, item) {
  return Array.isArray(arr) && arr.includes(item)
}
