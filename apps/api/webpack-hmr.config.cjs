const { resolve } = require('node:path')
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
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
module.exports = function (options, webpack) {
  console.clear()
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
  options.entry = ['webpack/hot/poll?100', options.entry]
  options.externals = [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ]
  options.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new RunScriptWebpackPlugin({ name: options.output.filename, autoRestart: true }),
  )
  options.cache = true
  // console.log('Webpack config loaded, options:', JSON.stringify(options, null, 2))
  return options
}
