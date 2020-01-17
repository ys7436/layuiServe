//开发模式中的webpack配置

//用来合并webpack配置的依赖
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

const webpackConfig = webpackMerge(baseWebpackConfig, {
  mode: 'development',
  //方便后期在开发模式中调试
  devtool: 'env-source-map',
  //stats: { children: false } 不需要传递日志消息
  stats: { children: false }
})

module.exports = webpackConfig