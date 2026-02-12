import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
// 脚本文件目录
const __dirname = dirname(__filename)
// 运行脚本命令的目录
const __cwd = resolve(cwd())
// 项目根目录（
export const config = {
  /** (@apps/api相关)路径 */
  apiBmPath: resolve(__cwd, 'src/modules'),
  apiConfPath: resolve(__cwd, 'src/common/infrastructure/config'),
  apiImPath: resolve(__cwd, 'src/common/infrastructure'),
  apiTypePath: resolve(__dirname, '../../../types/src'),
  /** (@apps/web相关)路径 */
  webPath: resolve(__cwd, 'src'),
  webApiPath: resolve(__cwd, 'src/api/modules'),
  /** (@packages/types相关)路径 */
  typesVOPath: resolve(__cwd, 'src/vo'),
  typesDTOPath: resolve(__cwd, 'src/dto'),
  /** 模板路径 */
  templatePath: resolve(__dirname, '../../templates'),
}
