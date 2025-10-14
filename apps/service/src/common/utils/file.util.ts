import type { PathLike } from 'node:fs'
import { existsSync, mkdirSync } from 'node:fs'

/**
 * 创建目录
 * @param _path 目录路径
 */
export function mkdir(_path: PathLike) {
  if (!existsSync(_path)) mkdirSync(_path, { recursive: true })
}
