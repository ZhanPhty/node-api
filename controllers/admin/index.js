module.exports = {
  auth: {
    auth: require('./auth/auth')
  },
  account: {
    user: require('./account/user'),
    login: require('./account/login')
  },
  article: {
    article: require('./article/article')
  }
}
