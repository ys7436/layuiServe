//生产模式中的webpack配置

const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

//要对js文件打包处理 主要用来压缩js 官方推荐的插件
const TerserWebpackPlugin = require('terser-webpack-plugin')

const webpackConfig = webpackMerge(baseWebpackConfig, {
  mode: 'production',
  //stats: { children: false } 不需要传递日志消息
  stats: { children: false },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        //这里是官方默认配置
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            //是否注释掉console
            drop_console: false,
            dead_code: true,
            drop_debugger: true
          },
          output: {
            //注释
            comments: false,
            //一行输出结果
            beautify: false
          },
          mangle: true
        },
        parallel: true,
        //不需要映射新的js文件
        sourceMap: false 
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true
        }
      }
    }
  }
})

module.exports = webpackConfig