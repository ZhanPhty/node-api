const { Code, Paginate } = require('../../../libs/consts')

/**
 * 管理员 - 获取文章标签列表
 * @author 詹鹏辉
 * @create 2019年09月24日16:42:11
 * @param {Number} page           分页
 * @param {Number} pageSize       页码
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

  await ctx.mongo.select.Tag.paginate(
    {},
    {
      sort: { _id: -1 },
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
 * 管理员 - 创建文章分类
 * @author 詹鹏辉
 * @create 2019-09-24 16:36:07
 * @param {Number} name           分类名称
 */
exports.create = async (ctx, next) => {
  ctx.checkBody('name').notEmpty('名称不能为空')

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

  let find = await ctx.mongo.select.Tag.findOne({ name: ctx.request.body.name }).exec()

  if (find) {
    return (ctx.body = { code: Code.BadRequest.code, msg: '分类名称已存在' })
  } else {
    const { name } = ctx.request.body
    const create = {
      name
    }
    const result = await ctx.mongo.select.Tag.create(create)

    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result
    }
  }
}

/**
 * 管理员 - 获取文章类型列表
 * @author 詹鹏辉
 * @create 2019-09-24 11:19:53
 * @param {Number} page           分页
 * @param {Number} pageSize       页码
 */
exports.update = async (ctx, next) => {
  ctx.checkBody('name').notEmpty('名称不能为空')

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

  const { id } = ctx.params
  const { name } = ctx.request.body
  const find = await ctx.mongo.select.Tag.findById(id)
  const body = Object.assign(find, { name })

  // 更新数据
  const result = await body.save()

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result
    }
  } else {
    return (ctx.body = {
      code: Code.Forbidden.code,
      msg: Code.Forbidden.msg
    })
  }
}

/**
 * 管理员 - 删除标签
 * @author 詹鹏辉
 * @create 2019年09月24日17:07:45
 */
exports.del = async (ctx, next) => {
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

  const { id } = ctx.params
  const result = await ctx.mongo.select.Tag.deleteMany({
    _id: id
  })

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg
    }
  } else {
    ctx.body = {
      code: Code.InternalServerError.code,
      msg: Code.InternalServerError.msg
    }
  }
}
