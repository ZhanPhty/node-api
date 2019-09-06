const { Code } = require('../../../libs/consts')

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
            is_root: result.is_root
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

  const { oldPassword, newPassword } = ctx.request.body
  let result = await ctx.mongo.user.User.findOne({ _id: ctx.state.user.uid })
  console.log(result)

  if (result) {
    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: []
    }
  } else {
    ctx.body = {
      code: Code.InternalServerError.code,
      msg: Code.InternalServerError.msg
    }
  }
}
