const { Code } = require('../../../libs/consts')

/**
 * 获取banner广告图数据
 * @return svg
 */
module.exports.banner = async (ctx, next) => {
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

  let result = await ctx.mongo.common.Banner.find().sort({ index: -1 })
  result = result.map((item) => item.format())

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: result
  }
}
