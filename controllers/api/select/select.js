const { Code } = require('../../../libs/consts')

/**
 * 文章类型
 * 文章类型，原创、转载、引用等
 * @return
 */
module.exports.types = async (ctx, next) => {
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

  let result = await ctx.mongo.select.Types.find()
  result = result.map(item => item.format())

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: result
  }
}

/**
 * 博客分类
 * 博文的分类
 * @return
 */
module.exports.category = async (ctx, next) => {
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

  let result = await ctx.mongo.select.Category.find()
  result = result.map(item => {
    return item.format()
  })

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: result
  }
}

/**
 * 博客类型
 * @return
 */
module.exports.tag = async (ctx, next) => {
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

  let result = await ctx.mongo.select.Tag.find()
  result = result.map(item => {
    return item.format()
  })

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: result
  }
}
