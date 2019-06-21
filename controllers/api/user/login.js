const { token } = require('../../../libs/utils')
const { Code } = require('../../../libs/consts')

/**
 * 用户登录
 * @author 詹鹏辉
 * @create 2019-06-21 14:18:07
 */

exports.login = async (ctx, next) => {
  ctx.checkBody('account').notEmpty('账号不能为空')
  ctx.checkBody('password').notEmpty('密码不能为空')

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

  const { account, password } = ctx.request.body
  let result = await ctx.mongo.user.User.login(account, password)

  console.log(ctx.state.user)

  if (result) {
    token
      .createToken(result._id, config.get('secret'))
      .then(res => {
        ctx.body = {
          code: Code.OK.code,
          msg: Code.OK.msg,
          data: {
            token: res
          }
        }
      })
      .catch(() => {
        ctx.body = {
          code: Code.ErrorJwt.code,
          msg: Code.ErrorJwt.msg
        }
      })
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: '账户或密码错误'
    }
  }
}
