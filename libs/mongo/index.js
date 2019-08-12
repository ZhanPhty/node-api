module.exports = (blog, admin) => {
  const model = {
    auth: {
      Permission: admin.model('permission', require('./auth/permission'))
    },
    user: {
      User: blog.model('user', require('./user/user'))
    },
    article: {
      Article: blog.model('article', require('./article/article'))
    },
    select: {
      Types: blog.model('type', require('./select/types')),
      Category: blog.model('category', require('./select/category')),
      Tag: blog.model('tag', require('./select/tag'))
    }
  }

  // 加载鉴别
  // model.user.User.loadDiscriminators();

  return model
}
