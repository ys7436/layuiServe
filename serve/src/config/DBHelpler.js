import mongoose from 'mongoose'
import * as config from './index'
mongoose.set('useCreateIndex', true)
/* !!!: 创建连接 */
mongoose.connect(config.DB_URL, {
  /* !!!: 这里用来清除控制台报警 需要安装cnpm intall -S saslprep */
  useNewUrlParser: true,
  useUnifiedTopology: true
})

/* !!!: 连接成功 */
mongoose.connection.on('connected', ()=> {
  console.log('连接成功！！！！')
})

/* !!!: 连接异常 */
mongoose.connection.on('error', (err)=> {
  console.log('连接异常!!!')
})

/* !!!: 断开连接 */
mongoose.connection.on('disconnected', ()=> {
  console.log('断开连接!!!')
})

export default mongoose