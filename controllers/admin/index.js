module.exports = {
  auth: {
    auth: require('./auth/auth')
  },
  account: {
    user: require('./account/user'),
    login: require('./account/login')
  },
  article: {
    article: require('./article/article'),
    type: require('./article/type'),
    category: require('./article/category'),
    tag: require('./article/tag'),
    banner: require('./article/banner')
  }
}
