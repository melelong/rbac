const { resolve } = require('node:path')
const CopyPlugin = require('copy-webpack-plugin')
const swcDefaultConfig = require('@nestjs/cli/lib/compiler/defaults/swc-defaults').swcDefaultsFactory().swcOptions
const threadLoader = require('thread-loader')

threadLoader.warmup(
  {
    // 预热配置（应与下方 thread-loader options 保持一致）
    workers: require('node:os').cpus().length - 1,
    workerParallelJobs: 50,
    poolTimeout: 2000,
  },
  [
    // 指定需要预热的 loader
    'swc-loader',
    '@swc/core',
  ],
)
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
/**
 * webpack配置
 * @param {*} options nest-cli中webpack默认配置
 */
module.exports = function (options) {
  // 添加打包分析插件
  // options.plugins.push(
  //   new BundleAnalyzerPlugin({
  //     analyzerPort: 8888,
  //   }),
  // )
  options.plugins.push(
    new CopyPlugin({
      patterns: [
        {
          from: './templates',
          to: './templates',
        },
        {
          from: './.env.local',
          to: './',
        },
      ],
    }),
  )
  options.module = {
    rules: [
      // 替换ts-loader为swc-loader
      {
        test: /\.ts$/,
        include: resolve(__dirname, 'src'),
        exclude: [/node_modules/, /dist/],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('node:os').cpus().length - 1,
              workerParallelJobs: 50,
              poolTimeout: 2000,
            },
          },
          {
            loader: 'swc-loader',
            options: swcDefaultConfig,
          },
        ],
      },
    ],
  }
  options.cache = {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
    profile: true,
    compression: 'gzip',
  }
  // console.log('Webpack config loaded, options:', JSON.stringify(options, null, 2))
  return options
}
