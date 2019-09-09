const generate = require('nanoid/generate')
const { tool } = require('../../../libs/utils')
const { Code } = require('../../../libs/consts')

/**
 * 注册用户
 */
exports.register = async (ctx, next) => {
  // 当用户没有填写昵称时，默认生产一个用户昵称
  const nickDef = `新用户-${generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)}`
  ctx
    .checkBody('account')
    .notEmpty('账号不能为空')
    .match(/^[\d-_+<>.a-zA-Z]+$/, '包含非法的字符')
  ctx
    .checkBody('password')
    .notEmpty('密码不能为空')
    .len(6, '密码长度必须大于6位')
  ctx
    .checkBody('email')
    .notEmpty('邮箱不能为空')
    .isEmail('邮箱格式不正确')
  ctx
    .checkBody('nick')
    .optional()
    .empty()
    .default(nickDef)

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

  let user = await ctx.mongo.user.User.findOne({ account: ctx.request.body.account }).exec()
  let email = await ctx.mongo.user.User.findOne({ email: ctx.request.body.email }).exec()

  if (user) {
    return (ctx.body = { code: Code.BadRequest.code, msg: '已经存在的用户名' })
  } else if (email) {
    return (ctx.body = { code: Code.BadRequest.code, msg: '已经存在的邮箱' })
  } else {
    const { account, password, email, nick } = ctx.request.body
    const salt = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
    const create = {
      account,
      email,
      nick,
      password: tool.md5(password + salt),
      password_salt: salt,
      type: 'client'
    }
    user = await ctx.mongo.user.User.create(create)

    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: user.formatClient()
    }

    await next()
  }
}

/**
 * 检查用户名是否可用
 */
exports.checkUsername = async (ctx, next) => {
  ctx.checkQuery('username').notEmpty('用户名不能为空')

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

  let result = await ctx.mongo.user.User.findOne({ account: ctx.request.body.account }).exec()

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: result
  }
}
