import { existsSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { config } from '../../../config/index.mjs'
import { gHasTreePrompt, gNamePrompt } from '../../utils.mjs'

/** 更新类型索引文件 */
function updateTypeIndex() {
  /** @type {import('plop').ActionType[]} */
  const acts = [
    {
      type: 'append',
      path: 'src/dto/index.ts',
      template: `export * from './I{{pascalCase moduleName}}.dto'`,
    },
    // 移除空行
    { type: 'removeEmptyLines', path: 'src/dto/index.ts' },
    {
      type: 'append',
      path: 'src/vo/index.ts',
      template: `export * from './I{{pascalCase moduleName}}.vo'`,
    },
    // 移除空行
    { type: 'removeEmptyLines', path: 'src/vo/index.ts' },
  ]
  return acts
}

const { typesVOPath, typesDTOPath } = config
export function type(options) {
  const { hbsFiles, templatePath, plop } = options
  /** @type {Partial<import('plop').PlopGeneratorConfig>} */
  const res = {
    description: '创建类型',
    prompts: [...gNamePrompt(), ...gHasTreePrompt()],
    actions: (data) => {
      const kebabCase = plop.getHelper('kebabCase')
      const pascalCase = plop.getHelper('pascalCase')
      const __templatePath = join(templatePath, './types')
      for (const path of [typesVOPath, typesDTOPath]) {
        if (!existsSync(path)) throw new Error('目录不存在')
        if (!statSync(path).isDirectory()) throw new Error(`${typesDTOPath}不是目录`)
      }
      const { moduleName } = data
      const _basePath = resolve(cwd(), './src')
      const acts = hbsFiles
        .filter((file) => file.startsWith(__templatePath))
        .map((file) => ({
          type: 'add',
          path: file
            .replace(__templatePath, _basePath)
            .replace(/\[g\]/g, kebabCase(moduleName))
            .replace(/\[G\]/g, pascalCase(moduleName))
            .replace(/\.hbs$/, ''),
          templateFile: file,
          force: true,
        }))
      // 更新业务模块索引文件
      acts.push(...updateTypeIndex())
      // 收集文件格式化动作
      const formatActs = acts.map((act) => ({ type: 'collectFormat', path: act.path, packageJsonName: '@packages/types' }))
      const _acts = [...acts, ...formatActs]
      // 触发格式化动作
      _acts.push({ type: 'triggerFormat', packageJsonName: '@packages/types' })
      return _acts
    },
  }
  return res
}
