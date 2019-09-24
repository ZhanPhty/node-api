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

    const result = await ctx.mongo.account.User.create(create)
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.format()
    }
  }
}

/**
 * 编辑管理员资料
 * @author 詹鹏辉
 * @create 2019-09-19 10:17:22
 */
exports.update = async ctx => {
  ctx.checkBody('nick').notEmpty('标题不能为空')

  const { nick, cover } = ctx.request.body
  const body = Object.assign(ctx.state.account, { nick, cover })

  // 更新数据
  const result = await body.save()

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.format()
    }
  } else {
    return (ctx.body = {
      code: Code.Forbidden.code,
      msg: Code.Forbidden.msg
    })
  }
}

/**
 * 删除管理员资料
 * @author 詹鹏辉
 * @create 2019-09-19 10:34:22
 */
exports.delete = async ctx => {
  const { id } = ctx.params
  const result = await ctx.mongo.account.User.deleteMany({ _id: id })

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg
    }
  } else {
    return (ctx.body = {
      code: Code.Forbidden.code,
      msg: Code.Forbidden.msg
    })
  }
}

/**
 * 修改账号状态
 * status -> pending: 审核中; normal: 正常; reject: 禁用; freeze: 冻结;
 * @author 詹鹏辉
 * @create 2019-09-19 10:38:15
 */
exports.apply = async ctx => {
  ctx.checkBody('status').notEmpty('状态不能为空')

  const { status } = ctx.request.body
  const body = Object.assign(ctx.state.account, { status })
  const result = await body.save()

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg
    }
  } else {
    return (ctx.body = {
      code: Code.Forbidden.code,
      msg: '操作失败'
    })
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
      hasRoot: isRoot ? false : true
    }
  }
}

/**
 * 通过id,查询符合条件的用户id
 */
exports.getById = async (ctx, next) => {
  const { id } = ctx.params
  const result = await ctx.mongo.account.User.findById(id)

  if (result) {
    ctx.state.account = result
    await next()
  } else {
    return (ctx.body = {
      code: Code.NotFound.code,
      msg: '未找到管理员'
    })
  }
}
