import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import SwaggerParser from '@apidevtools/swagger-parser'

// 文件路径数组，用于批量处理
const filesToFormat = new Map()
/** 子项目包名 */
const packageJsonName = ['@apps/api', '@apps/web', '@packages/types']

/**
 * 收集需要格式化的文件路径
 * @type {import('plop').CustomActionFunction}
 */
export function collectFormat(_answers, config, plop) {
  if (!packageJsonName.includes(config?.packageJsonName)) throw new Error(`子项目包名 ${config?.packageJsonName} 不正确`)
  const target = resolve(plop.getDestBasePath(), config.path)
  if (!filesToFormat.has(config?.packageJsonName)) filesToFormat.set(config?.packageJsonName, new Set())
  filesToFormat.get(config?.packageJsonName).add(target)
  return `${target}已收集到${config?.packageJsonName}格式化队列`
}
/**
 * 触发格式化所有收集的文件
 * 在 plop 流程结束时调用
 * @type {import('plop').CustomActionFunction}
 */
export function triggerFormat(_answers, config) {
  if (!packageJsonName.includes(config?.packageJsonName)) throw new Error(`子项目包名 ${config?.packageJsonName} 不正确`)
  const pathList = filesToFormat.get(config?.packageJsonName)
  console.warn(pathList)
  if (pathList.size === 0 || !pathList) return '没有文件需要格式化'
  try {
    console.warn(`${config?.packageJsonName} 开始批量格式化 ${pathList.size} 个文件...`)
    // 将所有文件路径合并为一个字符串，避免多次命令调用
    const filePaths = [...pathList].join(' ')
    try {
      execSync(`pnpm --filter ${config?.packageJsonName} g:format --write ${filePaths}`, {
        stdio: 'inherit',
        timeout: 45000,
      })
    } catch (error) {
      console.warn(`${config?.packageJsonName} Prettier 执行失败:`, error.message)
    }
    try {
      execSync(`pnpm --filter ${config?.packageJsonName} g:eslint --fix ${filePaths}`, {
        stdio: 'inherit',
        timeout: 45000,
      })
    } catch (error) {
      console.warn(`${config?.packageJsonName} Eslint 执行失败:`, error.message)
    }
    const msg = `${config?.packageJsonName} 批量格式化完成，共处理 ${pathList.size} 个文件`
    pathList.clear()
    return msg
  } catch (error) {
    console.warn('批量格式化失败:', error.message)
    pathList.clear()
    return `${config?.packageJsonName} 批量格式化失败`
  }
}

/** 触发子项目打包 */
export function triggerBuild(_answers, config) {
  if (!packageJsonName.includes(config?.packageJsonName)) throw new Error(`子项目包名 ${config?.packageJsonName} 不正确`)
  try {
    execSync(`pnpm --filter ${config?.packageJsonName} build`, {
      stdio: 'inherit',
      timeout: 45000,
    })
    return `${config?.packageJsonName} 打包完成`
  } catch (error) {
    console.warn(`${config?.packageJsonName} 打包失败:`, error.message)
    return `${config?.packageJsonName} 打包失败`
  }
}

/* 触发swagger元数据生成(因为ts-loader替换成swc-loader，swc中swagger要手动生成元数据导入) */
export function triggerSwagger(_answers, config) {
  if (!packageJsonName.includes(config?.packageJsonName)) throw new Error(`子项目包名 ${config?.packageJsonName} 不正确`)
  try {
    execSync(`pnpm --filter ${config?.packageJsonName} swag`, {
      stdio: 'inherit',
      timeout: 45000,
    })
    return `${config?.packageJsonName} swagger元数据生成完成`
  } catch (error) {
    console.warn(`${config?.packageJsonName} swagger元数据生成失败:`, error.message)
    return `${config?.packageJsonName} swagger元数据生成失败`
  }
}

/**
 * 去除文件中的空行
 * @type {import('plop').CustomActionFunction}
 */
export function removeEmptyLines(_answers, config, plop) {
  const target = resolve(plop.getDestBasePath(), config.path)
  try {
    const content = readFileSync(target, 'utf-8')
    const cleanedContent = content
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n')
    writeFileSync(target, cleanedContent, 'utf-8')
    return '空行已移除'
  } catch (error) {
    console.warn(`移除空行失败: ${target}`, error.message)
    return '移除空行失败'
  }
}
/**
 * @type {import('plop').CustomActionFunction}
 */
export async function swagger(answers, config, plop) {
  const { isUrl, swaggerUrl, swaggerPath } = answers
  const { getGenerator } = plop
  const apiG = getGenerator('api')
  // 获取Swagger文档内容的辅助函数
  async function fetchSwaggerDocument(source) {
    if (!isUrl) {
      const content = readFileSync(source, 'utf-8')
      return JSON.parse(content)
    }
    try {
      const { abort, signal } = new AbortController()
      const timeoutId = setTimeout(() => abort(), 30000)
      const response = await fetch(source, { signal, headers: { Accept: 'application/json' } })
      clearTimeout(timeoutId)
      if (!response.ok) {
        throw new Error(`HTTP请求失败: ${response.status} ${response.statusText}`)
      }
      return await response.json()
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('请求超时（30秒）')
      }
      throw new Error(`获取Swagger文档失败: ${err.message}`)
    }
  }

  try {
    console.warn('获取Swagger文档...')
    const swaggerDoc = await fetchSwaggerDocument(isUrl ? swaggerUrl : swaggerPath)
    console.warn('获取文档成功')
    console.warn('解析Swagger文档...')
    // 使用parse模式而不是validate，避免循环引用验证问题
    const { info, paths, components, tags } = await SwaggerParser.parse(swaggerDoc, { dereference: { circular: true }, continueOnError: true })
    console.warn('Swagger文档解析成功!')
    console.warn('API标题:', info?.title || 'Unknown')
    console.warn('API版本:', info?.version || 'Unknown')
    console.warn('路径数量:', Object.keys(paths || {}).length)
    console.warn('VO和DTO数量:', Object.keys(components?.schemas || {}).length)
    console.warn('模块数量:', tags.length)
    console.warn(tags)
    console.warn(apiG.actions)
    return `Swagger文档解析成功: ${info?.title || 'Unknown API'}`
  } catch (err) {
    throw new Error(`Swagger文档解析失败: ${err.message}`)
  }
}
