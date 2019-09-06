const { Code } = require('../../../libs/consts')
const requestIp = require('request-ip')

/**
 * 博客文章点赞
 * @author 詹鹏辉
 * @create 2019-08-30 11:10:13
 * @param {String} id             文章id
 */
exports.like = async (ctx, next) => {
  const { id } = ctx.params
  const clientIp = requestIp.getClientIp(ctx)

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

  const create = {
    article_id: id,
    user_id: ctx.state.user.uid
  }
  const find = await ctx.mongo.article.Like.findOne({ ...create }).exec()

  if (!find) {
    const result = await ctx.mongo.article.Like.create({
      ...create,
      ip: clientIp
    })

    // 更新文章的点赞数量
    const count = await ctx.mongo.article.Like.findLikeDoc(id)
    ctx.mongo.article.Article.updateCount('praise', id, count)

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
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: '不可重复操作'
    }
  }
}

/**
 * 博客文章取消点赞
 * @author 詹鹏辉
 * @create 2019-08-30 11:10:06
 * @param {String} id             文章id
 */
exports.removeLike = async (ctx, next) => {
  const { id } = ctx.params

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

  const create = {
    article_id: id,
    user_id: ctx.state.user.uid
  }
  const result = await ctx.mongo.article.Like.deleteMany(create)

  // 更新文章的点赞数量
  const count = await ctx.mongo.article.Like.findLikeDoc(id)
  ctx.mongo.article.Article.updateCount('praise', id, count)

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

/**
 * 获取评论列表
 * @author 詹鹏辉
 * @create 2019-08-30 15:48:20
 * @param {String} id             文章id
 */
exports.list = async (ctx, next) => {
  const { id } = ctx.params

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

  const result = await ctx.mongo.article.Comment.findComments(id)
  // 更新文章的点赞数量
  const count = await ctx.mongo.article.Comment.findCommentDoc(id)
  ctx.mongo.article.Article.updateCount('review', id, count)

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result
    }
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: Code.BadRequest.msg
    }
  }
}

/**
 * 发布评论
 * @author 詹鹏辉
 * @create 2019-08-30 15:48:20
 * @param {String} id             文章id
 */
exports.comment = async (ctx, next) => {
  ctx.checkBody('content').notEmpty('评论内容不能为空')
  ctx
    .checkBody('replyUser')
    .empty()
    .default('')

  const { id } = ctx.params
  const body = ctx.request.body
  const { uid } = ctx.state.user
  const clientIp = requestIp.getClientIp(ctx)

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

  const { user_info } = await ctx.mongo.article.Article.findOne({ _id: id }).exec()
  const { nick, cover, level, type, is_root } = await ctx.mongo.user.User.findUserInfo(uid)
  let replyInfo = {}
  if (body.replyUser !== '') {
    replyInfo = await ctx.mongo.user.User.findOne({ _id: body.replyUser }).exec()
  }

  console.log(replyInfo)

  console.log(user_info)

  const create = {
    article_id: id,
    target_id: body.targetId,
    author: user_info.id === uid,
    user_id: uid,
    nick,
    cover,
    level,
    type,
    is_root,
    parent_id: replyInfo._id,
    parent_nick: replyInfo.nick,
    parent_author: (replyInfo._id && replyInfo._id.toString()) === user_info.id,
    content: body.content,
    status: body.targetId !== '' ? '0' : '1',
    ip: clientIp
  }

  const result = await ctx.mongo.article.Comment.create(create)

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.format()
    }
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: Code.BadRequest.msg
    }
  }
}
