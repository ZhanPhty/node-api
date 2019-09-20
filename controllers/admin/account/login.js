const { token } = require('../../../libs/utils')
const { Code } = require('../../../libs/consts')

/**
 * 管理员后台用户登录
 * @author 詹鹏辉
 * @create 2019-09-19 16:50:31
 */
exports.login = async ctx => {
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
  let result = await ctx.mongo.account.User.login(account, password)

  if (result) {
    const adminToken = await token.createToken(result._id, config.get('secret'), { expiresIn: '1d' })
    await ctx.mongo.account.User.updateOne(
      { _id: result._id },
      {
        $set: { last_login: Date.now() }
      }
    )

    ctx.body = {
      code: Code.OK.code,
      msg: Code.OK.msg,
      data: {
        ...adminToken,
        adminInfo: result.format()
      }
    }
  } else {
    ctx.body = {
      code: Code.BadRequest.code,
      msg: '账户或密码错误'
    }
  }
}
