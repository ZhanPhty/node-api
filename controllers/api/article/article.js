const { Code, Paginate } = require('../../../libs/consts')
const { tool } = require('../../../libs/utils')

/**
 * 博客文章列表
 * 只查询status=online、is_private=false的文字
 * 查询结果排除is_private、status、content字段
 * @link https://mongoosejs.com/docs/api.html#query_Query-select
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

  await ctx.mongo.article.Article.paginate(
    { status: 'online', is_private: false },
    {
      select: '-is_private -status -content -delete_at',
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
 * 查询单条数据
 * 返回文章详情
 */
exports.single = async (ctx, next) => {
  console.log(ctx.state.article)
  const item = ctx.state.article
  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: item.formatArticle()
  }
}

/**
 * 发布文章
 * @author 詹鹏辉
 * @create 2019-06-27 17:42:00
 * @param {String} title            文章标题
 * @param {String} summary          文章简介，不填写则从文章内提取
 * @param {String} content          内容，不上传则从文章内提取
 * @param {Array} tags              文章标签
 * @param {String} type             文章类型
 * @param {String} category         博文分类
 * @param {String} cover            博文封面
 * @param {Boolean} isPrivate       是否私密文章
 * @param {String} status           状态：草稿-'draft'、上线-'online', 软删除-'delete', 默认'draft'
 * @param {String} seo.title        seo的title
 * @param {String} seo.keywords     seo的key
 * @param {String} seo.description  seo的desc
 */

exports.publish = async (ctx, next) => {
  ctx.checkBody('title').notEmpty('标题不能为空')
  ctx.checkBody('content').notEmpty('内容不能为空')
  ctx.checkBody('type').notEmpty('文章类型不能为空')
  ctx.checkBody('category').notEmpty('博文分类不能为空')

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

  const userInfo = await ctx.mongo.user.User.findOne({ _id: ctx.state.user.uid }).exec()
  const body = ctx.request.body
  const summaryStr = body.summary || tool.filterHtml(body.content).substring(0, 240)

  if (userInfo && userInfo.type === 'admin') {
    const create = {
      title: body.title,
      content: body.content,
      summary: summaryStr,
      cover: body.cover,
      tags: body.tags,
      type: body.type,
      type_url: body.typeUrl,
      category: body.category,
      is_private: body.isPrivate,
      status: body.status,
      seo: body.seo,
      user_info: {
        id: userInfo._id,
        nick: userInfo.nick,
        cover: userInfo.cover,
        type: userInfo.type,
        is_root: userInfo.is_root
      }
    }
    const result = await ctx.mongo.article.Article.create(create)

    return (ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.formatArticle()
    })
  } else {
    return (ctx.body = {
      code: Code.Forbidden.code,
      msg: '权限不足，无法发布文章'
    })
  }
}

/**
 * 编辑文章
 */
exports.update = async (ctx, next) => {
  ctx.checkBody('title').notEmpty('标题不能为空')
  ctx.checkBody('content').notEmpty('内容不能为空')
  ctx.checkBody('type').notEmpty('文章类型不能为空')
  ctx.checkBody('category').notEmpty('博文分类不能为空')

  const summaryStr = ctx.request.body.summary || tool.filterHtml(ctx.request.body.content).substring(0, 200)
  let body = Object.assign(ctx.state.article, ctx.request.body)

  body.summary = summaryStr
  body.lastRevise = Date.now()
  await body.save()

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: body.formatArticle()
  }
}

/**
 * 删除文章 - 软删除
 * 状态：草稿-'draft'、上线-'online', 软删除-'delete'
 * 将状态设置成: delete
 */
exports.delete = async (ctx, next) => {
  const body = ctx.state.article

  body.status = 'delete'
  body.delete_at = Date.now()
  body.save()

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg
  }
}

/**
 * 通过id,查询符合条件的文章
 * 返回文章详情
 */
exports.getById = async (ctx, next) => {
  try {
    const { id } = ctx.params
    const result = await ctx.mongo.article.Article.findById(id)

    ctx.state.article = result
    await next()
  } catch {
    ctx.body = {
      code: Code.NotFound.code,
      msg: '未找到文章'
    }
    return
  }
}
