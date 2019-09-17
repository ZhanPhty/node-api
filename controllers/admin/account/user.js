const generate = require('nanoid/generate')
const { Code, Paginate } = require('../../../libs/consts')
const { tool } = require('../../../libs/utils')


/**
 * 获取管理员列表
 * @author 詹鹏辉
 * @create 2019-09-17 16:13:15
 */
exports.list = async (ctx, next) => {
  const page = ctx.query.page ? parseInt(ctx.query.page) : 1
  const limit = ctx.query.pageSize ? parseInt(ctx.query.pageSize) : config.get('limit')

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

  await ctx.mongo.account.User.paginate(
    {},
    {
      select: '-password -password_salt',
      sort: { created: 1 },
      page,
      limit,
      customLabels: Paginate
    },
    (err, res) => {
      if (err) {
        ctx.body = {
          code: Code.BadRequest.code,
          msg: Code.BadRequest.msg,
          errors
        }
      } else {
        ctx.body = {
          code: Code.OK.code,
          msg: Code.OK.msg,
          data: res
        }
      }
    }
  )
}

/**
 * 创建管理员账号
 * 首次创建为超级管理员账号，之后创建只能是普通管理员
 * @author 詹鹏辉
 * @create 2019-09-16 17:20:35
 */
exports.createRoot = async (ctx, next) => {
  // 当用户没有填写昵称时，默认生产一个用户昵称
  const nickDef = `管理员-${generate('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)}`
  ctx
    .checkBody('account')
    .notEmpty('账号不能为空')
    .match(/^[\d-_+<>.a-zA-Z]+$/, '包含非法的字符')
  ctx
    .checkBody('password')
    .notEmpty('密码不能为空')
    .len(6, '密码长度必须大于6位')
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

  let isRoot = await ctx.mongo.account.User.findOne({ is_root: true }).exec()
  let user = await ctx.mongo.account.User.findOne({ account: ctx.request.body.account }).exec()

  if (user) {
    return (ctx.body = { code: Code.BadRequest.code, msg: '已经存在的用户名' })
  } else {
    const { account, password, nick, cover } = ctx.request.body
    const salt = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
    const create = {
      account,
      nick,
      cover,
      password: tool.md5(password + salt),
      password_salt: salt,
      is_root: isRoot ? false : true
    }

    result = await ctx.mongo.account.User.create(create)
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.format()
    }
  }
}

/**
 * 登录管理员后台
 * 登录设置session.adminId
 * @author 詹鹏辉
 * @create 2019-09-17 10:39:23
 */
exports.login = async (ctx, next) => {
  ctx.checkBody('account').notEmpty('账号不能为空')
  ctx.checkBody('password').notEmpty('密码不能为空')

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

  const { account, password } = ctx.request.body
  let result = await ctx.mongo.account.User.login(account, password)

  console.log(result)

  if (result) {
    await ctx.mongo.account.User.updateOne(
      { _id: result._id },
      {
        $set: { last_login: Date.now() }
      }
    )
    // 设置session
    ctx.session.adminId = result._id

    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: {
        ...result.format()
      }
    }
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: '账户或密码错误'
    }
  }
}

/**
 * 退出登录
 */
exports.loginOut = async (ctx) => {
  ctx.session = null
  ctx.body = {
    code: 200,
    msg: '退出成功'
  }
}

/**
 * 查询是否存在超级管理员账号
 * 不存在则可以创建一个唯一的超级管理员账号
 */
exports.getFindRoot = async (ctx, next) => {
  const isRoot = await ctx.mongo.account.User.findOne({ is_root: true }).exec()

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: {
      hasRoot: isRoot ? false : true,
      hasLogin: ctx.session.adminId ? true : false
    }
  }
}
