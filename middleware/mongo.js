const mongoose = require('mongoose')

module.exports = (opt) => {
  const blog = mongoose.createConnection(opt.blog.host, opt.blog.extra, err => {
    if (err) {
      console.error('mongodb 链接失败！', err);
    }
  })

  return async (ctx, next) => {
    ctx.mongo = require('../libs/mongo')(blog)
    await next()
  }
}
