const Koa = require('koa')
const app = new Koa()

const json = require('koa-json')

const cors = require('@koa/cors')
const koaBody = require('koa-body')


const Router = require('koa-router')
const router = new Router()

router.prefix('/api')

router.get('/', ctx => {
  ctx.body = 'hello YS!!!'
})

router.get('/api', ctx => {
  const params = ctx.request.query
  ctx.body = {
    name: params.name,
    age: params.age
  }
})

router.get('/async', async (ctx) => {
  let result = await new Promise((resolve) => {
    setTimeout(function () {
      resolve('3s执行完毕')
    },3000)
  })
  ctx.body = result
})

router.post('/post', async (ctx) => {
  let { body } = ctx.request
  console.log(body)
  console.log(ctx.request)
  ctx.body = {
    ...body
  }
})

app.use(koaBody())
app.use(cors())
app.use(json({ pretty: false, param: 'pretty' }))
app.use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)