const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const koaBody = require('koa-body')
const cors = require('@koa/cors');
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const Router = require('koa-router')
const requireDirectory = require('require-directory')
const { REDIS_CONF } = require('./src/conf/db')

// const modules = requireDirectory(module, './routes', { visit: whenLoadModule })

// const index = require('./routes/index')
// const users = require('./routes/users')
// const files = require('./routes/files')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/dist'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
// app.use(koaBody({
//   multipart: true,
//   formidable: {
//       maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M
//   }
// }))
app.use(cors())
//session 配置
app.keys = ['Lee123_']
app.use(session({
  // 配置 cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  // 配置redis
  store: redisStore({
    all: '127.0.0.1:6379',
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
// app.use(files.routes(), files.allowedMethods())

const modules = requireDirectory(module, './routes', { visit: whenLoadModule })
function whenLoadModule(obj) {
  if (obj instanceof Router) {
    app.use(obj.routes(), obj.allowedMethods())
  }
}

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
