const { Code } = require('../../../libs/consts')

/**
 * 注册用户
 */
exports.register = async (ctx, next) => {
  ctx.checkBody('account').notEmpty("账号不能为空")
  ctx.checkBody('password').notEmpty("密码不能为空").len(6, '密码长度必须大于6位').md5()
  ctx.checkBody('email').notEmpty("邮箱不能为空").isEmail('邮箱格式不正确')
  ctx.checkBody('nick').optional().empty()

  let errors = []
  if (ctx.errors) {
    errors = ctx.errors
    ctx.body = { code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors }
    return
  }

  ctx.body = {
    code: Code.OK.code,
    msg: Code.OK.msg,
    data: {}
  }
}

/**
 * 检查用户名是否可用
 */
exports.checkUsername = async (ctx, next) => {
  ctx.checkQuery('username').notEmpty("用户名不能为空")

  let errors = []
  if (ctx.errors) {
    errors = ctx.errors
    ctx.body = { code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors }
    return
  }

  ctx.body = {
    code: Code.OK.code,
    data: null
  }

  // let user = await ctx.mongo.user.User.findOne({username:ctx.request.body.username, status:{$ne:'reject'}}).exec();
  // if(user) {
  //   ctx.body = {
  //     code: Code.OK.code, 
  //     msg: Code.OK.msg,
  //     data: {
  //       status: user.status
  //     }
  //   }
  // } else {
  //   ctx.body = {
  //     code: Code.OK.code,
  //     data: null
  //   }
  // }
}