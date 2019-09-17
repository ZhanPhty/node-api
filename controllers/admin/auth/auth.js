const { Code } = require('../../../libs/consts')

/**
 * 判断session是否存在
 * 获取用户登录状态
 */
exports.verify = async (ctx, next) => {
  if (ctx.session && ctx.session.adminId) {
    await next()
  } else {
    ctx.status = Code.AuthorizationExpired.code
    ctx.body = {
      code: Code.AuthorizationExpired.code,
      msg: Code.AuthorizationExpired.msg
    }
  }
}
