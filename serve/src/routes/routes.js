
import combineRouters from 'koa-combine-routers'

// import publicRouter from './PublicRouter'
// import loginRouter from './loginRouter'
// import userRouter from './UserRouter'

const modulesFiles = require.context('./modules', true, /\.js$/);
/* !!!: 获取所有modules文件夹js文件 */
/* !!!: value获取到的就是 default:{router: ['/login','/reg','...']} */
const modules = modulesFiles.keys().reduce((items, path) => {
  const value = modulesFiles(path)
  items.push(value.default)
  return items
}, [])
// console.log(modules)

export default combineRouters(
  // publicRouter,
  // loginRouter,
  // userRouter
  modules
)