const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const koaValidate = require('koa-validate')
const session = require('koa-session')
const koaJwt = require('koa-jwt')

const config = require('config')
global.config = config

const tokenJwt = require('./libs/utils/token')
const { Code } = require('./libs/consts')
const api = require('./routes/api/index')
const admin = require('./routes/admin/index')

// 验证中间件
koaValidate(app)
// error handler
onerror(app)

// middlewares
app.use(require('./middleware/redis')(config.get('redis'))) // redis
app.use(require('./middleware/mongo')(config.get('mongodb'))) // mongodb

app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug'
  })
)

app.use(async (ctx, next) => {
  return next().catch(err => {
    if (401 === err.status) {
      ctx.status = 401
      ctx.body = {
        code: Code.ErrorToken.code,
        msg: Code.ErrorToken.msg
      }
    } else {
      throw err
    }
  })
})

app.use(
  koaJwt({ secret: config.get('secret') })
  // .unless({
  //   path: [/^\/blogapi\/login/]
  // })
)

//session
app.keys = ['blogDataAPI']
app.use(
  session(
    {
      key: 'sid',
      maxAge: 86400000,
      autoCommit: true,
      overwrite: true,
      httpOnly: true,
      signed: true,
      rolling: false,
      renew: false
    },
    app
  )
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(api.routes(), api.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
