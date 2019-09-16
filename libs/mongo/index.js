module.exports = (blog, admin) => {
  const model = {
    // admin
    account: {
      User: admin.model('user', require('./admin/account/user'))
    },

    // api
    common: {
      Banner: blog.model('banner', require('./api/common/banner'))
    },
    user: {
      User: blog.model('user', require('./api/user/user'))
    },
    article: {
      Article: blog.model('article', require('./api/article/article')),
      Like: blog.model('like', require('./api/article/like')),
      Comment: blog.model('comment', require('./api/article/comment'))
    },
    select: {
      Types: blog.model('type', require('./api/select/types')),
      Category: blog.model('category', require('./api/select/category')),
      Tag: blog.model('tag', require('./api/select/tag'))
    }
  }

  // 加载鉴别
  // model.user.User.loadDiscriminators();

  return model
}
