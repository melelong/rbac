import { basename, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { config } from '../../../config/index.mjs'
import { gBasePathPrompt, gHasTreePrompt, gNamePrompt } from '../../utils.mjs'
/** 创建业务异常码和异常消息 */
function createExceptionCode() {
  /** @type {import('plop').ActionType[]} */
  const acts = [
    // 添加异常码枚举 - 在枚举定义末尾添加
    {
      type: 'modify',
      path: 'src/common/exceptions/exception-code.ts',
      pattern: /(\s*[A-Z_]+ = '[^']+',)([\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n\s*\})/,
      template: `$1\n  // {{zhName}}\n  /** {{zhName}}已存在 */\n  {{constantCase moduleName}}_ALREADY_EXISTS = '{{constantCase moduleName}}_0000',\n  /** {{zhName}}不存在 */\n  {{constantCase moduleName}}_NOT_FOUND = '{{constantCase moduleName}}_0001',\n  /** {{zhName}}名已存在 */\n  {{constantCase moduleName}}_NAME_ALREADY_EXISTS = '{{constantCase moduleName}}_0002',\n  /** {{zhName}}名不存在 */\n  {{constantCase moduleName}}_NAME_NOT_FOUND = '{{constantCase moduleName}}_0003',\n$2`,
    },
    {
      type: 'modify',
      path: 'src/common/exceptions/exception-code.ts',
      pattern: /(\s*\[[^\]]+\]: \['[^']*', HttpStatus\.[A-Z_]+\],)([\t\v\f\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\n\s*\})/,
      template: `$1\n  // {{zhName}}\n  [ExceptionCode.{{constantCase moduleName}}_ALREADY_EXISTS]: ['{{zhName}}已存在', HttpStatus.CONFLICT],\n  [ExceptionCode.{{constantCase moduleName}}_NOT_FOUND]: ['{{zhName}}不存在', HttpStatus.NOT_FOUND],\n  [ExceptionCode.{{constantCase moduleName}}_NAME_ALREADY_EXISTS]: ['{{zhName}}名已存在', HttpStatus.CONFLICT],\n  [ExceptionCode.{{constantCase moduleName}}_NAME_NOT_FOUND]: ['{{zhName}}名不存在', HttpStatus.NOT_FOUND],\n$2`,
    },
    { type: 'collectFormat', path: 'src/common/exceptions/exception-code.ts', packageJsonName: '@apps/api' },
  ]
  return acts
}
/**
 * 更新业务模块索引文件
 * @param data actions函数的回调参数
 * @param _basePath 基础路径
 */
function updateBmIndex(data, _basePath) {
  const { basePath } = data
  const resolvedBasePath = resolve(_basePath)
  /** @type {import('plop').ActionType[]} */
  const acts = [
    {
      type: 'append',
      path: 'src/modules/index.ts',
      template: `export * from '.${basePath === resolvedBasePath ? '/' : `${basePath.replace(resolvedBasePath, '').replaceAll(/\\/g, '/')}/`}{{kebabCase moduleName}}/{{kebabCase moduleName}}.module'`,
    },
    // 移除空行
    { type: 'removeEmptyLines', path: 'src/modules/index.ts' },
    {
      type: 'modify',
      path: 'src/boot/boot.module.ts',
      pattern: /(import\s*\{)([^}]*)\}\s*from\s*['"]@\/modules['"]/,
      template: `$1{{pascalCase moduleName}}Module, $2 } from '@/modules'`,
    },
    {
      type: 'modify',
      path: 'src/boot/boot.module.ts',
      pattern: /const businessModule: ModuleMetadata\['imports'\] = \[([\s\S]*?),\s*\]/,
      template: `const businessModule: ModuleMetadata['imports'] = [$1]`,
    },
    // 添加新模块到业务模块数组
    {
      type: 'modify',
      path: 'src/boot/boot.module.ts',
      pattern: /const businessModule: ModuleMetadata\['imports'\] = \[([\s\S]*?)\]/,
      template: `const businessModule: ModuleMetadata['imports'] = [\n$1,\n  {{pascalCase moduleName}}Module,\n]`,
    },
    // 删除多余的逗号 - 当数组为空时添加第一个模块会产生 [, Module] 的情况
    {
      type: 'modify',
      path: 'src/boot/boot.module.ts',
      pattern: /const businessModule: ModuleMetadata\['imports'\] = \[\s*,\s*([A-Za-z][a-zA-Z0-9]*Module)/,
      template: `const businessModule: ModuleMetadata['imports'] = [\n  $1`,
    },
    {
      type: 'modify',
      path: 'src/common/constants/SwaggerTags.ts',
      pattern: /const SwaggerTags: TagObject\[\] = \[([\s\S]*?),\s*\]/,
      template: `const SwaggerTags: TagObject[] = [$1]`,
    },
    // 添加新模块标签到swagger标签数组
    {
      type: 'modify',
      path: 'src/common/constants/SwaggerTags.ts',
      pattern: /const SwaggerTags: TagObject\[\] = \[([\s\S]*?)\]/,
      template: `const SwaggerTags: TagObject[] = [\n$1,\n  { name: '{{pascalCase moduleName}}', description: '{{zhName}}模块' },\n]`,
    },
    // 删除多余的逗号 - 处理数组中的双逗号问题 [, {xxx}] 或 {xx:xx},, {新模块}
    {
      type: 'modify',
      path: 'src/common/constants/SwaggerTags.ts',
      pattern: /const SwaggerTags: TagObject\[\] = \[([\s\S]*?),\s*,\s*\{/,
      template: `const SwaggerTags: TagObject[] = [\n$1,\n  {`,
    },
    { type: 'collectFormat', path: 'src/modules/index.ts', packageJsonName: '@apps/api' },
    { type: 'collectFormat', path: 'src/boot/boot.module.ts', packageJsonName: '@apps/api' },
    { type: 'collectFormat', path: 'src/common/constants/SwaggerTags.ts', packageJsonName: '@apps/api' },
  ]
  return acts
}

/** 更新类型索引文件 */
function updateTypeIndex(apiTypePath) {
  const voPath = join(apiTypePath, './vo/index.ts')
  const dtoPath = join(apiTypePath, './dto/index.ts')
  /** @type {import('plop').ActionType[]} */
  const acts = [
    {
      type: 'append',
      path: dtoPath,
      template: `export * from './I{{pascalCase moduleName}}.dto'`,
    },
    // 移除空行
    { type: 'removeEmptyLines', path: dtoPath },
    {
      type: 'append',
      path: voPath,
      template: `export * from './I{{pascalCase moduleName}}.vo'`,
    },
    // 移除空行
    { type: 'removeEmptyLines', path: voPath },
    { type: 'collectFormat', path: dtoPath, packageJsonName: '@packages/types' },
    { type: 'collectFormat', path: voPath, packageJsonName: '@packages/types' },
  ]
  return acts
}

const { apiBmPath, apiTypePath } = config
export function bm(options) {
  const { hbsFiles, templatePath, plop } = options
  /** @type {Partial<import('plop').PlopGeneratorConfig>} */
  const res = {
    description: '创建业务模块',
    prompts: [...gBasePathPrompt(apiBmPath), ...gNamePrompt(), ...gHasTreePrompt()],
    actions: (data) => {
      const kebabCase = plop.getHelper('kebabCase')
      const pascalCase = plop.getHelper('pascalCase')
      const __templatePath = join(templatePath, './api/businessModule')
      const typeTemplatePath = join(templatePath, './types')
      // 树相关的文件
      const TREE_FILES = [
        'move-[g].command.ts.hbs',
        'move-[g].handler.ts.hbs',
        'move-[g].dto.ts.hbs',
        'get-[g]-tree.handler.ts.hbs',
        'get-[g]-tree.query.ts.hbs',
        'get-[g]-trees.handler.ts.hbs',
        'get-[g]-trees.query.ts.hbs',
        'get-[g]-trees.query.ts.hbs',
        '[g]-tree.vo.ts.hbs',
        '[g]-tree.entity.ts.hbs',
        'I[G]TreeEntity.ts.hbs',
        'I[G]TreeRepository.ts.hbs',
        '[g]-tree.repository.ts.hbs',
      ]
      const { basePath, moduleName, hasTree } = data
      // 模块上一层目录路径和模板目录路径
      const _basePath = join(resolve(basePath), kebabCase(moduleName))
      const apiActs = hbsFiles
        .filter((file) => {
          if (!file.startsWith(__templatePath)) return false
          if (hasTree) return true
          return !TREE_FILES.includes(basename(file))
        })
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
      apiActs.push(...updateBmIndex(data, apiBmPath))
      apiActs.push(...createExceptionCode())
      // 收集文件格式化动作
      apiActs.push({
        type: 'collectFormat',
        path: `${_basePath.replace(`${cwd()}\\`, '').replaceAll(/\\/g, '/')}/**/*.ts`,
        packageJsonName: '@apps/api',
      })
      // 生成业务swagger元数据
      apiActs.push({ type: 'triggerSwagger', packageJsonName: '@apps/api' })
      // 触发格式化动作
      apiActs.push({ type: 'triggerFormat', packageJsonName: '@apps/api' })
      // vo和dto
      const typesActs = hbsFiles
        .filter((file) => file.startsWith(typeTemplatePath))
        .map((file) => ({
          type: 'add',
          path: file
            .replace(typeTemplatePath, apiTypePath)
            .replace(/\[g\]/g, kebabCase(moduleName))
            .replace(/\[G\]/g, pascalCase(moduleName))
            .replace(/\.hbs$/, ''),
          templateFile: file,
          force: true,
        }))
      typesActs.push(...updateTypeIndex(apiTypePath))
      // 触发格式化动作
      typesActs.push({ type: 'triggerFormat', packageJsonName: '@packages/types' })
      // 打包类型
      typesActs.push({ type: 'triggerBuild', packageJsonName: '@packages/types' })
      // 先创建类型避免api格式化时依赖的类型还没有创建导致格式化失败
      const _acts = [...typesActs, ...apiActs]
      return _acts
    },
  }
  return res
}
