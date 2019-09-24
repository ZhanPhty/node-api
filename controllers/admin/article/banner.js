const { Code, Paginate } = require('../../../libs/consts')

/**
 * 管理员 - 获取文章分类列表
 * @author 詹鹏辉
 * @create 2019-09-24 16:28:22
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

  await ctx.mongo.common.Banner.paginate({},
    {
      sort: { index: -1 },
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
 * 管理员 - 创建轮播图
 * @author 詹鹏辉
 * @create 2019-09-24 16:36:07
 * @param {Number} cover          banner封面图
 * @param {Number} goUrl          跳转url
 * @param {Number} title          标题
 * @param {Number} index          排序
 * @param {Number} summary        简介
 * @param {Number} expires        有效期
 */
exports.create = async (ctx, next) => {
  ctx
    .checkBody('cover')
    .notEmpty('封面图不能为空')
  ctx
    .checkBody('index')
    .notEmpty('排序不能为空')

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

  const { cover, goUrl, title, index, summary, expires } = ctx.request.body
  const create = {
    cover, title, index, summary, expires,
    go_url: goUrl
  }

  console.log(create)
  const result = await ctx.mongo.common.Banner.create(create)

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
 * 管理员 - 获取文章类型列表
 * @author 詹鹏辉
 * @create 2019-09-24 11:19:53
 * @param {Number} page           分页
 * @param {Number} pageSize       页码
 */
exports.update = async (ctx, next) => {
  ctx
    .checkBody('name')
    .notEmpty('名称不能为空')

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
  const find = await ctx.mongo.select.Category.findById(id)
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
 * 管理员 - 删除banner
 * @author 詹鹏辉
 * @create 2019年09月24日17:07:18
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
  const result = await ctx.mongo.common.Banner.deleteMany({
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
