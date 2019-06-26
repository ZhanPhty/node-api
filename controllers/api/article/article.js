const { Code } = require('../../../libs/consts')

/**
 * 用户登录
 * @author 詹鹏辉
 * @create 2019-06-21 14:18:07
 */

exports.list = async (ctx, next) => {

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

  return ctx.body = {
    code: Code.BadRequest.code,
    msg: '账户或密码错误'
  }
}
