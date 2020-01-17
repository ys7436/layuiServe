//通用的webpack配置模块

const utils = require('./utils')

//webpack4.0后必须安装webpack webpack-cli两个依赖包；已经分离开来
const path = require('path')
const nodeExcternals = require('webpack-node-externals')
//对打包后的dist目录做清除处理，防止里面存在一些垃圾文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
//webpack.DefinePlugin 允许我们创建一个全局的常量

const webpackconfig = {
  target: 'node',
  //两种模式 development || production
  //mode: 'development',
  //入口：告诉webpack从哪个js开始阅读
  //__dirname代表当前项目的根路径(/D/Demo); 
  //path.join(__dirname, './dist')作用是拼接路径 /D/Demo/dist
  entry: {
    server1: path.join(utils.APP_PATH, 'index.js')
  },
  resolve: {
    ...utils.getWebpackResolveConfig()
  },
  //输出：
  output: {
    //打包出来js文件名称 这里的[name]代表上面的server1
    filename: '[name].bundle.js',
    //打包出来的路径
    path: utils.DIST_PATH
  },
  //静态资源文件处理
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        //把node_modules里面的js文件排除，不做打包处理
        exclude: [path.join(__dirname, '/node_modules')]
      }
    ]
  },
  //对node_modules目录做排除处理，这样就不会处理这个目录里的文件了
  externals: [nodeExcternals()],
  //插件
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: (
          process.env.NODE_ENV === 'production' || 
          process.env.NODE_ENV === 'prod' ? "'production'" : 
          "'development'"
        )
      }
    })
  ],
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true,
    __dirname: true,
    setImmediate: true,
    path: true
  }
}

module.exports = webpackconfig