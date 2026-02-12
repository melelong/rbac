#!/usr/bin/env node

import { glob } from 'glob'
import * as actionType from './actionType/index.mjs'
import { config } from './config/index.mjs'
import * as generator from './generator/index.mjs'
import * as helper from './helper/index.mjs'

const { templatePath } = config
export default async function (/** @type {import('plop').NodePlopAPI} */ plop) {
  const hbsFiles = await glob(`${templatePath}/**/*.hbs`, { absolute: true })
  // 注册动作类型
  for (const key of Object.keys(actionType)) {
    plop.setActionType(key, actionType[key])
  }
  // 注册帮助函数
  for (const key of Object.keys(helper)) {
    plop.setHelper(key, helper[key])
  }
  // 注册生成函数
  for (const key of Object.keys(generator)) {
    plop.setGenerator(key, generator[key]({ hbsFiles, templatePath, plop }))
  }
}
