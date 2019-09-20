const { Code } = require('../../../libs/consts')
const { token } = require('../../../libs/utils')

/**
 * 判断session是否存在
 * 获取用户登录状态
 */
exports.verify = async (ctx, next) => {
  if (ctx.header.token) {
    const check = await token.checkToken(ctx.header.token, config.get('secret'))

    if (check && check.exp) {
      await next()
    } else {
      ctx.status = 402
      ctx.body = {
        code: Code.ErrorToken.code,
        msg: Code.ErrorToken.msg
      }
    }
  }
}
