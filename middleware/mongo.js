const mongoose = require('mongoose')

module.exports = opt => {
  const blog = mongoose.createConnection(opt.blog.host, opt.blog.extra, err => {
    if (err) {
      console.error('mongodb-blog 链接失败！', err)
    }
  })
  const admin = mongoose.createConnection(opt.admin.host, opt.admin.extra, err => {
    if (err) {
      console.error('mongodb-admin 链接失败！', err)
    }
  })

  return async (ctx, next) => {
    ctx.mongo = require('../libs/mongo')(blog, admin)
    await next()
  }
}
