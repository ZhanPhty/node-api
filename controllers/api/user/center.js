const generate = require('nanoid/generate')
const { tool } = require('../../../libs/utils')
const { Code, Paginate } = require('../../../libs/consts')

/**
 * 获取用户信息 - 未登录状态通过id获取
 * @author 詹鹏辉
 * @create 2019-09-06 14:08:30
 */
exports.other = async ctx => {
  ctx.checkParams('id').notEmpty('用户id不存在')

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
  const result = await ctx.mongo.user.User.findOne({ _id: id })
  const articleCount = await ctx.mongo.article.Article.countDocuments({
    'user_info.id': id,
    status: 'online',
    is_private: false
  })
  const likeCount = await ctx.mongo.article.Like.countDocuments({ user_id: id })

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: {
        ...result.formatClient(),
        articleCount: articleCount || 0,
        likeCount: likeCount || 0
      }
    }
  } else {
    ctx.body = {
      code: Code.InternalServerError.code,
      msg: Code.InternalServerError.msg
    }
  }
}

/**
 * 获取用户信息
 * @author 詹鹏辉
 * @create 2019-09-06 14:08:30
 */
exports.info = async ctx => {
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

  let result = await ctx.mongo.user.User.findOne({ _id: ctx.state.user.uid })

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.formatClient()
    }
  } else {
    ctx.body = {
      code: Code.InternalServerError.code,
      msg: Code.InternalServerError.msg
    }
  }
}

/**
 * 更新用户信息
 * @author 詹鹏辉
 * @create 2019-09-06 14:45:18
 * @param {String} field            需要更新的字段[nick, summary, phone, web]
 * @param {String} value            更新的值
 */
exports.update = async ctx => {
  ctx.checkBody('field').notEmpty('修改的字段不能为空')
  ctx.checkBody('value').notEmpty('修改的值不能为空')

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

  const { field, value } = ctx.request.body
  let result = await ctx.mongo.user.User.findOneAndUpdate(
    { _id: ctx.state.user.uid },
    {
      $set: { [field]: value }
    },
    { new: true, useFindAndModify: false }
  )

  if (result) {
    // 更新文章表中的信息
    await ctx.mongo.article.Article.updateMany(
      { 'user_info.id': result.id.toString() },
      {
        $set: {
          user_info: {
            id: result.id,
            nick: result.nick,
            cover: result.cover,
            type: result.type,
            is_root: result.is_root,
            level: result.level
          }
        }
      }
    )

    // 更新评论表的信息
    await ctx.mongo.article.Comment.updateMany(
      { user_id: result.id.toString() },
      {
        nick: result.nick,
        type: result.type,
        cover: result.cover
      }
    )
    await ctx.mongo.article.Comment.updateMany(
      { parent_id: result.id.toString() },
      {
        parent_nick: result.nick
      }
    )

    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: result.formatClient()
    }
  } else {
    ctx.body = {
      code: Code.InternalServerError.code,
      msg: Code.InternalServerError.msg
    }
  }
}

/**
 * 重置密码
 * @author 詹鹏辉
 * @create 2019-09-06 16:58:23
 */
exports.reset = async ctx => {
  ctx
    .checkBody('oldPassword')
    .notEmpty('旧密码不能为空')
    .len(6, '旧密码长度必须大于6位')
  ctx
    .checkBody('newPassword')
    .notEmpty('新密码不能为空')
    .len(6, '新密码长度必须大于6位')

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

  const salt = generate('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)
  const { oldPassword, newPassword } = ctx.request.body
  let result = await ctx.mongo.user.User.findOne({ _id: ctx.state.user.uid })

  if (result) {
    if (tool.md5(oldPassword + result.password_salt) === result.password) {
      const update = await result.updateOne({
        $set: {
          password_salt: salt,
          password: tool.md5(newPassword + salt)
        }
      })

      if (update) {
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
        msg: '原密码不正确'
      }
    }
  } else {
    ctx.body = {
      code: Code.InternalServerError.code,
      msg: Code.InternalServerError.msg
    }
  }
}

/**
 * 获取发布的文章 - 未登录状态通过id获取
 * @author 詹鹏辉
 * @create 2019-09-09 15:14:28
 */
exports.article = async ctx => {
  ctx.checkParams('id').notEmpty('用户id不存在')

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
  const page = ctx.query.page ? parseInt(ctx.query.page) : 1
  const limit = ctx.query.pageSize ? parseInt(ctx.query.pageSize) : config.get('limit')

  await ctx.mongo.article.Article.paginate(
    { status: 'online', is_private: false, 'user_info.id': id },
    {
      select: '-is_private -status -content -delete_at',
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
 * 获取喜欢的文章 - 未登录状态通过id获取
 * @author 詹鹏辉
 * @create 2019-09-09 15:24:24
 */
exports.like = async ctx => {
  ctx.checkParams('id').notEmpty('用户id不存在')

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
  const page = ctx.query.page ? parseInt(ctx.query.page) : 1
  const limit = ctx.query.pageSize ? parseInt(ctx.query.pageSize) : config.get('limit')
  const likes = await ctx.mongo.article.Like.find({ user_id: id })
  const resLikes = likes.map(item => item.article_id) || []

  await ctx.mongo.article.Article.paginate(
    { status: 'online', is_private: false, _id: { $in: resLikes } },
    {
      select: '-is_private -status -content -delete_at',
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
