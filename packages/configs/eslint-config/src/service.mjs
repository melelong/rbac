import antfu from '@antfu/eslint-config'

export const serviceConfig = antfu({
  typescript: true,
  yaml: true,
  test: true,
  pnpm: true,
  stylistic: true,
  formatters: ['prettier'],
  ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**', 'system/**', '**/src/metadata.ts'],
  rules: {
    'style/operator-linebreak': 'off',
    'style/arrow-parens': 'off',
    'antfu/if-newline': 'off',
    'style/brace-style': 'off',
    'no-console': 'off',
    'unused-imports/no-unused-vars': 2,
    'unused-imports/no-unused-imports': 2,
    'ts/consistent-type-imports': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-contradiction-with-assertion': 'off',
    'ts/no-unused-expressions': 'off',
  },
})
