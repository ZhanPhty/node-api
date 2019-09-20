const svgCaptcha = require('svg-captcha')
const nodemailer = require('nodemailer')
const { Code } = require('../../../libs/consts')

/**
 * 生成图形验证码
 * @return svg
 */
module.exports.captcha = async (ctx, next) => {
  const width = ctx.query.width ? parseInt(ctx.query.width) : 120
  const height = ctx.query.height ? parseInt(ctx.query.height) : 44
  let captcha = svgCaptcha.create({
    color: false,
    ignoreChars: '0oO1ilLIjJaq',
    fontSize: 42,
    noise: 3,
    width,
    height
  })

  // 开发环境可以从参数中接收图片验证码
  if (process.env.NODE_ENV === 'development' && ctx.query.text) {
    captcha.text = ctx.query.text
  }

  ctx.body = captcha.data
  return
}

/**
 * 检测图片验证码
 * @return svg
 */
module.exports.checkCaptcha = async (ctx, next) => {
  ctx.checkBody('captcha').notEmpty('图片验证码不能为空!')

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

  // session 无效
  // let captcha = ctx.request.body.captcha
  // if (
  //   process.env.NODE_ENV !== 'development' &&
  //   (!ctx.session.captcha || !captcha || captcha.toLowerCase() !== ctx.session.captcha.toLowerCase())
  // ) {
  //   ctx.body = {
  //     code: Code.BadRequest.code,
  //     msg: '图片验证码错误'
  //   }
  //   return
  // }
  // ctx.session.captcha = null
  await next()
}

/**
 * 发送通知邮箱
 */
module.exports.sendMail = async (ctx, next) => {
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

  const { email } = ctx.request.body

  const transporter = nodemailer.createTransport({
    host: 'smtpdm.aliyun.com',
    port: 25,
    //"secureConnection": true, // use SSL, the port is 465
    auth: {
      user: 'feedback@service.uizph.com',
      pass: 'ZhanPengHui546392706'
    }
  })

  const mailOptions = {
    from: '詹小灰博客<feedback@service.uizph.com>',
    to: email,
    subject: '小灰哥博客-注册成功通知',
    html: '<p>感谢你注册小灰哥博客，点击<a href="http://www.uizph.com">www.uizph.com</a>跳转</p>'
  }

  transporter.sendMail(mailOptions, function(error) {
    if (error) {
      return console.log(error)
    }
  })
}
