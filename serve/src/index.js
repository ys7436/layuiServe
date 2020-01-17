import Koa from 'koa'
const app = new Koa()
//登录鉴权中间件
import JWT from 'koa-jwt'
import path from 'path'
//安全头部组件（只要调用就行，安全中间件）
import helmet from 'koa-helmet'
//外部访问静态资源（例如图片、MP4、mp3等）
import statics from 'koa-static'
import router from './routes/routes'

//用来处理post请求的参数格式的中间件
import koaBody from 'koa-body'
//输出get请求的格式优化中间件
import jsonutil from 'koa-json'
//用来处理跨域请求
import cors from '@koa/cors'

//用来统一加载中间件的中间件
import compose from 'koa-compose'

//用来压缩中间件的中间件
import compress from 'koa-compress'

//公用配置
import * as config from './config/index'

//鉴权失败调用方法
import errorHandle from './common/ErrorHandle'
const isDevMode = (process.env.NODE_ENV === 'production' ? false : true)
// app.use(helmet())
// //静态资源路径配置
// app.use(statics(path.resolve(__dirname, '../public')))
// app.use(router())

/* path: 定义公共路径，这些路径可以直接访问，不需鉴权 */
/* secret: 自己设定的一个私有秘钥，尽量复杂 */
const jwt = JWT({secret: config.JWT_SECRET})
  .unless({path: [/^\/public/, /^\/login/]})

const middleware = compose([
  koaBody(),
  statics(path.resolve(__dirname, '../public')),
  cors(),
  jsonutil({ pretty: false, param: 'pretty' }),
  helmet(),
  errorHandle,
  jwt
])
if(!isDevMode) {
  //如果是生产模式就压缩中间件 需要安装koa-compress
  app.use(compress())
}
app.use(middleware)
app.use(router())

app.listen(3000)