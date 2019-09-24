const { Code, Paginate } = require('../../../libs/consts')

/**
 * 管理员 - 获取文章列表
 * @author 詹鹏辉
 * @create 2019-06-28 17:31:59
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

  const { status, keyword, toped } = ctx.query
  let query = {}

  status && (query.status = status)
  toped && (query.toped = toped)
  if (keyword) {
    query = Object.assign(query, {
      $or: [{ title: { $regex: keyword, $options: 'ix' } }, { content: { $regex: keyword, $options: 'ix' } }]
    })
  }

  await ctx.mongo.article.Article.paginate(
    query,
    {
      select: '_id title status type toped ip created last_revise',
      sort: { created: -1 },
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
 * 管理员 - 修改文章状态
 * @author 詹鹏辉
 * @create 2019-09-23 16:10:48
 */
exports.status = async (ctx, next) => {
  ctx.checkBody('status').notEmpty('修改状态不能为空')

  const { id } = ctx.params
  const { status } = ctx.request.body

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

  const find = await ctx.mongo.article.Article.findById(id)

  if (find) {
    find.status = status
    const result = await find.save()

    if (result) {
      ctx.body = {
        code: Code.OK.code,
        msg: Code.OK.msg
      }
    } else {
      ctx.body = {
        code: Code.NotFound.code,
        msg: '修改失败'
      }
    }
  } else {
    ctx.body = {
      code: Code.NotFound.code,
      msg: '未找到文章'
    }
  }
}

/**
 * 管理员 - 置顶文章
 * @author 詹鹏辉
 * @create 2019-09-23 16:46:21
 */
exports.toped = async ctx => {
  ctx.checkBody('status').notEmpty('修改状态不能为空')

  const { id } = ctx.params
  const { status } = ctx.request.body

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

  const find = await ctx.mongo.article.Article.findById(id)

  if (find) {
    find.toped = status
    const result = await find.save()

    if (result) {
      ctx.body = {
        code: Code.OK.code,
        msg: Code.OK.msg
      }
    } else {
      ctx.body = {
        code: Code.NotFound.code,
        msg: '修改失败'
      }
    }
  } else {
    ctx.body = {
      code: Code.NotFound.code,
      msg: '未找到文章'
    }
  }
}
