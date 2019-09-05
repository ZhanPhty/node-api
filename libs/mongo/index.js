module.exports = (blog, admin) => {
  const model = {
    auth: {
      Permission: admin.model('permission', require('./auth/permission'))
    },
    common: {
      Banner: blog.model('banner', require('./common/banner'))
    },
    user: {
      User: blog.model('user', require('./user/user'))
    },
    article: {
      Article: blog.model('article', require('./article/article')),
      Like: blog.model('like', require('./article/like')),
      Comment: blog.model('comment', require('./article/comment'))
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
