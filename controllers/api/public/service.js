const svgCaptcha = require('svg-captcha')
const { Code } = require('../../../libs/consts')

/**
 * 生成图形验证码
 * @return svg
 */
module.exports.captcha = async (ctx, next) => {
  const width = ctx.query.width ? parseInt(ctx.query.width) : 120
  const height = ctx.query.height ? parseInt(ctx.query.height) : 44
  let captcha = svgCaptcha.create({
    color: true,
    ignoreChars: '0o1i',
    fontSize: 42,
    noise: 2,
    width,
    height
  })

  // 开发环境可以从参数中接收图片验证码
  if (process.env.NODE_ENV === "development" && ctx.query.text) {
    captcha.text = ctx.query.text;
  }

  ctx.session.captcha = captcha.text
  ctx.body = captcha.data
  return
}

/**
 * 检测图片验证码
 * 获取session中的图片验证码，检测有效性
 * @return svg
 */
module.exports.checkCaptcha = async (ctx, next) => {
  ctx.checkBody('captcha').notEmpty('图片验证码不能为空!')

  let errors = []
  if (ctx.errors) {
    errors = ctx.errors
    ctx.body = { code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors }
    return
  }

  let captcha = ctx.request.body.captcha
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "test" &&
    (!ctx.session.captcha ||
      !captcha ||
      captcha.toLowerCase() !== ctx.session.captcha.toLowerCase())
  ) {
    errors = '图片验证码错误'
    ctx.body = { code: Code.BadRequest.code, msg: Code.BadRequest.msg, errors }
    return
  }
  ctx.session.captcha = null
  await next()
}
