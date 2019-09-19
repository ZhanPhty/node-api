const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const logger = require('koa-logger')

var cors = require('koa2-cors')
const koaValidate = require('koa-validate')
const koaJwt = require('koa-jwt')
const koaBody = require('koa-body')

const config = require('config')
global.config = config

const { Code, Unless } = require('./libs/consts')
const api = require('./routes/api/index')
const admin = require('./routes/admin/index')

// 验证中间件
koaValidate(app)
// error handler
onerror(app)

// 跨域
app.use(
  cors({
    origin: ctx => {
      console.log(ctx.url)
      const referer = ctx.header.referer || ''
      const retUrl = referer.split('//') || []
      const url = retUrl.length > 1 ? retUrl[1].split('/') : []
      //可跨域白名单
      const whiteList = ['uizph.com', 'www.uizph.com']

      if (whiteList.includes(url[0])) {
        return `${retUrl[0]}//${url[0]}`
      }
      return 'http://localhost:9200'
    },
    maxAge: 1728000,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'token'],
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
  })
)

// middlewares
app.use(require('./middleware/mongo')(config.get('mongodb'))) // mongodb

app.use(
  koaBody({
    multipart: true
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

// jwt路由拦截
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
// 添加jwt中间件
app.use(
  koaJwt({ secret: config.get('secret') }).unless({
    path: Unless
  })
)
// 检测token是否通过
// 检测token中是否包含isRefresh=true参数, 区分普通token与refreshToken
app.use(async (ctx, next) => {
  const { state } = ctx
  if (state.user && state.user.isRefresh) {
    ctx.status = 401
    ctx.body = {
      code: Code.ErrorToken.code,
      msg: Code.ErrorToken.msg
    }
  } else {
    await next()
  }
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms} ms`)
})

// routes
app.use(api.routes(), api.allowedMethods())
app.use(admin.routes(), admin.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
