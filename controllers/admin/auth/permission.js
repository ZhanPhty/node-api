const generate = require('nanoid/generate')
const { Code } = require('../../../libs/consts')

/**
 * 生成api的auth_key和auth_secret
 * 用于认证是否非法请求
 * @author 詹鹏辉
 * @create 2019-06-21 11:24:32
 */
exports.generateAuth = async (ctx, next) => {
  ctx.checkQuery('name').default('詹小辉')
  ctx.checkQuery('desc').default('詹小灰博客专用auth_secret')
  ctx.checkQuery('type').default('client')

  let errors = []
  if (ctx.errors) {
    errors = ctx.errors
    ctx.body = {
      code: Code.BadRequest.code,
      msg: Code.BadRequest.msg,
      errors
    }
    return
  }

  const word = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%'
  // 生成key(16位)和secret(32位)
  const authKey = generate(word, 16)
  const authSecret = generate(word, 32)

  let result = await ctx.mongo.auth.Permission.findOne({ authKey }).exec()
  if (result) {
    return (ctx.body = { code: Code.BadRequest.code, msg: '已经存在Key,无法生成' })
  } else {
    const { name, desc, type } = ctx.request.query
    const create = {
      name,
      desc,
      type,
      auth_key: authKey,
      auth_secret: authSecret
    }

    result = await ctx.mongo.auth.Permission.create(create)
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.formatClient()
    }
  }
}
