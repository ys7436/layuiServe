const Koa = require('koa')
const app = new Koa()

const middleware = function async (ctx, next) {
  console.log('this is a middleware')
  console.log(ctx.request.path)
  next()
  console.log('end')
}

const middleware1 = function async (ctx, next) {
  console.log('this is a middleware1')
  console.log(ctx.request.path)
  next()
  console.log('end1')
}

const middleware2 = function async (ctx, next) {
  console.log('this is a middleware2')
  console.log(ctx.request.path)
  next()
  console.log('end2')
}

app.use(middleware)
app.use(middleware1)
app.use(middleware2)

app.listen(3001)