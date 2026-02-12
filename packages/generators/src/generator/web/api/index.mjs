import { gIsUrlPrompt } from '../../utils.mjs'

export function api(options) {
  /** @type {Partial<import('plop').PlopGeneratorConfig>} */
  const res = {
    description: '基于swagger生成api文件',
    prompts: [...gIsUrlPrompt()],
    actions: [
      {
        type: 'swagger',
        options,
      },
    ],
  }
  return res
}
