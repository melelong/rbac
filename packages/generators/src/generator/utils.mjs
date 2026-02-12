import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { URL } from 'node:url'
/**
 * 生成基础路径提示
 * @param {string} basePath 基础路径
 */
export function gBasePathPrompt(basePath) {
  /** @type {import('plop').PlopGeneratorConfig['prompts']} */
  const prompts = [
    {
      type: 'input',
      name: 'basePath',
      message: `请输入生成模块上级目录(一定在默认目录下)`,
      default: basePath,
      filter: (input) => {
        const value = input.trim()
        const baseResolved = resolve(basePath)
        return value === basePath ? baseResolved : resolve(baseResolved, value)
      },
      validate: (v) => {
        const value = v.trim()
        if (value === basePath) return true
        const fullPath = resolve(value)
        const baseResolved = resolve(basePath)
        // 是否在默认目录下
        if (!fullPath.startsWith(baseResolved)) return '路径必须在基础目录下'
        if (!existsSync(fullPath)) return '目录不存在'
        if (!statSync(fullPath).isDirectory()) return '不是目录'
        return true
      },
    },
  ]
  return prompts
}
/** 生成名称提示 */
export function gNamePrompt() {
  /** @type {import('plop').PlopGeneratorConfig['prompts']} */
  const prompts = [
    {
      type: 'input',
      name: 'moduleName',
      message: '请输入名称(英文,用于变量和文件名)',
      validate: (v) => {
        const value = v.trim()
        if (value === '') return '名称不能为空'
        // 检查是否只包含字母、数字和下划线
        if (!/^[a-z]\w*$/i.test(value)) return '名称必须以字母开头，只能包含字母、数字和下划线'
        if (value.length > 20) return '名称长度不能超过20个字符'
        return true
      },
    },
    {
      type: 'input',
      name: 'zhName',
      message: '请输入名称(中文,用于显示和注释)',
      validate: (v) => {
        const value = v.trim()
        if (value === '') return '中文名称不能为空'
        // 检查是否只包含中文、字母、数字、下划线和连字符
        if (!/^[\u4E00-\u9FA5\w-]+$/.test(value)) return '中文名称只能包含中文、字母、数字、下划线和连字符'
        if (!/[\u4E00-\u9FA5]/.test(value)) return '中文名称至少需要包含一个中文字符'
        return true
      },
    },
  ]
  return prompts
}
/** 是否有树提示 */
export function gHasTreePrompt() {
  /** @type {import('plop').PlopGeneratorConfig['prompts']} */
  const prompts = [
    {
      type: 'confirm',
      name: 'hasTree',
      message: '是否有树?',
      default: false,
    },
  ]
  return prompts
}
/** 是否是URL提示 */
export function gIsUrlPrompt() {
  /** @type {import('plop').PlopGeneratorConfig['prompts']} */
  const prompts = [
    {
      type: 'confirm',
      name: 'isUrl',
      message: 'Swagger文档来源是URL还是本地文件?',
      default: true,
    },
    {
      type: 'input',
      name: 'swaggerUrl',
      message: '请输入Swagger文档URL:',
      default: 'http://127.0.0.1:4001/swagger.json',
      when: (answers) => answers.isUrl === true,
      validate: (v) => {
        const value = v.trim()
        if (value === '') return 'URL不能为空'
        if (!URL.canParse(value)) return '请输入有效的URL'
        return true
      },
    },
    {
      type: 'input',
      name: 'swaggerPath',
      message: '请输入Swagger文档本地文件路径:',
      default: './rbac_dev-swagger-v1.0.0.json',
      when: (answers) => answers.isUrl === false,
      validate: (v) => {
        const value = v.trim()
        if (value === '') return '文件路径不能为空'
        const fullPath = resolve(value)
        if (!existsSync(fullPath)) return '文件不存在'
        if (!statSync(fullPath).isFile()) return '不是文件'
        if (!value.endsWith('.json')) return '文件必须是JSON格式'
        return true
      },
    },
  ]
  return prompts
}
