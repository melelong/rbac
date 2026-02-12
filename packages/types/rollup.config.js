import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm',
      },
      {
        file: 'dist/index.js',
        format: 'esm',
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        outputToFilesystem: true,
      }),
      resolve(),
      commonjs(),
      del({ hook: 'buildEnd', targets: ['./dist/'] }),
    ],
    external: ['@types/node'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.d.ts',
        format: 'esm',
      },
    ],
    plugins: [
      dts({
        outputDir: './dist',
        exclude: ['node_modules/**'],
      }),
      del({ hook: 'buildEnd', targets: ['./dist/index.d.ts'] }),
    ],
    external: ['@types/node'],
  },
]
