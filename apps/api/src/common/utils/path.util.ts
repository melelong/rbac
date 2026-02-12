import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import * as process from 'node:process'

/**
 * 检查给定路径是否存在
 * @param path {string} - 要检查的文件或目录路径
 * @returns {boolean} - 如果路径存在，则返回true；否则返回false
 */
export function isExist(path: string): boolean {
  return existsSync(path)
}

/**
 * 根据提供的路径名构造完整的路径
 * @param pathName 相对路径名或文件名。这是相对于当前模块目录的路径
 * @returns 返回构造的完整路径
 */
export function getPath(pathName: string): string {
  return join(resolve(process.cwd(), pathName))
}
